import { describe, it, expect } from 'vitest'
import { classify, DANGER_SIGNS, fastBreathingLimit } from './rules.js'
import { emptyFields } from './fields.js'

// A child with every question answered "No" (green MUAC), aged 24 months.
function child(overrides = {}) {
  return {
    ...emptyFields(),
    ageMonths: 24,
    convulsions: false,
    unableToDrink: false,
    vomitsEverything: false,
    unusuallySleepy: false,
    chestIndrawing: false,
    cough: false,
    diarrhoea: false,
    fever: false,
    muacColour: 'green',
    swellingBothFeet: false,
    ...overrides,
  }
}

const triggerIds = (result) => result.triggers.map((t) => t.id)

describe('age range (chart covers 2 months up to 5 years)', () => {
  it.each([
    [1, 'outOfScope'],
    [2, 'home'],
    [59, 'home'],
    [60, 'outOfScope'],
  ])('age %i months -> %s', (age, outcome) => {
    expect(classify(child({ ageMonths: age, muacColour: age < 6 ? null : 'green' })).outcome).toBe(outcome)
  })

  it('needs an age before deciding', () => {
    expect(classify(child({ ageMonths: null })).outcome).toBe('incomplete')
  })
})

describe('each danger sign refers urgently (page 6)', () => {
  it.each([
    ['convulsions', { convulsions: true }],
    ['unableToDrink', { unableToDrink: true }],
    ['vomitsEverything', { vomitsEverything: true }],
    ['chestIndrawing', { chestIndrawing: true }],
    ['unusuallySleepy', { unusuallySleepy: true }],
    ['swellingBothFeet', { swellingBothFeet: true }],
    ['muacRed', { muacColour: 'red' }],
    ['cough14', { cough: true, coughDays: 14, breathsPerMinute: 30 }],
    ['diarrhoea14', { diarrhoea: true, diarrhoeaDays: 14, bloodInStool: false }],
    ['bloodInStool', { diarrhoea: true, diarrhoeaDays: 2, bloodInStool: true }],
    ['fever7', { fever: true, feverDays: 7, malariaTest: 'negative' }],
  ])('%s', (id, overrides) => {
    const result = classify(child(overrides))
    expect(result.outcome).toBe('refer')
    expect(triggerIds(result)).toEqual([id])
  })

  it('covers every danger sign in the list', () => {
    expect(DANGER_SIGNS).toHaveLength(11)
  })

  it('lists every sign that fired', () => {
    const result = classify(child({ convulsions: true, vomitsEverything: true }))
    expect(triggerIds(result)).toEqual(['convulsions', 'vomitsEverything'])
  })

  it('refers even when other questions are not asked yet', () => {
    const result = classify({ ...emptyFields(), ageMonths: 18, vomitsEverything: true })
    expect(result.outcome).toBe('refer')
    expect(result.unknown.length).toBeGreaterThan(0)
  })

  it('adds ORS for a referred child with diarrhoea who can drink (page 10)', () => {
    const result = classify(child({ chestIndrawing: true, diarrhoea: true, diarrhoeaDays: 2, bloodInStool: false }))
    expect(result.actions.some((a) => a.text.includes('ORS'))).toBe(true)
  })
})

describe('duration boundaries', () => {
  it.each([
    [{ cough: true, coughDays: 13, breathsPerMinute: 30 }, 'treat'],
    [{ cough: true, coughDays: 14, breathsPerMinute: 30 }, 'refer'],
    [{ diarrhoea: true, diarrhoeaDays: 13, bloodInStool: false }, 'treat'],
    [{ diarrhoea: true, diarrhoeaDays: 14, bloodInStool: false }, 'refer'],
    [{ fever: true, feverDays: 6, malariaTest: 'positive' }, 'treat'],
    [{ fever: true, feverDays: 7, malariaTest: 'positive' }, 'refer'],
  ])('%o -> %s', (overrides, outcome) => {
    expect(classify(child(overrides)).outcome).toBe(outcome)
  })
})

