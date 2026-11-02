// The case fields a CHW records. The rule engine (Stage 3) and the AI
// extractor (Stage 4) both use these keys. null always means "not asked yet".

const YES_NO = [
  [true, 'Yes'],
  [false, 'No'],
]

export const SECTIONS = [
  {
    id: 'child',
    title: 'Child',
    fields: [
      { key: 'ageMonths', label: 'Age', type: 'number', unit: 'months', min: 0, max: 120, required: true },
      { key: 'sex', label: 'Sex', type: 'choice', options: [['female', 'Female'], ['male', 'Male']], optional: true },
    ],
  },
  {
    id: 'danger',
    title: 'Danger signs',
    hint: 'Ask about or look for every sign. Any one of them changes the decision.',
    fields: [
      { key: 'convulsions', label: 'Convulsions', type: 'choice', options: YES_NO },
      { key: 'unableToDrink', label: 'Not able to drink or feed anything', type: 'choice', options: YES_NO },
      { key: 'vomitsEverything', label: 'Vomits everything', type: 'choice', options: YES_NO },
      { key: 'unusuallySleepy', label: 'Very sleepy or unconscious', type: 'choice', options: YES_NO },
      { key: 'chestIndrawing', label: 'Chest indrawing', type: 'choice', options: YES_NO },
    ],
  },
  {
    id: 'cough',
    title: 'Cough or difficult breathing',
    fields: [
      { key: 'cough', label: 'Cough or difficult breathing', type: 'choice', options: YES_NO },
      { key: 'coughDays', label: 'For how many days?', shortLabel: 'Cough duration', type: 'number', unit: 'days', min: 0, max: 365, showIf: (f) => f.cough === true },
      { key: 'breathsPerMinute', label: 'Breaths counted in one full minute', shortLabel: 'Breathing rate', type: 'number', unit: 'breaths/min', min: 5, max: 150, showIf: (f) => f.cough === true },
    ],
  },
  {
    id: 'diarrhoea',
    title: 'Diarrhoea',
    fields: [
      { key: 'diarrhoea', label: 'Diarrhoea (3 or more loose stools a day)', type: 'choice', options: YES_NO },
      { key: 'diarrhoeaDays', label: 'For how many days?', shortLabel: 'Diarrhoea duration', type: 'number', unit: 'days', min: 0, max: 365, showIf: (f) => f.diarrhoea === true },
      { key: 'bloodInStool', label: 'Blood in the stool', type: 'choice', options: YES_NO, showIf: (f) => f.diarrhoea === true },
    ],
  },
  {
    id: 'fever',
    title: 'Fever',
    fields: [
      { key: 'fever', label: 'Fever (now or reported)', type: 'choice', options: YES_NO },
      { key: 'feverDays', label: 'For how many days?', shortLabel: 'Fever duration', type: 'number', unit: 'days', min: 0, max: 365, showIf: (f) => f.fever === true },
      {
        key: 'malariaTest',
        label: 'Malaria rapid test result',
        type: 'choice',
        options: [['positive', 'Positive'], ['negative', 'Negative'], ['notDone', 'Not done']],
        showIf: (f) => f.fever === true,
      },
    ],
  },
  {
    id: 'nutrition',
    title: 'Malnutrition',
    fields: [
      {
        key: 'muacColour',
        label: 'MUAC strap colour',
        type: 'choice',
        options: [['red', 'Red'], ['yellow', 'Yellow'], ['green', 'Green']],
        // The chart uses MUAC only from 6 months (page 5).
        showIf: (f) => f.ageMonths === null || f.ageMonths >= 6,
      },
      { key: 'swellingBothFeet', label: 'Swelling of both feet', type: 'choice', options: YES_NO },
    ],
  },
]

export const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields)

export function emptyFields() {
  return Object.fromEntries(ALL_FIELDS.map((field) => [field.key, null]))
}

export function isVisible(field, fields) {
  return !field.showIf || field.showIf(fields)
}

// Follow-up fields (like cough days) are cleared when their question is answered "No".
export function clearHidden(fields) {
  const next = { ...fields }
  for (const field of ALL_FIELDS) {
    if (!isVisible(field, next)) next[field.key] = null
  }
  return next
}

// Keeps only allowed values; anything else becomes null ("not asked").
// Used for AI output (server) and for cases read back from storage.
export function sanitizeFields(raw) {
  const fields = {}
  for (const field of ALL_FIELDS) {
    const value = raw && typeof raw === 'object' ? raw[field.key] : null
    if (field.type === 'number') {
      fields[field.key] = Number.isInteger(value) && value >= field.min && value <= field.max ? value : null
    } else {
      fields[field.key] = field.options.some(([option]) => option === value) ? value : null
    }
  }
  return clearHidden(fields)
}

// Soft warnings: allowed, but worth a second look before saving.
export function fieldWarnings(fields) {
  const warnings = {}
  const breaths = fields.breathsPerMinute
  if (Number.isInteger(breaths) && fields.cough === true && (breaths < 15 || breaths > 100)) {
    warnings.breathsPerMinute = 'This is an unusual breath count. Count again for one full minute.'
  }
  for (const key of ['coughDays', 'diarrhoeaDays', 'feverDays']) {
    if (Number.isInteger(fields[key]) && Number.isInteger(fields.ageMonths) && fields[key] > fields.ageMonths * 31) {
      warnings[key] = 'This is longer than the child has been alive. Check the number of days.'
    }
  }
  return warnings
}

export function validateFields(fields) {
  const errors = {}
  for (const field of ALL_FIELDS) {
    if (field.type !== 'number' || !isVisible(field, fields)) continue
    const value = fields[field.key]
    if (value === null) {
      if (field.required) errors[field.key] = `${field.label} is required.`
    } else if (!Number.isInteger(value) || value < field.min || value > field.max) {
      errors[field.key] = `Enter a whole number from ${field.min} to ${field.max}.`
    }
  }
  return errors
}

export function missingInfo(fields) {
  return ALL_FIELDS.filter((field) => !field.optional && isVisible(field, fields) && fields[field.key] === null)
}

export function scopeNote(fields) {
  const age = fields.ageMonths
  if (age === null || !Number.isInteger(age)) return null
  if (age < 2) return 'KidCheck only covers children aged 2 to 59 months. Use your young infant chart for babies under 2 months.'
  if (age > 59) return 'KidCheck only covers children aged 2 to 59 months. This child is older than 5 years.'
  return null
}

export function formatValue(field, value) {
  if (value === null || value === undefined) return 'Not asked'
  if (field.type === 'number') return `${value} ${field.unit}`
  const option = field.options.find(([optionValue]) => optionValue === value)
  return option ? option[1] : String(value)
}
