import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves /api/extract during `npm run dev` and `npm run preview` with the same
// code Vercel runs, so you do not need the Vercel CLI locally. The key is read
// from .env.local here on the local server and never reaches the browser.
function localApi(env) {
  function middleware(loadModule) {
    return async (req, res) => {
      const send = (status, body) => {
        if (res.writableEnded) return
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(body))
      }
      // Read the address first: the socket is gone once a client disconnects.
      const ip = req.socket?.remoteAddress
      // Any error here must answer the request, never crash the local server.
      try {
        let raw = ''
        for await (const chunk of req) {
          raw += chunk
          if (raw.length > 10_000) {
            send(413, { error: 'too_large', message: 'Request too large.' })
            req.destroy()
            return
          }
        }
        let body = null
        try {
          body = JSON.parse(raw || 'null')
        } catch {
          body = null
        }
        const { handleExtractRequest } = await loadModule()
        const result = await handleExtractRequest({ method: req.method, body, ip, env })
        send(result.status, result.body)
      } catch (err) {
        console.error('local /api/extract failed:', err?.message)
        send(500, { error: 'server_error', message: 'Something went wrong on the server.' })
      }
    }
  }

  return {
    name: 'kidcheck-local-api',
    configureServer(server) {
      server.middlewares.use('/api/extract', middleware(() => server.ssrLoadModule('/server/extract.js')))
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/extract', middleware(() => import('./server/extract.js')))
    },
  }
}

// `npm run preview` sends the same security headers as vercel.json, so the
// production build can be checked locally before deploying.
const siteHeaders = Object.fromEntries(
  JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
    .headers.find((h) => h.source === '/(.*)')
    .headers.map(({ key, value }) => [key, value])
)

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), localApi(loadEnv(mode, process.cwd(), ''))],
  preview: { headers: siteHeaders },
  // UI tests opt into a browser-like DOM with a `@vitest-environment jsdom` comment.
  test: { environment: 'node', setupFiles: ['./src/test/setup.js'] },
}))
