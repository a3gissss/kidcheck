# KidCheck

**Plain words in, WHO-backed decisions out.**

KidCheck is a web app that helps community health workers (CHWs) spot danger signs in sick children aged 2 months to 5 years and decide: refer urgently, treat at home, or advise and monitor.

Built for **DSH Hacks V2** (AI x Healthcare). Submission deadline: **Nov 15, 2026**.

> **Educational prototype. Not a medical device. Not clinically validated.** All demo cases are synthetic.

## Status

| Stage | Status |
|---|---|
| 1. Project setup | Done |
| 2. UI and navigation | Done |
| 3. Rule engine + unit tests | Done |
| 4. Gemini extraction + fallback | Done (run `npm run eval` with your key) |
| 5. Validation and error states | Done |
| 6. Testing and debugging | Done |
| 7. Deploy to Vercel | Prepared and tested locally; your GitHub and Vercel steps remain |
| 8. GitHub repo polish | Not started |

## The problem

In rural Nigeria the first person to see a sick child is often a CHW with a few weeks of training and a paper chart. Danger signs like chest indrawing or inability to drink get missed, and children reach a clinic too late.

## How it works

1. The CHW describes the child in plain language.
2. **AI (Gemini)** turns that text into structured fields: age, symptoms, durations, danger signs.
3. The CHW reviews and corrects every field.
4. A **rule engine** based on the WHO/UNICEF iCCM guideline classifies the case and shows which sign triggered the decision.
5. Urgent cases get a full-screen alert and a printable referral note.

**AI never makes the medical decision.** It only reads language. If the AI is unavailable, the CHW fills a manual checklist and the rules still work.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| AI | Gemini API (`gemini-3.5-flash-lite`, free tier) via `@google/genai`, called from a Vercel serverless function |
| Storage | localStorage (case log stays on the device) |
| Tests | Vitest |
| Hosting | Vercel |

## Run locally (Windows PowerShell)

Requires Node.js 20+.

```powershell
cd kidcheck
npm install
Copy-Item .env.example .env.local   # then paste your Gemini key into .env.local
npm run dev                         # http://localhost:5173
```

Run tests in a second terminal:

```powershell
npm test
```

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `GEMINI_API_KEY` | `.env.local` locally, Vercel env vars in production | Get one free at https://aistudio.google.com/apikey. Never prefix with `VITE_`, or it gets bundled into the browser. |
| `GEMINI_MODEL` | Optional | Defaults to `gemini-3.5-flash-lite`. |

Without a key the app still works: the AI button shows "AI unavailable" and the CHW fills the checklist by hand.

## AI evaluation

`npm run eval` runs the extractor on 20 hand-labelled synthetic descriptions (`eval/cases.json`) and writes `eval/RESULTS.md`. It reports field accuracy, invented fields, and danger signs the AI missed. These are synthetic results only, not real-world accuracy.

`.env.local` is git-ignored. Only `.env.example` is committed.

## Folder structure

```
kidcheck/
├── api/                  # Vercel serverless function: /api/extract
├── docs/                 # Plan, ideas, stage guides, progress log
├── PRODUCT.md            # Product brief (users, purpose, limits) used for design work
├── DESIGN.md             # Design system: colour roles, type, components, known drift
├── eval/                 # AI extraction test set and script
├── server/               # Server-only code: Gemini prompt, schema, checks
├── public/               # Static files
├── src/
│   ├── components/       # Layout and reusable UI
│   ├── lib/              # Rule engine, storage, tests (no UI)
│   ├── pages/            # Landing, NewCase, CaseResult, CaseLog, NotFound
│   ├── App.jsx           # Routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Tailwind import
├── vercel.json           # Page routing and security headers for Vercel
├── .env.example
├── package.json
└── vite.config.js
```

## Docs

- [Project plan](docs/PROJECT_PLAN.md): scope, features, architecture, AI design, safety, schedule
- [Idea selection](docs/IDEA_SELECTION.md): the five ideas compared and why KidCheck won
- [Stage 1 setup guide](docs/STAGE_1_SETUP.md): step-by-step PowerShell setup and fixes
- [Stage 2 UI guide](docs/STAGE_2_UI.md): the case flow, files and test checklist
- [Stage 3 rules guide](docs/STAGE_3_RULES.md): every rule, its chart page, and the test checklist
- [Stage 4 AI guide](docs/STAGE_4_AI.md): Gemini extraction, fallback, evaluation
- [Stage 5 errors guide](docs/STAGE_5_ERRORS.md): validation, damaged data, crash screen, privacy check
- [Stage 6 testing report](docs/STAGE_6_TESTING.md): 165 tests, bugs fixed, accessibility and security checks
- [Stage 7 deploy guide](docs/STAGE_7_DEPLOY.md): GitHub, Vercel, environment variables, live checks
- [Getting API keys](docs/API_KEYS.md)
- [Progress log](docs/PROGRESS.md)
- [Hackathon brief](docs/HACKATHON_BRIEF.md): the original requirements

## Clinical source

WHO/UNICEF, [Caring for the sick child in the community](https://www.who.int/publications/i/item/9789241548045), and the [2014 CHW chart booklet](https://www.childhealthtaskforce.org/sites/default/files/2019-06/Caring%20for%20Sick%20Child%20in%20the%20Community%20CHW%20Chart%20Booklet%28WHO%2CUNICEF%2C2014%29.pdf) (adaptation for high HIV or TB settings). Each rule in `src/lib/rules.js` cites its booklet page.

**Not covered:** the booklet's HIV and TB questions, newborns and young infants under 2 months, and "other problems" the CHW cannot manage. KidCheck assumes a malaria area. Rules are a simplified encoding that no clinician has reviewed.

## Author

Abdulhafeez Ibrahim (Aegis) · [GitHub](https://github.com/a3gissss) · [X](https://x.com/a3gissss)
