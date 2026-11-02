// Browser side of the AI step. Sends only the description text to our own
// /api/extract endpoint; the Gemini key never reaches the browser.

const TIMEOUT_MS = 20_000

const MESSAGES = {
  no_key: 'The AI service is not set up.',
  quota: 'The free AI quota is used up for now.',
  rate_limited: 'Too many AI requests. Wait a minute.',
  ai_failed: 'The AI service did not answer correctly.',
}

export async function requestExtraction(text, fetchImpl = fetch) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetchImpl('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    })
    const data = await res.json().catch(() => null)
    if (res.ok && data?.fields) return { ok: true, fields: data.fields, filled: data.filled ?? [], model: data.model }
    return { ok: false, message: MESSAGES[data?.error] ?? data?.message ?? `The AI service failed (error ${res.status}).` }
  } catch (err) {
    return {
      ok: false,
      message: err?.name === 'AbortError' ? 'The AI service took too long to answer.' : 'Could not reach the AI service. Check the internet connection.',
    }
  } finally {
    clearTimeout(timer)
  }
}
