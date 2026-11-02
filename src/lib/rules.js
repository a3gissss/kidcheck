// The KidCheck rule engine. Plain JavaScript, no AI.
// Source: WHO/UNICEF, "Caring for the sick child in the community", CHW chart
// booklet (adaptation for high HIV or TB settings, July 2014). Page numbers
// below are that booklet's printed pages. HIV and TB questions are not included.

export const RULES_VERSION = '2026-11-02'
export const RULES_SOURCE =
  'WHO/UNICEF, Caring for the sick child in the community: CHW chart booklet (2014)'

// Each danger sign test returns true (sign present), false (absent) or
// null (not asked yet). Unknown is never treated as absent.
function sign(value) {
  return value === null || value === undefined ? null : value === true
}

function lastsAtLeast(present, days, limit) {
  if (present === false) return false
  if (present === null || present === undefined || days === null || days === undefined) return null
  return days >= limit
}

export const DANGER_SIGNS = [
  { id: 'cough14', label: 'Cough for 14 days or more', page: 6, test: (f) => lastsAtLeast(f.cough, f.coughDays, 14) },
  { id: 'diarrhoea14', label: 'Diarrhoea for 14 days or more', page: 6, test: (f) => lastsAtLeast(f.diarrhoea, f.diarrhoeaDays, 14) },
  {
    id: 'bloodInStool',
    label: 'Blood in stool',
    page: 6,
    test: (f) => (f.diarrhoea === false ? false : f.diarrhoea === null ? null : sign(f.bloodInStool)),
  },
  { id: 'fever7', label: 'Fever for the last 7 days or more', page: 6, test: (f) => lastsAtLeast(f.fever, f.feverDays, 7) },
  { id: 'convulsions', label: 'Convulsions', page: 6, test: (f) => sign(f.convulsions) },
  { id: 'unableToDrink', label: 'Not able to drink or feed anything', page: 6, test: (f) => sign(f.unableToDrink) },
  { id: 'vomitsEverything', label: 'Vomits everything', page: 6, test: (f) => sign(f.vomitsEverything) },
  { id: 'chestIndrawing', label: 'Chest indrawing', page: 6, test: (f) => sign(f.chestIndrawing) },
  { id: 'unusuallySleepy', label: 'Unusually sleepy or unconscious', page: 6, test: (f) => sign(f.unusuallySleepy) },
  {
    id: 'muacRed',
    label: 'Red on MUAC strap (age 6 months and older)',
    page: 6,
    test: (f) => (f.ageMonths < 6 ? false : f.muacColour === null ? null : f.muacColour === 'red'),
  },
  { id: 'swellingBothFeet', label: 'Swelling of both feet', page: 6, test: (f) => sign(f.swellingBothFeet) },
]

export function fastBreathingLimit(ageMonths) {
  return ageMonths < 12 ? 50 : 40
}

const REFER_ACTIONS = [
  { text: 'Explain to the caregiver why the child needs to go to the health facility.', page: 7 },
  { text: 'Give the first dose of treatment shown on page 7 of your chart booklet.', page: 7 },
  { text: 'If the child can drink, advise to give fluids and continue feeding.', page: 7 },
  { text: 'Keep the child warm if the child is not hot with fever.', page: 7 },
  { text: 'Write a referral note (print it from this page).', page: 7 },
  { text: 'Arrange transport and help solve other difficulties in referral.', page: 7 },
]

const HOME_CARE_ACTIONS = [
  { text: 'Advise the caregiver to give more fluids and continue feeding.', page: 9 },
  {
    text: 'Go to the nearest health facility, or return immediately, if the child cannot drink or feed, becomes sicker, or has blood in stool.',
    page: 9,
  },
  { text: 'Advise the caregiver to use a bednet (ITN).', page: 9 },
  { text: 'Follow up the child in 3 days. If the child becomes sicker or does not improve, refer urgently.', page: 9 },
]

