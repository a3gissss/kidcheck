# Stage 2: User Interface and Navigation

Goal: the full case flow works end to end with the CHW filling the checklist by hand. No medical decision yet (Stage 3) and no AI yet (Stage 4).

## The flow

1. **New case, step 1** (`/new`): the CHW describes the child in plain words, or loads a synthetic demo case. The text is optional.
2. **New case, step 2**: a checklist of every field. Each question is Yes / No / Not asked. Follow-up questions (days, breath count, blood in stool, malaria test) only appear when the symptom is Yes.
3. **Save**: the case is stored in the browser and the app opens its page.
4. **Case page** (`/cases/:id`): every answer, what was not asked, the original description, and a "Not classified" badge until Stage 3.
5. **Case log** (`/cases`): every saved case, filter by outcome, delete all.

## Files

| File | What it does |
|---|---|
| `src/lib/fields.js` | **The field list.** Every question, its type and its follow-up rule. Validation, "not asked yet" list, age-range note. Stage 3 rules and the Stage 4 AI prompt use these same keys. |
| `src/lib/fields.test.js` | 14 tests for validation, follow-ups and age range |
| `src/lib/storage.js` | Save, load and delete cases in localStorage |
| `src/lib/outcomes.js` | The four outcome labels and badge colours |
| `src/lib/samples.js` | Three synthetic demo descriptions |
| `src/components/CaseField.jsx` | One question: number box or Yes / No / Not asked buttons |
| `src/pages/NewCase.jsx` | Steps 1 and 2 |
| `src/pages/CaseResult.jsx` | One case's page |
| `src/pages/CaseLog.jsx` | The case list |
| `src/App.jsx` | Adds the `/cases/:id` route |
| `src/components/Layout.jsx` | Scrolls to the top when the page changes |

## Changes to the field list from the plan

- Added `sex` (optional), which the privacy section already promised.
- Added `malariaTest` (positive / negative / not done), needed by the fever rule.
- `null` always means "not asked". It is never treated as "No".

## Run

```powershell
npm run dev
npm test
```

## Checklist

| Check | Expected |
|---|---|
| `npm test` | `15 passed` |
| `/new`, click a demo case | Text box fills |
| Continue, then Save with no age | Red "Age is required", cursor jumps to age |
| Cough: Yes | Days and breath count questions appear |
| Cough: No | They disappear and their values are cleared |
| Age 1 or 60 | Amber note: KidCheck covers 2 to 59 months |
| Save a valid case | Opens `/cases/KC-...`, badge "Not classified" |
| Case log | Case listed, filter counts correct |
| Refresh the page | Case still there |
| `/cases/nope` | "Case not found" |
| Delete case / Delete all | Asks first, then removes |
| Phone width | No sideways scroll |
