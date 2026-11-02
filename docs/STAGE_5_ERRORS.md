# Stage 5: Data Handling, Validation and Errors

Goal: no input, stored data or failure can leave the CHW with a blank screen, a silent loss of work, or a misleading result.

## What was checked and fixed

| # | Problem found | Fix |
|---|---|---|
| 1 | One damaged saved case (old version, hand-edited, half-written) crashed the case log | `storage.js` checks every stored case: drops non-cases, repairs fields with the same checker used for AI output, and treats a damaged result as "Not classified" |
| 2 | Any crash showed a blank page (seen in Stage 2) | `ErrorBoundary.jsx`: "Something went wrong" with Reload and Go home. It clears when you go to another page. |
| 3 | Blocked storage (private mode) was only noticed on save | Red banner on every page: "Cases cannot be saved" |
| 4 | Delete and Delete all could fail silently | Errors are shown on the page |
| 5 | Closing or reloading the tab mid-case lost the answers silently | The browser asks before leaving |
| 6 | A phone number in the description would be sent to Google | AI is blocked until it is removed. Filling the checklist by hand still works, because that text never leaves the device. |
| 7 | Unlikely numbers were accepted silently | Amber warnings (not errors): breath count under 15 or over 100; illness longer than the child's age |
| 8 | Editing a deleted case quietly became a new case | Notice: "The case you tried to edit no longer exists" |
| 9 | The case log went stale when another tab changed cases | Listens for storage changes |
| 10 | A result from older rules looked current | Note when a case was classified with a different rules version |
| 11 | A damaged date showed as 1970 | "Date unknown" |

Already handled in earlier stages: required age, number ranges, hidden follow-ups cleared, unanswered danger signs never treated as "No", AI failures falling back to the manual checklist, server input checks.

## Files

| File | Change |
|---|---|
| `src/lib/storage.js` | Checks and repairs stored data; `storageAvailable()` |
| `src/lib/fields.js` | `sanitizeFields()` (now shared with the server) and `fieldWarnings()` |
| `src/lib/privacy.js` | Phone number check |
| `src/lib/dates.js` | Safe date display |
| `src/components/ErrorBoundary.jsx` | Crash screen |
| `src/components/Layout.jsx` | Crash screen around every page; storage banner |
| `src/components/CaseField.jsx` | Amber warnings |
| `src/pages/NewCase.jsx` | Leave warning, phone check, missing-case notice, warnings |
| `src/pages/CaseLog.jsx`, `CaseResult.jsx` | Delete errors, other-tab updates, rules-version note, safe dates |
| `server/extract.js` | Uses the shared `sanitizeFields()` |
| `src/lib/storage.test.js`, `privacy.test.js`, `fields.test.js` | New tests |

## Checklist

| Check | Expected |
|---|---|
| `npm test` | `145 passed` |
| F12 → Console: `localStorage.setItem('kidcheck.cases.v1', '{oops')`, then reload `/cases` | "No cases yet", no crash |
| Description with `0803 123 4567`, then "Fill checklist with AI" | Red "looks like a phone number"; nothing sent |
| Cough Yes, breaths 8 | Amber "unusual breath count"; can still save |
| Age 3, fever 200 days | Amber "longer than the child has been alive" |
| Start a case, then close the tab | Browser asks "Leave site?" |
| Private window in a browser that blocks storage | Red banner on every page |
| Phone width | No sideways scroll |
