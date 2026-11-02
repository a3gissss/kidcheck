# Idea Selection

Five AI x Healthcare ideas were compared on Oct 28, 2026. Idea 2 was approved.

Assumptions: 1 to 2 week build, solo, free-tier Gemini.

## The five ideas

1. **MedLabel**: photograph a drug pack; AI reads and explains the label in plain English/Hausa, checks interactions, shows how to verify NAFDAC numbers. Risk: AI inventing doses.
2. **CHW Triage (KidCheck)**: CHW describes a sick child; AI extracts structured fields; WHO iCCM rules classify the case and show which rule fired. **Chosen.**
3. **LabLens**: upload a lab report; fixed rules flag out-of-range values; AI explains in plain language and suggests doctor questions. Easy but common.
4. **CampusPulse**: anonymous student symptom check-ins; clustering flags outbreak spikes on a map. Demo relies entirely on fake data.
5. **MamaCheck**: weekly pregnancy check-ins; WHO danger-sign rules; antenatal reminders. High impact, narrower than Idea 2.

## Comparison (1 = weak, 5 = strong)

| Idea | Feasibility | Originality | Technical depth | Safety | Impact | Total |
|---|---|---|---|---|---|---|
| 1. MedLabel | 4 | 4 | 3 | 2 | 4 | 17 |
| **2. CHW Triage** | 4 | 4 | 4 | 5 | 5 | **22** |
| 3. LabLens | 5 | 2 | 3 | 4 | 3 | 17 |
| 4. CampusPulse | 3 | 4 | 4 | 4 | 3 | 18 |
| 5. MamaCheck | 4 | 3 | 3 | 4 | 5 | 19 |

## Why Idea 2

- **Safe by design:** AI handles language, a published WHO protocol decides, every output shows its rule.
- **AI is visible but contained:** messy text becomes fields live on screen; honest manual fallback.
- **Defensible scope:** the rule engine is plain JavaScript with real unit tests for the code PDF.

## Decisions

- Approved Oct 28, 2026.
- Deadline Nov 15, 2026. Solo.
- Hausa moved to after submission.
