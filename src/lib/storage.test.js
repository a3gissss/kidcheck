import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadCases, getCase, saveCase, deleteCase, clearCases, storageAvailable, STORAGE_KEY } from './storage.js'
import { emptyFields } from './fields.js'

// Tests run in Node, which has no localStorage, so use a small in-memory one.
function memoryStorage() {
  const data = new Map()
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
}

const sample = (id, extra = {}) => ({
  id,
  createdAt: '2026-11-02T09:00:00.000Z',
  intakeText: '',
  fields: { ...emptyFields(), ageMonths: 18 },
  outcome: 'home',
  result: { outcome: 'home', triggers: [], unknown: [], findings: [], actions: [] },
  ...extra,
})

beforeEach(() => vi.stubGlobal('localStorage', memoryStorage()))
afterEach(() => vi.unstubAllGlobals())

describe('saving and loading', () => {
  it('saves newest first and replaces a case with the same id', () => {
    saveCase(sample('A'))
    saveCase(sample('B'))
    saveCase(sample('A', { intakeText: 'edited' }))
    expect(loadCases().map((c) => c.id)).toEqual(['A', 'B'])
    expect(getCase('A').intakeText).toBe('edited')
  })

  it('deletes one case or all', () => {
    saveCase(sample('A'))
    saveCase(sample('B'))
    deleteCase('A')
    expect(loadCases().map((c) => c.id)).toEqual(['B'])
    clearCases()
    expect(loadCases()).toEqual([])
  })

  it('returns null for an unknown id', () => {
    expect(getCase('nope')).toBeNull()
  })
})

describe('bad stored data never crashes the app', () => {
  it.each([
    ['not JSON', '{oops'],
    ['not a list', '{"id":"A"}'],
    ['null', 'null'],
  ])('%s -> empty list', (_, raw) => {
    localStorage.setItem(STORAGE_KEY, raw)
    expect(loadCases()).toEqual([])
  })

  it('drops entries that are not cases', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([null, 5, 'x', { noId: true }, { id: '' }, sample('OK')]))
    expect(loadCases().map((c) => c.id)).toEqual(['OK'])
  })

  it('repairs missing or invalid parts', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 'OLD', createdAt: 'yesterday', fields: { ageMonths: 'eighteen', convulsions: 'yes', cough: true }, outcome: 'refer' }])
    )
    const c = loadCases()[0]
    expect(c.fields).toEqual({ ...emptyFields(), cough: true })
    expect(c.intakeText).toBe('')
    expect(c.createdAt).toBeNull()
    // An outcome without the saved result cannot be shown, so it is treated as not classified.
    expect(c.outcome).toBeNull()
  })

  it.each([
    ['not an object', 'refer'],
    [{ triggers: 5 }, 'missing lists'],
    [{ triggers: [null], unknown: [], findings: [], actions: [] }, 'bad items'],
  ])('treats a damaged result (%o) as not classified', (result) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sample('A', { outcome: 'refer', result })]))
    expect(loadCases()[0]).toMatchObject({ outcome: null, result: null })
  })

  it('keeps an unknown outcome out', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([sample('A', { outcome: 'cured' })]))
    expect(loadCases()[0].outcome).toBeNull()
  })
})

describe('blocked or full storage', () => {
  const blocked = () => {
    throw new Error('SecurityError')
  }

  it('reports unavailable storage', () => {
    expect(storageAvailable()).toBe(true)
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked, removeItem: blocked })
    expect(storageAvailable()).toBe(false)
  })

  it('loads as empty but throws on save so the page can show an error', () => {
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked, removeItem: blocked })
    expect(loadCases()).toEqual([])
    expect(() => saveCase(sample('A'))).toThrow()
    expect(() => deleteCase('A')).toThrow()
  })
})
