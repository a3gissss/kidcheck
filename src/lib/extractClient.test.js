import { describe, it, expect } from 'vitest'
import { requestExtraction } from './extractClient.js'

function fakeFetch(status, body) {
  return async () => ({ ok: status >= 200 && status < 300, status, json: async () => body })
}

describe('requestExtraction', () => {
  it('returns fields on success', async () => {
    const res = await requestExtraction('text', fakeFetch(200, { fields: { ageMonths: 18 }, filled: ['ageMonths'], model: 'm' }))
    expect(res).toEqual({ ok: true, fields: { ageMonths: 18 }, filled: ['ageMonths'], model: 'm' })
  })

  it.each([
    [503, { error: 'no_key' }, 'not set up'],
    [429, { error: 'quota' }, 'quota'],
    [502, { error: 'ai_failed' }, 'did not answer'],
    [500, null, 'error 500'],
  ])('status %i gives a readable message', async (status, body, text) => {
    const res = await requestExtraction('text', fakeFetch(status, body))
    expect(res.ok).toBe(false)
    expect(res.message).toContain(text)
  })

  it('handles no network', async () => {
    const res = await requestExtraction('text', async () => {
      throw new TypeError('Failed to fetch')
    })
    expect(res).toEqual({ ok: false, message: expect.stringContaining('internet') })
  })
})
