import { describe, it, expect, vi, afterEach } from 'vitest'
import handler from '../api/extract.js'

// Vercel calls the function with Node's request plus helper methods on the
// response (res.status().json()). These stand-ins check that contract.
function fakeRes() {
  const res = { statusCode: null, body: null }
  res.status = vi.fn((code) => {
    res.statusCode = code
    return res
  })
  res.json = vi.fn((body) => {
    res.body = body
    return res
  })
  return res
}

const req = (overrides = {}) => ({
  method: 'POST',
  headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
  body: { text: 'Boy, 18 months, vomits everything.' },
  socket: { remoteAddress: '10.0.0.1' },
  ...overrides,
})

afterEach(() => vi.unstubAllEnvs())

describe('api/extract (Vercel function)', () => {
  it('answers JSON with the right status when no key is set', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const res = fakeRes()
    await handler(req(), res)
    expect(res.statusCode).toBe(503)
    expect(res.body).toEqual({ error: 'no_key', message: expect.any(String) })
  })

  it('rejects other methods and bad bodies before touching the AI', async () => {
    const getRes = fakeRes()
    await handler(req({ method: 'GET', body: undefined }), getRes)
    expect(getRes.statusCode).toBe(405)

    const emptyRes = fakeRes()
    await handler(req({ body: { text: '' } }), emptyRes)
    expect(emptyRes.statusCode).toBe(400)
  })

  it('works without a forwarded-for header or socket', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const res = fakeRes()
    await handler(req({ headers: {}, socket: undefined }), res)
    expect(res.statusCode).toBe(503)
  })
})
