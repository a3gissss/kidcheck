// Cases are stored only in this browser (localStorage). Nothing is sent to a server.

import { sanitizeFields } from './fields.js'
import { OUTCOMES } from './outcomes.js'

export const STORAGE_KEY = 'kidcheck.cases.v1'

// Stored data can be old, edited by hand or half-written. Drop anything that
// is not a case and repair the rest so pages never crash on it.
function validResult(r) {
  const isItemList = (list) => Array.isArray(list) && list.every((item) => item && typeof item === 'object')
  return Boolean(r) && ['triggers', 'unknown', 'findings', 'actions'].every((key) => isItemList(r[key]))
}

function normalize(c) {
  if (!c || typeof c !== 'object' || typeof c.id !== 'string' || !c.id) return null
  const hasResult = OUTCOMES[c.outcome] && validResult(c.result)
  return {
    ...c,
    createdAt: typeof c.createdAt === 'string' && !Number.isNaN(new Date(c.createdAt).getTime()) ? c.createdAt : null,
    intakeText: typeof c.intakeText === 'string' ? c.intakeText : '',
    fields: sanitizeFields(c.fields),
    outcome: hasResult ? c.outcome : null,
    result: hasResult ? c.result : null,
  }
}

export function loadCases() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.map(normalize).filter(Boolean) : []
  } catch {
    return []
  }
}

export function getCase(id) {
  return loadCases().find((c) => c.id === id) ?? null
}

// These three throw if the browser blocks storage or it is full; callers show the error.
export function saveCase(newCase) {
  const cases = [newCase, ...loadCases().filter((c) => c.id !== newCase.id)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
}

export function deleteCase(id) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loadCases().filter((c) => c.id !== id)))
}

export function clearCases() {
  localStorage.removeItem(STORAGE_KEY)
}

export function storageAvailable() {
  try {
    localStorage.setItem('kidcheck.test', '1')
    localStorage.removeItem('kidcheck.test')
    return true
  } catch {
    return false
  }
}

export function newCaseId() {
  return `KC-${Date.now().toString(36).toUpperCase()}`
}
