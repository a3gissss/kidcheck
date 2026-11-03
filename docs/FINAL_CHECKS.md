# Final Checks

Run on Nov 3, 2026, against commit `b72bbf3` and the live site https://kidcheck-three.vercel.app. The brief's section 9 is the checklist.

## The brief's final quality checks

| Check | Result |
|---|---|
| Test all major user journeys | **Pass.** 168 automated tests pass (three runs in a row). Live site with real Gemini: Journey 1 (AI fill → red alert "Vomits everything" → *Refer urgently*), Journey 2 (manual → *Treat at home and advise*), unchecked danger sign → *Needs more answers*, case log filters. |
| Main features actually work | **Pass.** AI extraction, manual fallback, rules, alert, referral note (print opens), edit, case log, landing panel. |
| Console errors and broken links | **Pass.** Live console empty. All 12 external links resolve (200). The only 404s are the deploy guide's placeholder `kidcheck-xxxx.vercel.app` and a scan artefact. All relative links in README and docs point to real files. |
| Mobile responsiveness | **Pass.** No sideways scroll at 375px on `/`, `/new` (both steps), `/cases`, a case page and the 404 page. |
| Exposed API keys and sensitive data | **Pass.** No key-like strings in any of the 8 commits; no `.env` file ever committed; the live JavaScript bundle has no key, key name, Gemini address or prompt; no personal emails or phone numbers in the repo. `npm audit`: 0 vulnerabilities. |
| GitHub repo matches the final build | **Pass.** The live site serves `index-DQGWqqWo.js` and `index-MyaRAunI.css`, the same content-hashed files a fresh `npm run build` of the repo produces. |
| Demo video represents the app accurately | **Script pass; video not recorded yet.** Every action in `docs/DEMO_SCRIPT.md` exists on the live site, and every claim (168 tests, 106/106 facts, 0 missed danger signs, the prompt fix) matches the README. |
| Project description is exactly one page | **Pass.** `KidCheck-Project-Description.pdf`: 1 page, A4, contains both links. |
| Code PDF contains the actual project code | **Pass.** `KidCheck-Source-Code.pdf`: 43 pages, stamped commit `b72bbf3`. All 1,749 non-blank lines of the 16 included files were matched against the repo. The contents page numbers were checked against the printed pages. |

## Found and fixed during this check

| Issue | Fix |
|---|---|
| One full-journey test timed out once at Vitest's 5 s default on a busy machine | Journey tests get a 20 s limit; 3 clean runs after |
| Unused helper in the PDF build script (lint warning) | Removed; lint clean |
| Code PDF showed the earlier commit | Rebuilt at `b72bbf3` |

## Deliverables

| Brief item | Where | Status |
|---|---|---|
| A. Working project | https://kidcheck-three.vercel.app | Done |
| B. GitHub repository | https://github.com/a3gissss/kidcheck: README with overview, problem, features, stack, setup, `.env.example`, architecture, screenshots, testing, limitations, MIT licence | Done (description and topics: your step) |
| C. Demo video | Script and shot plan: `docs/DEMO_SCRIPT.md` | **Recording: your step** |
| D. One-page description PDF | `docs/deliverables/KidCheck-Project-Description.pdf` | Done |
| E. Code PDF | `docs/deliverables/KidCheck-Source-Code.pdf` | Done |

## Before you submit

1. Record the demo video with `docs/DEMO_SCRIPT.md` (practice once first).
2. On GitHub, use the ⚙ next to **About** to add the description and topics.
3. Decide whether the "claude" contributor entry (from the `Co-Authored-By` lines) is fine for the submission.
4. Optional: print one referral note on paper; open the site on a real phone.

## Known limitations (also in the README)

- Rules are a simplified encoding of part of iCCM and have not been reviewed by a clinician.
- AI accuracy is measured on 20 synthetic cases, and the prompt was tuned on the same set.
- No HIV/TB questions and no babies under 2 months; a malaria area is assumed.
- The case log lives in one browser; the AI rate limit is best effort.