describe('MUAC applies from 6 months (page 6)', () => {
  it('ignores MUAC at 5 months', () => {
    expect(classify(child({ ageMonths: 5, muacColour: null })).outcome).toBe('home')
  })

  it('red MUAC at 6 months refers', () => {
    expect(classify(child({ ageMonths: 6, muacColour: 'red' })).outcome).toBe('refer')
  })

  it('yellow MUAC is treated at home with feeding counselling (page 9)', () => {
    const result = classify(child({ muacColour: 'yellow' }))
    expect(result.outcome).toBe('treat')
    expect(result.findings[0].text).toBe('Yellow on MUAC strap')
  })
})

describe('fast breathing thresholds (page 8)', () => {
  it('is 50 under 12 months and 40 from 12 months', () => {
    expect(fastBreathingLimit(11)).toBe(50)
    expect(fastBreathingLimit(12)).toBe(40)
  })

  it.each([
    [11, 49, false],
    [11, 50, true],
    [12, 39, false],
    [12, 40, true],
    [11, 45, false],
    [12, 45, true],
  ])('age %i months, %i breaths/min -> fast: %s', (age, breaths, fast) => {
    const result = classify(child({ ageMonths: age, cough: true, coughDays: 3, breathsPerMinute: breaths }))
    expect(result.outcome).toBe('treat')
    expect(result.findings[0].text.startsWith('Fast breathing')).toBe(fast)
  })

  it('asks to count breaths when the count is missing', () => {
    const result = classify(child({ cough: true, coughDays: 3 }))
    expect(result.outcome).toBe('treat')
    expect(result.findings[0].action).toMatch(/Count breaths/)
  })
})

describe('fever and malaria test (page 9)', () => {
  it.each([
    ['positive', /give oral antimalarial AL/],
    ['negative', /AL only for a positive test/],
    ['notDone', /Do a malaria rapid diagnostic test/],
    [null, /Do a malaria rapid diagnostic test/],
  ])('test %s', (test, action) => {
    const result = classify(child({ fever: true, feverDays: 2, malariaTest: test }))
    expect(result.outcome).toBe('treat')
    expect(result.findings[0].action).toMatch(action)
  })
})

describe('not asked is never treated as No', () => {
  it.each(['convulsions', 'unableToDrink', 'vomitsEverything', 'chestIndrawing', 'unusuallySleepy', 'swellingBothFeet', 'muacColour', 'cough', 'diarrhoea', 'fever'])(
    '%s unknown -> incomplete',
    (key) => {
      expect(classify(child({ [key]: null })).outcome).toBe('incomplete')
    }
  )

  it('needs the number of days when a symptom is present', () => {
    expect(classify(child({ cough: true, breathsPerMinute: 30 })).outcome).toBe('incomplete')
  })

  it('needs blood in stool answered when there is diarrhoea', () => {
    expect(classify(child({ diarrhoea: true, diarrhoeaDays: 2 })).outcome).toBe('incomplete')
  })
})

describe('demo journeys from the project plan', () => {
  it('Journey 1: 18-month-old boy, cough, fast breathing, vomits everything -> refer', () => {
    const result = classify(child({ ageMonths: 18, sex: 'male', cough: true, coughDays: 3, breathsPerMinute: 52, vomitsEverything: true }))
    expect(result.outcome).toBe('refer')
    expect(triggerIds(result)).toEqual(['vomitsEverything'])
  })

  it('Journey 2: diarrhoea 2 days, no blood, drinking normally -> treat at home with ORS and zinc', () => {
    const result = classify(child({ diarrhoea: true, diarrhoeaDays: 2, bloodInStool: false }))
    expect(result.outcome).toBe('treat')
    expect(result.findings[0].action).toMatch(/ORS and zinc/)
  })

  it('no illness signs -> home', () => {
    expect(classify(child()).outcome).toBe('home')
  })
})
