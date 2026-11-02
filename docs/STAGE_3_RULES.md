# Stage 3: Rule Engine

Goal: every saved case gets a decision from fixed, tested rules taken from the WHO/UNICEF chart booklet, and the case page shows which sign triggered it.

## Source

WHO/UNICEF, *Caring for the sick child in the community*, CHW chart booklet, adaptation for high HIV or TB settings (July 2014). Every rule was checked against the booklet text on Nov 2, 2026. Page numbers are the booklet's printed pages.

## The rules (`src/lib/rules.js`)

The engine works in this order:

1. **No age** → *Needs more answers*.
2. **Age under 2 months or over 59 months** → *Outside age range*. The chart covers 2 months up to 5 years (p. 3).
3. **Any danger sign** → *Refer urgently* (p. 6), with every sign that fired:
   - cough for 14 days or more
   - diarrhoea for 14 days or more
   - blood in stool
   - fever for the last 7 days or more
   - convulsions
   - not able to drink or feed anything
   - vomits everything
   - chest indrawing
   - unusually sleepy or unconscious
   - red on the MUAC strap (**6 months and older only**)
   - swelling of both feet

   The page shows the pre-referral steps from p. 7, plus ORS for a child with diarrhoea who can drink (p. 10).
4. **A danger sign not asked yet** → *Needs more answers*. KidCheck never treats "not asked" as "No".
5. **Sick but no danger sign** → *Treat at home and advise* (p. 8–9):
   - Fast breathing (50+ breaths/min at 2–11 months, 40+ at 12–59 months): amoxicillin.
   - Cough under 14 days without fast breathing: home care advice. If no breath count was recorded, it asks for one.
   - Diarrhoea under 14 days with no blood: ORS and zinc.
   - Fever under 7 days: do a malaria rapid test, and give AL only if it is positive.
   - Yellow MUAC: counsel on feeding.

   It adds the home care advice from p. 9: fluids, when to return, bednet, follow-up in 3 days.
6. **None of the above** → *No illness sign found*. Advice: refer any other problem you cannot manage, and check vaccines (p. 12).

Doses are never shown. The app tells the CHW to use their chart booklet.

## Corrections to the plan found in the booklet

- MUAC is used only from 6 months (p. 5–6). The MUAC question is now hidden for younger children.
- A negative malaria test does not make the child well. The child still counts as "sick, no danger sign"; the test only decides whether to give AL (p. 9).
- Not included: the HIV and TB questions in this edition, and "other problems". These are listed in the README limitations.

## App changes

| File | Change |
|---|---|
| `src/lib/rules.js` | The rule engine. Returns plain data that is saved with the case. |
| `src/lib/rules.test.js` | 56 tests: each danger sign, every age and duration boundary, fast breathing at 11 vs 12 months, the malaria test, unknown answers and the demo journeys |
| `src/lib/sanity.test.js` | Deleted |
| `src/lib/outcomes.js` | Adds *Needs more answers* and *Outside age range* |
| `src/lib/fields.js` | MUAC question shown only from 6 months; short labels for the referral note |
| `src/pages/NewCase.jsx` | Classifies on save; edits an existing case |
| `src/pages/CaseResult.jsx` | Result panel with triggers and chart pages, full-screen red alert, printable referral note, "Edit answers" |
| `src/pages/CaseLog.jsx` | Filter buttons only for outcomes that have cases |
| `src/components/Layout.jsx` | Hides the nav and footer when printing |

## Checklist

| Check | Expected |
|---|---|
| `npm test` | `70 passed` |
| Journey 1: demo case "Fast breathing, vomiting", age 18, vomits everything Yes, others No | Full-screen red alert naming "Vomits everything", then *Refer urgently* |
| Refresh that page | The alert does not come back |
| Print referral note (Ctrl+P) | Only the note and the disclaimer print |
| Journey 2: age 24, diarrhoea Yes for 2 days, no blood, all else No | *Treat at home and advise*, ORS and zinc |
| Leave one danger sign as "Not asked" | *Needs more answers*, listing that sign |
| "Answer the missing questions" | Opens the checklist with the case's answers, saves to the same case ID |
| Age 4 months | No MUAC question |
| Age 1 or 60 | *Outside age range* |
| Phone width | No sideways scroll |