function sickButNoDangerSign(f) {
  const findings = []

  if (f.cough === true) {
    if (f.breathsPerMinute === null) {
      findings.push({ text: 'Cough for less than 14 days', action: 'Count breaths for 1 full minute to check for fast breathing.', page: 5 })
    } else if (f.breathsPerMinute >= fastBreathingLimit(f.ageMonths)) {
      findings.push({
        text: `Fast breathing: ${f.breathsPerMinute} breaths/min (fast is ${fastBreathingLimit(f.ageMonths)} or more at this age)`,
        action: 'Give oral antibiotic (amoxicillin). Dose from your chart booklet.',
        page: 9,
      })
    } else {
      findings.push({
        text: `Cough for less than 14 days, no fast breathing (${f.breathsPerMinute} breaths/min)`,
        action: 'Give home care advice.',
        page: 8,
      })
    }
  }

  if (f.diarrhoea === true) {
    findings.push({ text: 'Diarrhoea for less than 14 days, no blood in stool', action: 'Give ORS and zinc. Dose from your chart booklet.', page: 9 })
  }

  if (f.fever === true) {
    const action =
      f.malariaTest === 'positive'
        ? 'Malaria test positive: give oral antimalarial AL. Dose from your chart booklet.'
        : f.malariaTest === 'negative'
          ? 'Malaria test negative: the chart gives AL only for a positive test. Give home care advice.'
          : 'Do a malaria rapid diagnostic test (RDT). Give AL only if it is positive.'
    findings.push({ text: 'Fever for less than 7 days (malaria area)', action, page: 9 })
  }

  if (f.ageMonths >= 6 && f.muacColour === 'yellow') {
    findings.push({
      text: 'Yellow on MUAC strap',
      action: 'Counsel the caregiver on feeding, or refer to a supplementary feeding programme if available.',
      page: 9,
    })
  }

  return findings
}

// Returns plain data only, so the result can be saved with the case.
export function classify(f) {
  const age = f.ageMonths
  if (age === null || age === undefined || !Number.isInteger(age)) {
    return { outcome: 'incomplete', triggers: [], unknown: [{ label: 'Age in months', page: 5 }], findings: [], actions: [] }
  }
  if (age < 2 || age > 59) {
    return {
      outcome: 'outOfScope',
      triggers: [],
      unknown: [],
      findings: [],
      actions: [
        {
          text:
            age < 2
              ? 'This chart covers age 2 months up to 5 years. Use your young infant chart, or refer to a health facility.'
              : 'This chart covers age 2 months up to 5 years. Refer to a health facility for any problem you cannot manage.',
          page: 3,
        },
      ],
    }
  }

  const checked = DANGER_SIGNS.map((rule) => ({ rule, value: rule.test(f) }))
  const triggers = checked.filter((c) => c.value === true).map(({ rule }) => ({ id: rule.id, label: rule.label, page: rule.page }))
  const unknown = checked.filter((c) => c.value === null).map(({ rule }) => ({ label: rule.label, page: rule.page }))

  if (triggers.length > 0) {
    const actions = [...REFER_ACTIONS]
    if (f.diarrhoea === true && f.unableToDrink !== true) {
      actions.splice(2, 0, { text: 'Diarrhoea and the child can drink: begin giving ORS solution right away and give extra for the journey.', page: 10 })
    }
    return { outcome: 'refer', triggers, unknown, findings: [], actions }
  }

  if (unknown.length > 0) {
    return { outcome: 'incomplete', triggers, unknown, findings: [], actions: [] }
  }

  const findings = sickButNoDangerSign(f)
  if (findings.length > 0) {
    return { outcome: 'treat', triggers, unknown, findings, actions: HOME_CARE_ACTIONS }
  }

  return {
    outcome: 'home',
    triggers,
    unknown,
    findings: [],
    actions: [
      { text: 'No danger sign and no illness from this checklist was found.', page: 8 },
      { text: 'If there is any other problem or condition you cannot manage, refer the child to a health facility.', page: 12 },
      { text: 'Check the vaccines the child has received.', page: 12 },
    ],
  }
}
