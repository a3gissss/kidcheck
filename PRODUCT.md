# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** community health workers (CHWs) and volunteers in low-resource settings, starting in rural Nigeria. They have a few weeks of training and a paper chart, and they see sick children aged 2 months to 5 years first, often under pressure.
- **Secondary:** nursing and public health students practising assessments.
- **Evaluation audience:** DSH Hacks V2 judges (AI x Healthcare), who see the landing page first and use synthetic demo cases. The landing page speaks to judges first while staying a quick way in for a CHW.

## Product Purpose

KidCheck helps a CHW spot danger signs in a sick child and decide: refer urgently, treat at home and advise, or no illness sign found. Success means no danger sign is missed and urgent children reach a facility sooner.

## Positioning

AI handles only language: it turns the CHW's plain description into checklist answers. The CHW checks every answer. Fixed rules taken from the WHO/UNICEF chart booklet ("Caring for the sick child in the community", 2014) make the decision and show which sign triggered it, with the booklet page. Not a symptom-checker chatbot.

## Operating Context

- Used on a phone or laptop at the point of care, then at the facility (printed referral note).
- Works without AI: if Gemini is unavailable, the same checklist is filled by hand and the rules work the same.
- Case log stays only in the browser on that device.

## Capabilities and Constraints

- Covers age 2 to 59 months; cough/fast breathing, diarrhoea, fever (malaria area), malnutrition signs, and the general danger signs.
- Not covered: HIV/TB questions, young infants, "other problems". No treatment doses shown.
- Unanswered danger signs are never treated as "No".
- Educational prototype. Not a medical device. Not clinically validated. Never claim accuracy, approval or validation.
- Future, not built: Hausa, voice input, offline mode, supervisor dashboard.

## Brand Commitments

- Name: KidCheck. Tagline: "Plain words in, WHO-backed decisions out."
- Keep the existing teal and slate look. Voice: plain, calm, short sentences a CHW can read under pressure.
- The amber disclaimer bar stays on every page.

## Evidence on Hand

- Rule engine with 56 tests and booklet page citations (`src/lib/rules.js`).
- 20-case synthetic extraction test set (`eval/`); results not yet run.
- No real users, testimonials, statistics or partners. Do not invent any. The problem is described in words, without numbers.

## Product Principles

1. AI reads; rules decide; the CHW confirms.
2. Show why: every result names its sign and source page.
3. Unknown is never "No".
4. Honest about limits: prototype, synthetic data, no doses.
5. Works when the AI does not.

## Accessibility & Inclusion

Readable at phone width, high contrast, plain English for readers with limited formal training. Hausa is planned.
