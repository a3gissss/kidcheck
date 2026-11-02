// Measures how well the AI extractor fills the checklist on 20 synthetic,
// hand-labelled descriptions. Run with: npm run eval  (needs GEMINI_API_KEY in .env.local)
// Writes eval/RESULTS.md. Uses about 20 requests of the free quota.

import { readFileSync, writeFileSync } from 'node:fs'
import { extractFields, DEFAULT_MODEL } from '../server/extract.js'
import { ALL_FIELDS, emptyFields } from '../src/lib/fields.js'

const DANGER_KEYS = ['convulsions', 'unableToDrink', 'vomitsEverything', 'chestIndrawing', 'unusuallySleepy', 'swellingBothFeet', 'muacColour', 'bloodInStool']
const DELAY_MS = 5000 // stay under free-tier requests per minute

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('GEMINI_API_KEY is missing. Put it in .env.local and run: npm run eval')
  process.exit(1)
}
const model = process.env.GEMINI_MODEL || DEFAULT_MODEL
const cases = JSON.parse(readFileSync(new URL('./cases.json', import.meta.url), 'utf8'))

let correct = 0
let total = 0
let statedCorrect = 0
let statedTotal = 0
let invented = 0
const missedDanger = []
const rows = []

for (const [i, c] of cases.entries()) {
  if (i > 0) await new Promise((r) => setTimeout(r, DELAY_MS))
  const expected = { ...emptyFields(), ...c.expected }
  let got
  try {
    got = (await extractFields(c.text, { apiKey, model })).fields
  } catch (err) {
    console.error(`case ${c.id}: request failed (${err?.status ?? ''} ${err?.message})`)
    rows.push(`| ${c.id} | request failed | |`)
    continue
  }
  const wrong = []
  for (const { key } of ALL_FIELDS) {
    total++
    const ok = got[key] === expected[key]
    if (ok) correct++
    else wrong.push(`${key}: expected ${JSON.stringify(expected[key])}, got ${JSON.stringify(got[key])}`)
    if (expected[key] !== null) {
      statedTotal++
      if (ok) statedCorrect++
    } else if (got[key] !== null) {
      invented++
    }
    // The dangerous error: a danger sign the text states, missed or flipped.
    if (DANGER_KEYS.includes(key) && expected[key] !== null && expected[key] !== false && !ok) {
      missedDanger.push(`case ${c.id}: ${key}`)
    }
  }
  console.log(`case ${c.id}: ${wrong.length === 0 ? 'all fields correct' : wrong.join('; ')}`)
  rows.push(`| ${c.id} | ${wrong.length === 0 ? 'all correct' : wrong.length + ' wrong'} | ${wrong.join('<br>')} |`)
}

const pct = (a, b) => (b === 0 ? 'n/a' : `${((100 * a) / b).toFixed(1)}%`)
const report = `# Extraction evaluation

Model: \`${model}\` · Run: ${new Date().toISOString().slice(0, 10)} · ${cases.length} synthetic cases · ${ALL_FIELDS.length} fields each

| Measure | Result |
|---|---|
| All fields correct (including correctly left as "not asked") | ${pct(correct, total)} (${correct}/${total}) |
| Stated facts extracted correctly | ${pct(statedCorrect, statedTotal)} (${statedCorrect}/${statedTotal}) |
| Fields filled that the text did not state | ${invented} |
| Danger signs stated in the text but missed or wrong | ${missedDanger.length}${missedDanger.length ? ` (${missedDanger.join(', ')})` : ''} |

Synthetic text only, labelled by the developer. This says nothing about real-world accuracy.
Every AI answer is shown to the CHW to check before the rules run.

| Case | Result | Differences |
|---|---|---|
${rows.join('\n')}
`
writeFileSync(new URL('./RESULTS.md', import.meta.url), report)
console.log(`\nStated facts: ${pct(statedCorrect, statedTotal)} · invented: ${invented} · missed danger signs: ${missedDanger.length}`)
console.log('Report written to eval/RESULTS.md')
