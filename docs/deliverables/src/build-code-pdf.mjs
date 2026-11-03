// Builds docs/deliverables/src/code.html, the source for the code PDF.
// Reads the real source files at build time, so the PDF always matches the repo.
// Usage: node docs/deliverables/src/build-code-pdf.mjs <path-to-highlight.js-package> [toc-pages.json]
// Run once, find each section's page in the printed PDF, then run again with
// those pages to put page numbers in the contents.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'

const hljs = createRequire(import.meta.url)(process.argv[2])
const tocPages = process.argv[3] ? JSON.parse(readFileSync(process.argv[3], 'utf8')) : {}
const root = new URL('../../../', import.meta.url)
const read = (p) => readFileSync(new URL(p, root), 'utf8').replace(/\r\n/g, '\n')
const commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim()
const lines = (p) => read(p).trimEnd().split('\n').length

const SECTIONS = [
  {
    id: 'rules',
    title: 'The rule engine',
    intro:
      'The medical decision. Plain JavaScript with no AI and no network. Each danger sign is a small test that returns true, false or null (not asked yet), so an unchecked sign can never be read as "No". Every rule carries the page of the WHO/UNICEF chart booklet it comes from, and the result is plain data so it can be saved with the case.',
    files: ['src/lib/rules.js'],
  },
  {
    id: 'fields',
    title: 'The checklist definition',
    intro:
      'One list of every question: its type, allowed values and when it is shown. The form, the validation, the rule engine and the AI schema are all built from this file, so they cannot drift apart. sanitizeFields() is the single gate that every answer passes through, whether it came from the AI or from storage.',
    files: ['src/lib/fields.js', 'src/lib/outcomes.js'],
  },
  {
    id: 'ai',
    title: 'AI integration',
    intro:
      'Gemini is called only from the server, so the key never reaches the browser. The prompt tells the model to fill a field only when the note states it, and to ignore instructions written inside the note. The JSON schema is generated from the checklist, and the model\'s answer is cleaned again on the server. The Vercel function is a thin wrapper; the browser client adds a timeout and plain-English errors that trigger the manual fallback.',
    files: ['server/extract.js', 'api/extract.js', 'src/lib/extractClient.js', 'src/lib/privacy.js'],
  },
  {
    id: 'ui',
    title: 'The case flow (React)',
    intro:
      'NewCase.jsx is the two-step form: describe, then check every field. It runs the AI or the manual path, marks AI answers until the CHW changes them, and keeps hidden answers in memory until save (a bug found by the journey tests). CaseResult.jsx shows the result with its reasons, the full-screen urgent alert and the print-only referral note. storage.js repairs damaged saved data so pages never crash on it.',
    files: ['src/App.jsx', 'src/pages/NewCase.jsx', 'src/pages/CaseResult.jsx', 'src/lib/storage.js'],
  },
  {
    id: 'tests',
    title: 'Tests',
    intro:
      'rules.test.js checks every danger sign, every age and day boundary (for example 11 vs 12 months for fast breathing) and the demo journeys from the project plan. journeys.test.jsx renders the whole app in a simulated browser and clicks through it as a CHW would, with only the network faked. extract.test.js uses a fake Gemini client to test the schema, output cleaning, error handling and rate limit without a key.',
    files: ['src/lib/rules.test.js', 'src/test/journeys.test.jsx', 'server/extract.test.js'],
  },
  {
    id: 'config',
    title: 'Deployment configuration',
    intro:
      'vercel.json sends every page address to the app and sets the security headers (a Content Security Policy that allows only the site\'s own files, no framing). vite.config.js serves the same /api/extract code locally and gives the local preview the same headers, so the production build can be tested before deploying.',
    files: ['vercel.json', 'vite.config.js'],
  },
]

function codeBlock(path) {
  const lang = path.endsWith('.json') ? 'json' : 'javascript'
  const html = hljs.highlight(read(path).trimEnd(), { language: lang }).value
  return `<div class="file"><div class="file-head"><span>${path}</span><span>${lines(path)} lines</span></div><pre><code class="hljs">${html}</code></pre></div>`
}

