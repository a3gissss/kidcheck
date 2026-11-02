// Vercel serverless function: POST /api/extract { text } -> checklist fields.
// The Gemini key stays here on the server (GEMINI_API_KEY env var).

import { handleExtractRequest } from '../server/extract.js'

export default async function handler(req, res) {
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket?.remoteAddress
  const { status, body } = await handleExtractRequest({ method: req.method, body: req.body, ip, env: process.env })
  res.status(status).json(body)
}
