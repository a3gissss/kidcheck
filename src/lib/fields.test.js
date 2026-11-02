import { describe, it, expect } from 'vitest'
import { ALL_FIELDS, emptyFields, clearHidden, validateFields, missingInfo, scopeNote, formatValue, sanitizeFields, fieldWarnings } from './fields.js'

const field = (key) => ALL_FIELDS.find((f) => f.key === key)

describe('emptyFields', () => {
  it('starts every field as not asked (null)', () => {
    const fields = emptyFields()
    expect(Object.keys(fields)).toHaveLength(ALL_FIELDS.length)
    expect(Object.values(fields).every((v) => v === null)).toBe(true)
  })
})

describe('validateFields', () => {
  it('requires age', () => {
    expect(validateFields(emptyFields())).toHaveProperty('ageMonths')
  })

  it('accepts a valid age', () => {
    expect(validateFields({ ...emptyFields(), ageMonths: 18 })).toEqual({})
  })

  it('rejects decimals and out-of-range numbers', () => {
    const base = { ...emptyFields(), ageMonths: 18, cough: true }
    expect(validateFields({ ...base, ageMonths: 1.5 })).toHaveProperty('ageMonths')
    expect(validateFields({ ...base, breathsPerMinute: 400 })).toHaveProperty('breathsPerMinute')
  })

  it('ignores follow-up fields that are hidden', () => {
    const fields = { ...emptyFields(), ageMonths: 18, cough: false, breathsPerMinute: 400 }
    expect(validateFields(fields)).toEqual({})
  })
})

describe('clearHidden', () => {
  it('clears cough follow-ups when cough is answered No', () => {
    const fields = clearHidden({ ...emptyFields(), cough: false, coughDays: 3, breathsPerMinute: 50 })
    expect(fields.coughDays).toBeNull()
    expect(fields.breathsPerMinute).toBeNull()
  })

  it('keeps follow-ups when cough is Yes', () => {
    const fields = clearHidden({ ...emptyFields(), cough: true, coughDays: 3 })
    expect(fields.coughDays).toBe(3)
  })
})

describe('missingInfo', () => {
  it('lists unanswered danger signs but not optional or hidden fields', () => {
    const keys = missingInfo({ ...emptyFields(), ageMonths: 18 }).map((f) => f.key)
    expect(keys).toContain('convulsions')
    expect(keys).not.toContain('sex')
    expect(keys).not.toContain('coughDays')
  })

  it('asks for follow-ups once the symptom is Yes', () => {
    const keys = missingInfo({ ...emptyFields(), ageMonths: 18, cough: true }).map((f) => f.key)
    expect(keys).toContain('coughDays')
    expect(keys).toContain('breathsPerMinute')
  })
})

describe('scopeNote', () => {
  it.each([
    [1, true],
    [2, false],
    [59, false],
    [60, true],
  ])('age %i months out of scope: %s', (age, outOfScope) => {
    expect(scopeNote({ ...emptyFields(), ageMonths: age }) !== null).toBe(outOfScope)
  })
})

describe('formatValue', () => {
  it('formats each field type', () => {
    expect(formatValue(field('convulsions'), null)).toBe('Not asked')
    expect(formatValue(field('convulsions'), false)).toBe('No')
    expect(formatValue(field('ageMonths'), 18)).toBe('18 months')
    expect(formatValue(field('muacColour'), 'red')).toBe('Red')
  })
})

describe('sanitizeFields', () => {
  it('keeps valid values and nulls the rest', () => {
    const fields = sanitizeFields({ ageMonths: 18, convulsions: 'yes', muacColour: 'red', extra: 1 })
    expect(fields).toEqual({ ...emptyFields(), ageMonths: 18, muacColour: 'red' })
  })
})

describe('fieldWarnings', () => {
  it('warns about unusual breath counts', () => {
    const base = { ...emptyFields(), ageMonths: 18, cough: true }
    expect(fieldWarnings({ ...base, breathsPerMinute: 12 })).toHaveProperty('breathsPerMinute')
    expect(fieldWarnings({ ...base, breathsPerMinute: 120 })).toHaveProperty('breathsPerMinute')
    expect(fieldWarnings({ ...base, breathsPerMinute: 45 })).toEqual({})
  })

  it('warns when an illness is longer than the child has been alive', () => {
    const fields = { ...emptyFields(), ageMonths: 3, fever: true, feverDays: 120 }
    expect(fieldWarnings(fields)).toHaveProperty('feverDays')
    expect(fieldWarnings({ ...fields, feverDays: 5 })).toEqual({})
  })
})