const toc = [
  ['overview', '1. Architecture overview'],
  ['structure', '2. Folder structure'],
  ['decisions', '3. Key implementation decisions'],
  ...SECTIONS.map((s, i) => [s.id, `${i + 4}. ${s.title}`]),
  ['more', `${SECTIONS.length + 4}. Where to find the rest`],
]

const body = `
<section class="cover">
  <div class="disclaimer">Educational prototype. Not a medical device. Not clinically validated. All demo cases are synthetic.</div>
  <div class="cover-main">
    <div class="mark"><svg viewBox="0 0 32 32" width="44" height="44"><path d="M9 16.5l4.5 4.5L23 11" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <h1>KidCheck</h1>
    <p class="tagline">Plain words in, WHO-backed decisions out.</p>
    <p class="subtitle">Source code and implementation</p>
    <table class="meta">
      <tr><td>Repository</td><td>https://github.com/a3gissss/kidcheck</td></tr>
      <tr><td>Live demo</td><td>https://kidcheck-three.vercel.app</td></tr>
      <tr><td>Version</td><td>1.0.0 · commit ${commit} · branch main</td></tr>
      <tr><td>Author</td><td>Abdulhafeez Ibrahim · DSH Hacks V2 (AI x Healthcare)</td></tr>
      <tr><td>Licence</td><td>MIT</td></tr>
    </table>
  </div>
  <nav class="toc">
    <h2>Contents</h2>
    <ol>${toc.map(([id, t]) => `<li><a href="#${id}"><span>${t}</span><span class="pg">${tocPages[id] ?? ''}</span></a></li>`).join('')}</ol>
  </nav>
</section>

<section id="overview" class="page">
  <h2>1. Architecture overview</h2>
  <p>KidCheck helps community health workers (CHWs) check every danger sign in a sick child aged 2 months to 5 years and decide: refer urgently, treat at home, or no illness sign found. The design keeps AI away from the decision: the AI only turns language into checklist answers, the CHW confirms every answer, and fixed rules from the WHO/UNICEF chart booklet decide.</p>
  <div class="arch">
    <div class="box">CHW describes the child<br><small>plain words, no names</small></div>
    <div class="arrow">→</div>
    <div class="box server">/api/extract<br><small>Vercel function: input checks, rate limit, JSON schema, cleaning</small></div>
    <div class="arrow">⇄</div>
    <div class="box ai">Gemini<br><small>gemini-3.5-flash-lite</small></div>
  </div>
  <div class="arch">
    <div class="box">Checklist<br><small>CHW confirms or corrects every answer; AI answers are marked</small></div>
    <div class="arrow">→</div>
    <div class="box rules">Rule engine<br><small>src/lib/rules.js, WHO iCCM, cites chart pages</small></div>
    <div class="arrow">→</div>
    <div class="box">Result, alert, referral note<br><small>saved to the case log in the browser</small></div>
  </div>
  <p class="note">If the AI is unavailable (no key, quota, network, timeout), the CHW fills the same checklist by hand and the rules work the same.</p>
  <table class="plain">
    <tr><th>Layer</th><th>Technology</th></tr>
    <tr><td>Frontend</td><td>React 19, Vite, Tailwind CSS v4, React Router</td></tr>
    <tr><td>AI</td><td>Google Gemini API via @google/genai 2.29.1 (structured JSON output)</td></tr>
    <tr><td>Backend</td><td>One Vercel serverless function (api/extract.js) that holds the key</td></tr>
    <tr><td>Storage</td><td>localStorage: cases never leave the device</td></tr>
    <tr><td>Tests</td><td>Vitest, Testing Library, jsdom, axe-core: 168 tests</td></tr>
    <tr><td>Hosting</td><td>Vercel, deployed on every push to main</td></tr>
  </table>
</section>

<section id="structure" class="page-flow">
  <h2>2. Folder structure</h2>
  <pre class="tree">kidcheck/
├── api/extract.js            Vercel serverless function: POST /api/extract
├── server/
│   ├── extract.js            Prompt, JSON schema, Gemini call, cleaning, rate limit
│   ├── extract.test.js       AI tests with a fake Gemini client
│   └── vercel-handler.test.js
├── src/
│   ├── App.jsx               Routes
│   ├── main.jsx              Entry point
│   ├── index.css             Tailwind import, focus and selection colours
│   ├── components/           Layout, CaseField, ErrorBoundary
│   ├── pages/                Landing, NewCase, CaseResult, CaseLog, NotFound
│   ├── lib/                  rules, fields, outcomes, storage, privacy, extractClient (+ tests)
│   └── test/                 Full-journey UI tests and helpers
├── eval/                     20 synthetic cases, eval script, RESULTS.md
├── docs/                     Plan, stage guides, test report, screenshots, deliverables
├── PRODUCT.md / DESIGN.md    Product brief and design system
├── vercel.json               Rewrites and security headers
└── vite.config.js            Build, local API, preview headers, test setup</pre>
</section>

<section id="decisions" class="page-flow">
  <h2>3. Key implementation decisions</h2>
  <ol class="decisions">
    <li><b>AI reads, rules decide.</b> The model can only fill checklist fields defined in fields.js. It never sees or sets the outcome, and every AI answer is marked until the CHW changes it.</li>
    <li><b>Unknown is never "No".</b> Each answer is true, false or null. A danger sign that is null blocks the decision (<i>Needs more answers</i>) unless another sign already requires referral.</li>
    <li><b>One source of truth.</b> The form, validation, rules, AI schema and output cleaning are all generated from the field list, so they cannot disagree.</li>
    <li><b>Never trust model output.</b> The server checks every value against the allowed types and ranges; anything else becomes "not asked". The prompt also tells the model to ignore instructions inside the note.</li>
    <li><b>The key stays on the server.</b> The browser calls /api/extract only. A missing key, quota error, timeout or network failure all lead to the same manual checklist.</li>
    <li><b>Privacy by default.</b> No names; descriptions containing a phone number are blocked before reaching the AI; cases are stored only in the browser.</li>
    <li><b>Cite the source.</b> Every rule and every action carries its chart booklet page, shown to the CHW next to the result.</li>
    <li><b>Test the decision exhaustively.</b> Every danger sign and every boundary (13 vs 14 days, 6 vs 7 days, 11 vs 12 months, 5 vs 6 months for MUAC) has a test, and the full journeys run in a simulated browser.</li>
  </ol>
</section>

${SECTIONS.map(
  (s, i) => `<section id="${s.id}" class="page">
  <h2>${i + 4}. ${s.title}</h2>
  <p class="intro">${s.intro}</p>
  ${s.files.map(codeBlock).join('\n')}
