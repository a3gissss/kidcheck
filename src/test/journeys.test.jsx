// @vitest-environment jsdom
// End-to-end journeys through the real app (all pages, rules and storage),
// with only the network mocked. Matches the demo journeys in docs/PROJECT_PLAN.md.

import { describe, it, expect, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderApp, fillChecklist, ALL_NO, mockApi } from './app.jsx'
import { STORAGE_KEY } from '../lib/storage.js'

const savedCases = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')

async function openManualChecklist(user) {
  await user.click(screen.getByRole('button', { name: 'Fill checklist myself' }))
  expect(screen.getByText('2. Check every field')).toHaveAttribute('aria-current', 'step')
}

describe('Journey 1: urgent case', () => {
  it('refers urgently, names the sign, offers the referral note, and saves the case', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, {
      ...ALL_NO,
      ageMonths: 18,
      sex: 'male',
      vomitsEverything: true,
      cough: true,
      coughDays: 3,
      breathsPerMinute: 52,
    })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))

    const alert = await screen.findByRole('alertdialog', { name: /Refer urgently/ })
    expect(within(alert).getByText('Vomits everything')).toBeInTheDocument()
    expect(within(alert).getByRole('button', { name: 'See what to do' })).toHaveFocus()

    await user.click(within(alert).getByRole('button', { name: 'See what to do' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Refer urgently' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Print referral note' }))
    expect(window.print).toHaveBeenCalled()

    expect(savedCases()).toHaveLength(1)
    expect(savedCases()[0]).toMatchObject({ outcome: 'refer', source: 'manual' })
  })
})

describe('Journey 2: home treatment', () => {
  it('treats diarrhoea without danger signs at home with ORS and zinc', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, { ...ALL_NO, ageMonths: 24, diarrhoea: true, diarrhoeaDays: 2, bloodInStool: false })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))

    expect(await screen.findByRole('heading', { name: 'Treat at home and advise' })).toBeInTheDocument()
    expect(screen.getByText(/Give ORS and zinc/)).toBeInTheDocument()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})

describe('Journey 3: AI offline', () => {
  it('falls back to the manual checklist with a clear notice, and the rules still decide', async () => {
    mockApi(503, { error: 'no_key' })
    const user = renderApp('/new')
    await user.type(screen.getByLabelText('What is wrong with the child?'), 'Girl, 2 years, loose stools for 2 days')
    await user.click(screen.getByRole('button', { name: 'Fill checklist with AI' }))

    expect(await screen.findByText('AI unavailable, using the manual checklist.')).toBeInTheDocument()
    await fillChecklist(user, { ...ALL_NO, ageMonths: 24 })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    expect(await screen.findByRole('heading', { name: 'No illness sign found' })).toBeInTheDocument()
  })
})

