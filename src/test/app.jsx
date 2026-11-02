// Helpers for the UI tests: render the whole app at a URL and fill the checklist
// the way a CHW would, by clicking labelled controls.

import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'
import { ALL_FIELDS } from '../lib/fields.js'

beforeEach(() => {
  localStorage.clear()
  // jsdom does not implement these browser functions.
  window.scrollTo = vi.fn()
  window.print = vi.fn()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

export function renderApp(path = '/') {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
  return user
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// answers: { ageMonths: 18, cough: true, muacColour: 'green', ... }
export async function fillChecklist(user, answers) {
  for (const [key, value] of Object.entries(answers)) {
    const field = ALL_FIELDS.find((f) => f.key === key)
    if (field.type === 'number') {
      const input = document.getElementById(`field-${key}`)
      await user.clear(input)
      await user.type(input, String(value))
    } else {
      const label = value === null ? 'Not asked' : field.options.find(([v]) => v === value)[1]
      const group = screen.getByRole('group', { name: new RegExp(`^${escape(field.label)}`) })
      await user.click(within(group).getByRole('radio', { name: label }))
    }
  }
}

// Every danger sign and symptom answered "No", MUAC green: a child with nothing found.
export const ALL_NO = {
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
}

export function mockApi(status, body) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
