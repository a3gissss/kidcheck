# KidCheck: Project Plan

As of Oct 28, 2026. Live version: https://claude.ai/artifact/YWYFkcFy7aSDzndVBfd7Ha

## Overview

**KidCheck** helps community health workers spot danger signs in sick children aged 2 months to 5 years and decide: refer now, treat, or advise at home.

**Tagline:** Plain words in, WHO-backed decisions out.

**Problem.** In rural Nigeria the first person to see a sick child is often a CHW with weeks of training and a paper chart. Danger signs get missed and children reach a clinic too late. Paper charts are slow under pressure and leave no record.

**Solution.** The CHW describes the child in plain language. AI converts it into structured fields the CHW reviews. A rule engine based on the WHO/UNICEF iCCM protocol classifies the case and shows which sign triggered it. Urgent cases get a full-screen alert and a printable referral note.

**Target audience**
- Primary: community health workers and volunteers in low-resource settings
- Secondary: nursing and public health students practising assessments
- Demo audience: hackathon judges, using synthetic cases

**Key design rule:** AI never makes the medical decision. Every classification comes from fixed, testable rules.

## Features and user journeys

| Feature | Status | What it does |
|---|---|---|
| Landing page | MVP | Problem, how it works, safety disclaimer |
| Free-text case intake | MVP | AI extracts age, symptoms, durations, danger signs |
| Review and edit form | MVP | CHW confirms or corrects fields before any decision |
| Rule-based classification | MVP | Refer urgently / Treat / Home care, with triggering sign shown |
| Missing-info prompts | MVP | Asks about danger signs not yet mentioned |
| Referral note | MVP | Printable summary for the clinic |
| Case log | MVP | Past cases in the browser, filter by outcome |
| Manual mode fallback | MVP | Full checklist when AI is unavailable |
| Synthetic demo cases | MVP | One-click samples, labelled synthetic |
| Hausa input and output | Future | Translation and Hausa interface |
| Voice input | Future | Speech-to-text |
| Offline mode (PWA) | Future | Rules work with no internet |
| Supervisor dashboard | Future | Case counts by area |

**Journey 1: urgent case (main demo)**
1. CHW types: "Boy, 18 months, coughing 3 days, breathing fast, vomits everything."
2. AI extracts fields; CHW confirms.
3. App asks for breath count and chest indrawing.
4. Result: **Refer urgently** (vomits everything is a danger sign).
5. CHW prints the referral note; case saved to the log.

**Journey 2: home care.** Diarrhoea 2 days, no blood, drinking normally. Result: treat at home with ORS and zinc advice, plus when to return.

**Journey 3: AI offline.** API fails or quota hit. App shows a notice and switches to the manual checklist. Classification still works.

## Architecture

```
Browser (React + Vite)
  Case intake (free text) ──text──▶ Vercel function (holds key) ──▶ Gemini API
                                                                        │
  Manual checklist ──▶ Review and edit fields ◀──────fields─────────────┘
  (if AI fails)              │ confirmed
                             ▼
                    Rule engine (WHO iCCM)
                             │ decision
                             ▼
  Case log (on device) ◀── Result and referral note
```

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast setup, matches existing React skills |
| Styling | Tailwind CSS | Responsive layouts quickly |
| Routing | React Router | Landing, New Case, Result, Case Log |
| AI | Gemini API via `@google/genai` | Free tier, structured JSON output |
| Backend | Vercel function `api/extract.js` | Hides the key, no server to run |
| Storage | localStorage | No database; data stays on device |
| Testing | Vitest | Built for Vite; unit tests for every rule |
| Hosting | Vercel (free) | Deploy from GitHub, env vars built in |

## AI component and rule engine

**1. AI extractor (Gemini, free tier)**
- Model: `gemini-3.5-flash-lite` (chosen Nov 2, 2026: stable and free tier). Override with `GEMINI_MODEL`.
- Input: the CHW's free text.
- Output: JSON in a fixed schema (structured output mode). Fields include `ageMonths`, `cough`, `coughDays`, `diarrhoea`, `diarrhoeaDays`, `bloodInStool`, `fever`, `feverDays`, `convulsions`, `unableToDrink`, `vomitsEverything`, `unusuallySleepy`, `chestIndrawing`, `breathsPerMinute`, `muacColour`, `swellingBothFeet`.
- Prompt rule: fill a field only if the text states it, otherwise `null`. `null` fields become follow-up questions.

**2. Rule engine (plain JavaScript)**
- **Refer urgently:** any danger sign: convulsions, unable to drink, vomits everything, unusually sleepy, chest indrawing, red MUAC, swelling of both feet, cough or diarrhoea 14+ days, fever 7+ days, blood in stool.
- **Treat at home and advise:** sick, no danger sign (fast breathing, diarrhoea under 14 days, fever with positive malaria test).
- **Advise and monitor:** no illness signs.
- Fast breathing: 50+ breaths/min at 2 to 11 months, 40+ at 12 to 59 months.
- Every rule will be checked against the WHO chart booklet in Stage 3 and cite its page.

**3. Fallback.** Missing key, quota hit or network failure shows "AI unavailable, using manual checklist". Rules unaffected. The UI never shows AI output the API did not return.

**4. Evaluation**
- Rule engine: Vitest unit tests, one per rule and per age boundary (11 vs 12 months).
- Extractor: 20 synthetic descriptions with hand-labelled fields; report field-level accuracy in README.
- Real use would need clinician validation. Out of scope.

## Data, privacy and safety

- Rules from the public WHO guideline; all demo and evaluation cases synthetic.
- No names or identifiers. Auto case IDs, age and sex only.
- Case log in localStorage; only intake text goes to Gemini.
- Notice telling users not to type names (free-tier Gemini inputs may be used by Google).
- Key in a Vercel env var; `.env.example` committed, `.env.local` ignored.
- Server function validates input length and rate-limits per IP.
- Persistent banner: "Educational prototype. Not a medical device. Not clinically validated."
- Unknown danger sign = "ask before deciding", never "no".
- Urgent result: full-screen red alert, "Go to the nearest health facility now."
- No claims of clinical accuracy or approval anywhere.

## Limitations and future work

**Limitations**
- iCCM subset only: cough/fast breathing, diarrhoea, fever, malnutrition signs, ages 2 to 59 months. No newborns.
- Rules are a simplified encoding, not reviewed by a clinician.
- App cannot measure breaths or MUAC.
- Gemini needs internet; free quotas can change.
- Extraction accuracy measured on synthetic text only.
- No treatment doses shown ("treat per your iCCM training").

**Future:** Hausa, voice input, offline PWA, clinician review, supervisor dashboard, Nigeria-specific iCCM adaptations.

## Build schedule

| Stage | Dates |
|---|---|
| 1. Setup | Oct 28 to 29 |
| 2. UI and navigation | Oct 30 to Nov 2 |
| 3. Rule engine + tests | Nov 2 to 5 |
| 4. AI integration | Nov 5 to 7 |
| 5. Validation and errors | Nov 8 to 9 |
| 6. Testing and debugging | Nov 9 to 10 |
| 7. Deploy to Vercel | Nov 11 |
| 8. GitHub repo + README | Nov 11 to 12 |
| Video, PDFs, final checks | Nov 12 to 14 |
| **Submission** | **Nov 15** |

If a stage slips, cut from the future list, never from testing or deliverables.