</section>`
).join('\n')}

<section id="more" class="page-flow">
  <h2>${SECTIONS.length + 4}. Where to find the rest</h2>
  <p>This document includes the files that carry the logic. Everything else is in the repository at <b>https://github.com/a3gissss/kidcheck</b> (commit ${commit}):</p>
  <table class="plain">
    <tr><th>File</th><th>What it is</th></tr>
    <tr><td>src/pages/Landing.jsx</td><td>Landing page with a working "Start a case" panel</td></tr>
    <tr><td>src/pages/CaseLog.jsx</td><td>Case list with filters and delete</td></tr>
    <tr><td>src/components/CaseField.jsx</td><td>One checklist question: number box or Yes / No / Not asked</td></tr>
    <tr><td>src/components/Layout.jsx, ErrorBoundary.jsx</td><td>Disclaimer bar, navigation, crash screen</td></tr>
    <tr><td>src/lib/*.test.js, server/vercel-handler.test.js</td><td>Field, storage, privacy, client and function tests</td></tr>
    <tr><td>eval/cases.json, eval/run.js, eval/RESULTS.md</td><td>AI evaluation: 20 labelled cases, script and results</td></tr>
    <tr><td>docs/</td><td>Project plan, stage guides 1 to 7, test report, demo script</td></tr>
  </table>
  <p>Run it: <code>npm install</code>, add <code>GEMINI_API_KEY</code> to <code>.env.local</code>, <code>npm run dev</code>. Tests: <code>npm test</code> (168).</p>
</section>`

const css = readFileSync(new URL('./code.css', import.meta.url), 'utf8')
writeFileSync(
  new URL('./code.html', import.meta.url),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>KidCheck: source code</title><style>${css}</style></head><body>${body}</body></html>`
)
console.log('wrote code.html at commit', commit)
