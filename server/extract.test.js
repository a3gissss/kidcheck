import { describe, it, expect, vi } from 'vitest'
import { buildSchema, sanitize, extractFields, handleExtractRequest, createRateLimiter, MAX_TEXT, DEFAULT_MODEL } from './extract.js'
import { ALL_FIELDS, emptyFields } from '../src/lib/fields.js'
import evalCases from '../eval/cases.json'

// A stand-in for the Gemini client so tests need no key or internet.
function fakeClient(output) {
  return {
    interactions: {
      create: vi.fn(async () => {
        if (output instanceof Error) throw output
        return { output_text: typeof output === 'string' ? output : JSON.stringify(output) }
      }),
    },
  }
}

const allowAll = () => true
const request = (overrides = {}) => ({
  method: 'POST',
  body: { text: 'Boy, 18 months, vomits everything.' },
  ip: '1.2.3.4',
  env: {},
  limiter: allowAll,
  ...overrides,
})

describe('buildSchema', () => {
  it('has every checklist field, all nullable and required', () => {
    const schema = buildSchema()
    expect(Object.keys(schema.properties)).toEqual(ALL_FIELDS.map((f) => f.key))
    expect(schema.required).toHaveLength(ALL_FIELDS.length)
    for (const prop of Object.values(schema.properties)) expect(prop.type).toContain('null')
  })

  it('limits choices to the allowed values', () => {
    expect(buildSchema().properties.muacColour.enum).toEqual(['red', 'yellow', 'green', null])
    expect(buildSchema().properties.convulsions.type).toEqual(['boolean', 'null'])
  })
})

describe('sanitize (never trust model output)', () => {
  it('keeps valid values', () => {
    const { fields, filled } = sanitize({ ageMonths: 18, sex: 'male', vomitsEverything: true, cough: true, coughDays: 3 })
    expect(fields).toMatchObject({ ageMonths: 18, sex: 'male', vomitsEverything: true, coughDays: 3 })
    expect(filled).toEqual(['ageMonths', 'sex', 'vomitsEverything', 'cough', 'coughDays'])
  })

  it.each([
    ['ageMonths', 18.5],
    ['ageMonths', 500],
    ['ageMonths', '18'],
    ['convulsions', 'yes'],
    ['muacColour', 'blue'],
    ['sex', 'boy'],
  ])('turns invalid %s = %o into null', (key, value) => {
    expect(sanitize({ [key]: value }).fields[key]).toBeNull()
  })

  it('drops unknown keys and non-object output', () => {
    expect(sanitize({ diagnosis: 'pneumonia' }).fields).not.toHaveProperty('diagnosis')
    expect(sanitize('nonsense').filled).toEqual([])
    expect(sanitize(null).filled).toEqual([])
  })

  it('clears follow-ups whose question is not Yes', () => {
    expect(sanitize({ cough: false, coughDays: 3 }).fields.coughDays).toBeNull()
    expect(sanitize({ coughDays: 3 }).fields.coughDays).toBeNull()
  })
})

describe('extractFields', () => {
  it('sends the text with the schema, temperature 0 and store false', async () => {
    const client = fakeClient({ ageMonths: 18 })
    const result = await extractFields('Boy 18 months', { client })
    const call = client.interactions.create.mock.calls[0][0]
    expect(call).toMatchObject({ model: DEFAULT_MODEL, input: 'Boy 18 months', store: false, generation_config: { temperature: 0 } })
    expect(call.response_format.schema).toEqual(buildSchema())
    expect(result).toMatchObject({ fields: { ageMonths: 18 }, filled: ['ageMonths'], model: DEFAULT_MODEL })
  })

  it('rejects output that is not JSON', async () => {
    await expect(extractFields('x', { client: fakeClient('not json') })).rejects.toThrow('invalid JSON')
  })
})

describe('handleExtractRequest', () => {
  it('only accepts POST', async () => {
    expect((await handleExtractRequest(request({ method: 'GET' }))).status).toBe(405)
  })

  it.each([
    [null, 'empty'],
    [{}, 'empty'],
    [{ text: '   ' }, 'empty'],
    [{ text: 42 }, 'empty'],
    [{ text: 'a'.repeat(MAX_TEXT + 1) }, 'too_long'],
  ])('rejects body %o', async (body, error) => {
    const res = await handleExtractRequest(request({ body }))
    expect(res.status).toBe(400)
    expect(res.body.error).toBe(error)
  })

  it('says when no key is set up', async () => {
    const res = await handleExtractRequest(request())
    expect(res.status).toBe(503)
    expect(res.body.error).toBe('no_key')
  })

  it('returns fields on success', async () => {
    const res = await handleExtractRequest(request({ client: fakeClient({ ageMonths: 18, vomitsEverything: true }) }))
    expect(res.status).toBe(200)
    expect(res.body.fields.vomitsEverything).toBe(true)
  })

  it('uses GEMINI_MODEL when set', async () => {
    const res = await handleExtractRequest(request({ env: { GEMINI_MODEL: 'some-model' }, client: fakeClient({}) }))
    expect(res.body.model).toBe('some-model')
  })

  it('reports quota errors and other AI failures without crashing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const quota = await handleExtractRequest(request({ client: fakeClient(Object.assign(new Error('quota'), { status: 429 })) }))
    expect(quota.status).toBe(429)
    expect(quota.body.error).toBe('quota')
    const failed = await handleExtractRequest(request({ client: fakeClient(new Error('network')) }))
    expect(failed.status).toBe(502)
  })

  it('never logs the description text', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await handleExtractRequest(request({ body: { text: 'SECRET-DESCRIPTION' }, client: fakeClient(new Error('boom')) }))
    expect(JSON.stringify(spy.mock.calls)).not.toContain('SECRET-DESCRIPTION')
  })

  it('rate limits per IP', async () => {
    const limiter = createRateLimiter({ limit: 2 })
    const client = fakeClient({})
    const statuses = []
    for (let i = 0; i < 3; i++) statuses.push((await handleExtractRequest(request({ limiter, client }))).status)
    expect(statuses).toEqual([200, 200, 429])
    expect((await handleExtractRequest(request({ limiter, client, ip: '5.6.7.8' }))).status).toBe(200)
  })
})

describe('eval/cases.json labels', () => {
  it.each(evalCases.map((c) => [c.id, c]))('case %i is a valid, complete answer', (_, c) => {
    const { fields } = sanitize(c.expected)
    expect(fields).toEqual({ ...emptyFields(), ...c.expected })
  })
})

describe('createRateLimiter', () => {
  it('allows again after the window', () => {
    const allow = createRateLimiter({ limit: 1, windowMs: 1000 })
    expect(allow('a', 0)).toBe(true)
    expect(allow('a', 500)).toBe(false)
    expect(allow('a', 1500)).toBe(true)
  })
})
