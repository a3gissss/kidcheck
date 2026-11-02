import { describe, it, expect } from 'vitest'
import { looksLikePhoneNumber } from './privacy.js'

describe('looksLikePhoneNumber', () => {
  it.each(['Call mother on 08031234567', '+234 803 123 4567', '0803-123-4567'])('flags %s', (text) => {
    expect(looksLikePhoneNumber(text)).toBe(true)
  })

  it.each([
    'Boy, 18 months, cough 3 days, 52 breaths per minute',
    'Fever 7 days, MUAC 115 mm, temperature 38.5',
    'Born 2024, now 24 months',
  ])('does not flag clinical text: %s', (text) => {
    expect(looksLikePhoneNumber(text)).toBe(false)
  })
})