describe('AI fills the checklist', () => {
  it('marks AI answers, drops the mark when the CHW changes one, and records the source', async () => {
    const fetchMock = mockApi(200, {
      model: 'test-model',
      filled: ['ageMonths', 'sex', 'vomitsEverything'],
      fields: { ageMonths: 18, sex: 'male', vomitsEverything: true },
    })
    const user = renderApp('/new')
    await user.click(screen.getByRole('button', { name: 'Fast breathing, vomiting' }))
    await user.click(screen.getByRole('button', { name: 'Fill checklist with AI' }))

    expect(await screen.findByText(/AI filled 3 answers/)).toBeInTheDocument()
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).text).toMatch(/^Boy, 18 months/)
    expect(screen.getAllByText('filled this answer, check it', { exact: false })).toHaveLength(3)

    await fillChecklist(user, { sex: 'female' })
    expect(screen.getAllByText('filled this answer, check it', { exact: false })).toHaveLength(2)

    await fillChecklist(user, { ...ALL_NO, vomitsEverything: true })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    await screen.findByRole('alertdialog')
    expect(savedCases()[0]).toMatchObject({ source: 'ai', aiModel: 'test-model', outcome: 'refer' })
  })

  it('never sends a description containing a phone number', async () => {
    const fetchMock = mockApi(200, {})
    const user = renderApp('/new')
    await user.type(screen.getByLabelText('What is wrong with the child?'), 'Fever 2 days, call 0803 123 4567')
    await user.click(screen.getByRole('button', { name: 'Fill checklist with AI' }))
    expect(screen.getByText(/looks like a phone number/)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('Landing page', () => {
  it('explains the product and starts a case from the panel', async () => {
    mockApi(503, { error: 'no_key' })
    const user = renderApp('/')
    expect(screen.getByRole('heading', { level: 1, name: /Plain words in/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'What KidCheck will not do' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fill checklist with AI' }))
    expect(screen.getByText(/Write a description first/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Diarrhoea, drinking well' }))
    await user.click(screen.getByRole('button', { name: 'Fill checklist with AI' }))
    expect(await screen.findByText('AI unavailable, using the manual checklist.')).toBeInTheDocument()
    expect(screen.getByText(/Loose stools for 2 days/)).toBeInTheDocument()
  })

  it('starts the manual checklist with the description carried over', async () => {
    const user = renderApp('/')
    await user.type(screen.getByLabelText('What is wrong with the child?'), 'Boy 3 years, fever')
    await user.click(screen.getByRole('button', { name: 'Fill checklist myself' }))
    expect(screen.getByText('2. Check every field')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByText('Boy 3 years, fever')).toBeInTheDocument()
  })
})

describe('Checklist editing', () => {
  // Regression: typing "24" passes through age 2, which hides MUAC (under 6 months).
  // That used to erase the MUAC answer, so the case came back "Needs more answers".
  it('keeps the MUAC answer when the age is typed after it', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, { ...ALL_NO, muacColour: 'yellow', ageMonths: 24 })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    expect(await screen.findByRole('heading', { name: 'Treat at home and advise' })).toBeInTheDocument()
    expect(savedCases()[0].fields.muacColour).toBe('yellow')
  })

  it('does not save answers to questions that end up hidden', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, { ...ALL_NO, ageMonths: 24, cough: true, coughDays: 5 })
    await fillChecklist(user, { cough: false })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    await screen.findByRole('heading', { name: 'No illness sign found' })
    expect(savedCases()[0].fields.coughDays).toBeNull()
  })
})

describe('Checklist validation', () => {
  it('requires an age and moves focus to it', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    expect(screen.getByText('Age is required.')).toBeInTheDocument()
    expect(document.getElementById('field-ageMonths')).toHaveFocus()
    expect(savedCases()).toHaveLength(0)
  })

  it('shows follow-up questions only when the symptom is Yes', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    expect(document.getElementById('field-coughDays')).toBeNull()
    await fillChecklist(user, { cough: true })
    expect(document.getElementById('field-coughDays')).not.toBeNull()
    await fillChecklist(user, { cough: false })
    expect(document.getElementById('field-coughDays')).toBeNull()
  })
})

describe('Needs more answers, then edit', () => {
  it('does not decide with a danger sign unasked, and editing completes the same case', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, { ...ALL_NO, ageMonths: 30, chestIndrawing: null })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))

    expect(await screen.findByRole('heading', { name: 'Needs more answers' })).toBeInTheDocument()
    const id = savedCases()[0].id

    await user.click(screen.getByRole('button', { name: 'Answer the missing questions' }))
    expect(screen.getByRole('heading', { name: `Edit case ${id}` })).toBeInTheDocument()
    expect(document.getElementById('field-ageMonths')).toHaveValue(30)

    await fillChecklist(user, { chestIndrawing: true })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    await screen.findByRole('alertdialog')
    expect(savedCases()).toHaveLength(1)
    expect(savedCases()[0]).toMatchObject({ id, outcome: 'refer' })
  })
})

describe('Case log', () => {
  it('lists cases, filters by outcome, and deletes all after confirming', async () => {
    const user = renderApp('/new')
    await openManualChecklist(user)
    await fillChecklist(user, { ...ALL_NO, ageMonths: 24 })
    await user.click(screen.getByRole('button', { name: 'Save and see result' }))
    await screen.findByRole('heading', { name: 'No illness sign found' })

    await user.click(screen.getByRole('link', { name: 'Back to case log' }))
    expect(screen.getByRole('button', { name: 'All (1)' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'No illness sign found (1)' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)

    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    await user.click(screen.getByRole('button', { name: 'Delete all cases' }))
    expect(savedCases()).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Delete all cases' }))
    expect(screen.getByText('No cases yet')).toBeInTheDocument()
    expect(savedCases()).toHaveLength(0)
  })
})

describe('Other pages', () => {
  it('shows a not-found page for unknown addresses and unknown cases', async () => {
    renderApp('/nowhere')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows case not found', () => {
    renderApp('/cases/KC-NOPE')
    expect(screen.getByRole('heading', { name: 'Case not found' })).toBeInTheDocument()
  })

  it.each(['/', '/new', '/cases', '/cases/KC-NOPE', '/nowhere'])('keeps the disclaimer on %s', (path) => {
    renderApp(path)
    expect(screen.getByText('Educational prototype. Not a medical device. Not clinically validated.')).toBeInTheDocument()
  })
})
