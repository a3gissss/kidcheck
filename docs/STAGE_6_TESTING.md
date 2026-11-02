# Stage 6: Testing and Debugging

Goal: prove the main journeys work end to end, find and fix bugs, and check accessibility, links, phone layout and security before deploying.

## Test suite: 165 tests, 7 files

| File | Kind | Tests | Covers |
|---|---|---|---|
| `src/lib/rules.test.js` | Unit | 56 | Every WHO rule, every age and day boundary, unknown answers |
| `server/extract.test.js` | Unit | 46 | AI schema, cleaning AI output, API errors, rate limit, eval labels |
| `src/test/journeys.test.jsx` | **UI journeys (new)** | 20 | The whole app in a simulated browser; only the network is faked |
| `src/lib/fields.test.js` | Unit | 17 | Validation, follow-ups, warnings |
| `src/lib/storage.test.js` | Unit | 14 | Saving, damaged data, blocked storage |
| `src/lib/extractClient.test.js` | Unit | 6 | Browser-side AI errors |
| `src/lib/privacy.test.js` | Unit | 6 | Phone number check |

The journey tests click through the real pages the way a CHW would:

- **Journey 1:** refer urgently. The alert names the sign, the referral note prints, and the case is saved.
- **Journey 2:** diarrhoea, treat at home with ORS and zinc.
- **Journey 3:** AI offline. Fallback notice, manual checklist, the rules still decide.
- **AI fill:** AI badges appear and disappear when the CHW edits; the source is recorded.
- **Phone numbers:** a description with one is never sent.
- **Landing page:** starting with AI and manually, with the description carried over.
- **Validation and follow-ups:** age required, follow-up questions appear and clear.
- **Needs more answers:** editing completes the same case.
- **Case log:** filters, and Delete all (cancel and confirm).
- **Not found pages,** and the disclaimer on every page.

New test tools (pinned, dev only): `@testing-library/react` 16.3.3, `@testing-library/user-event` 14.6.8, `@testing-library/jest-dom` 7.0.1, `jsdom` 30.1.3, `axe-core` 4.14.0.

## Bugs found and fixed

| # | Bug | How it was found | Fix |
|---|---|---|---|
| 1 | Typing an age erased the MUAC answer. Typing "24" passes through 2, which briefly hides MUAC (under 6 months), and hiding cleared the answer. The case then came back "Needs more answers". | Journey tests | Hidden answers are kept while editing and cleared only on save. 2 regression tests. |
| 2 | A request over 10 KB to `/api/extract` crashed the local dev server | Hostile request check | Answers 413, catches every error, reads the IP before the body |
| 3 | "(chart p. N)" citations failed contrast on the red and amber result panels | axe scan | slate-500 → slate-600 |
| 4 | The disclaimer bar sat outside any page landmark, so screen readers navigating by region skipped it | axe scan | Now `<aside aria-label="Disclaimer">`; the storage banner too |

## Checks

| Check | Result |
|---|---|
| axe (WCAG 2.1 A/AA + best practice), real browser, 12 states: landing, describe, checklist (empty, error, warning), urgent alert, refer, treat, needs more answers, AI fallback, case log, 404 | 0 violations after fixes 3 and 4 |
| Keyboard only: Enter opens the checklist, Tab and arrow keys answer, focus ring visible | Pass |
| Console during all journeys | Only the expected 503 from `/api/extract` when no key is set |
| Phone width (375px), every page | No sideways scroll (Stages 2 to 5 and the landing page) |
| External links | WHO page, chart booklet PDF, AI Studio and X all 200. `github.com/Aegis-31` was 404 (wrong username); now `github.com/a3gissss`, 200. |
| Secrets in project files, `VITE_` variables, key or server code in the browser bundle | None |
| `.env` and `.env.local` git-ignored | Yes |
| `npm audit` (all packages) | 0 vulnerabilities |
| API: wrong method, bad JSON, wrong types, 1,100 characters, 50 KB | 405 / 400 / 400 / 400 / 413, server stays up |
| API from another website (preflight request) | No `Access-Control-Allow-Origin` header, so browsers block it |

## Not tested yet

- **Real Gemini:** no key on this machine. Run `npm run eval` after adding `.env.local`.
- **Printing on paper:** the referral note's content is tested, but the printed page has not been checked. Try Ctrl+P on a referral case.
- **The deployed Vercel function:** Stage 7. Add security headers (`vercel.json`) there.
- **Real phones:** the narrow layout has been checked in the browser at phone size, not on a physical device.

## Run

```powershell
npm test          # all 165
npx vitest run src/test   # just the 20 journey tests
```
