import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CaseField from '../components/CaseField.jsx'
import {
  SECTIONS,
  emptyFields,
  clearHidden,
  isVisible,
  validateFields,
  fieldWarnings,
  missingInfo,
  scopeNote,
} from '../lib/fields.js'
import { SAMPLES } from '../lib/samples.js'
import { classify, RULES_VERSION } from '../lib/rules.js'
import { saveCase, getCase, newCaseId } from '../lib/storage.js'
import { requestExtraction } from '../lib/extractClient.js'
import { aiTextError, MAX_TEXT } from '../lib/privacy.js'

function Steps({ step }) {
  const items = ['Describe the child', 'Check every field']
  return (
    <ol className="flex gap-2 text-sm">
      {items.map((label, i) => {
        const active = i === step
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={`flex-1 rounded-md border px-3 py-2 ${
              active ? 'border-teal-700 bg-teal-50 font-medium text-teal-900' : 'border-slate-200 text-slate-500'
            }`}
          >
            {i + 1}. {label}
          </li>
        )
      })}
    </ol>
  )
}

// A fresh form every time /new is opened, even from /new itself.
export default function NewCase() {
  const location = useLocation()
  return <CaseForm key={location.key} />
}

function CaseForm() {
  const navigate = useNavigate()
  const location = useLocation()
  // Editing an existing case: /new with state { editId } from the case page.
  const [editing] = useState(() => (location.state?.editId ? getCase(location.state.editId) : null))
  const editMissing = Boolean(location.state?.editId) && !editing
  // Started from the landing page: /new with state { draft: { text, start: 'ai' | 'manual' } }.
  const draft = editing ? null : location.state?.draft
  const [step, setStep] = useState(editing || draft?.start === 'manual' ? 1 : 0)
  const [text, setText] = useState(editing?.intakeText ?? draft?.text ?? '')
  const [fields, setFields] = useState(() => (editing ? { ...emptyFields(), ...editing.fields } : emptyFields()))
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiNotice, setAiNotice] = useState(null)
  const [aiFilled, setAiFilled] = useState([])
  const [aiModel, setAiModel] = useState(editing?.aiModel ?? null)
  const [textError, setTextError] = useState('')
  const [saved, setSaved] = useState(false)

  // Warn before closing or reloading the tab with unsaved answers.
  const dirty = !saved && (text.trim() !== (editing?.intakeText ?? '') || Object.values(fields).some((v) => v !== null))
  useEffect(() => {
    if (!dirty) return
    function onBeforeUnload(e) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Hidden answers stay in memory while editing, so typing an age ("2" on the way
  // to "24") cannot wipe an answer whose question is briefly hidden. They are
  // cleared on save.
  function updateField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    // Once the CHW sets a field, it is theirs, not the AI's.
    setAiFilled((prev) => prev.filter((k) => k !== key))
  }

  function goToReview() {
    setStep(1)
    window.scrollTo(0, 0)
  }

  function fillManually() {
    setAiNotice(null)
    setAiFilled([])
    goToReview()
  }

  function fillWithAi(e) {
    e.preventDefault()
    const problem = aiTextError(text)
    if (problem) {
      setTextError(problem)
      document.getElementById('intake')?.focus()
      return
    }
    runAi(text)
  }

  async function runAi(source) {
    setAiLoading(true)
    const res = await requestExtraction(source.trim())
    setAiLoading(false)
    if (res.ok) {
      setFields(clearHidden({ ...emptyFields(), ...res.fields }))
      setAiFilled(res.filled)
      setAiModel(res.model)
      setAiNotice({ kind: 'success', count: res.filled.length })
    } else {
      // Transparent fallback: same checklist, same rules, nothing filled in.
      setFields(emptyFields())
      setAiFilled([])
      setAiModel(null)
      setAiNotice({ kind: 'fallback', message: res.message })
    }
    goToReview()
  }

  // The landing page already checked the text; start the AI once on arrival.
  const [autoText] = useState(() => (draft?.start === 'ai' && !aiTextError(draft.text) ? draft.text : null))
  const autoStarted = useRef(false)
  const startAi = useEffectEvent((source) => runAi(source))
  useEffect(() => {
    if (!autoText || autoStarted.current) return
    autoStarted.current = true
    startAi(autoText)
  }, [autoText])

  function handleSave(e) {
    e.preventDefault()
    const answers = clearHidden(fields)
    const found = validateFields(answers)
    setErrors(found)
    const firstKey = Object.keys(found)[0]
    if (firstKey) {
      document.getElementById(`field-${firstKey}`)?.focus()
      return
    }

    const id = editing?.id ?? newCaseId()
    const result = classify(answers)
    try {
      saveCase({
        id,
        createdAt: editing?.createdAt ?? new Date().toISOString(),
        updatedAt: editing ? new Date().toISOString() : undefined,
        intakeText: text.trim(),
        fields: answers,
        outcome: result.outcome,
        result,
        rulesVersion: RULES_VERSION,
        source: aiModel ? 'ai' : 'manual',
        aiModel,
      })
    } catch {
      setSaveError('Could not save the case. Your browser may be blocking storage or it may be full.')
      return
    }
    setSaved(true)
    navigate(`/cases/${id}`, { state: { justSaved: true } })
  }

  if (step === 0) {
    return (
      <form onSubmit={fillWithAi} className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">New case</h1>
        <Steps step={0} />

        {editMissing && (
          <div role="status" className="rounded-md border border-slate-300 bg-white p-3 text-sm">
            The case you tried to edit no longer exists. This is a new case.
          </div>
        )}

        <div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
          Do not type the child's or carer's name, phone number or village. Age and sex are enough.
        </div>

        <div>
          <label htmlFor="intake" className="block font-medium">
            What is wrong with the child?
          </label>
          <p className="text-sm text-slate-600">Write it the way the carer told you. You can skip this and fill the checklist directly.</p>
          <textarea
            id="intake"
            rows={5}
            maxLength={MAX_TEXT}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setTextError('')
            }}
            placeholder="e.g. Boy, 18 months, coughing for 3 days, breathing fast..."
            aria-invalid={textError ? 'true' : undefined}
            aria-describedby={textError ? 'intake-error' : undefined}
            className={`mt-2 w-full rounded-md border p-3 placeholder:text-slate-500 ${textError ? 'border-red-600' : 'border-slate-300'}`}
          />
          <div className="flex justify-between gap-4">
            <p id="intake-error" className="text-sm text-red-700">
              {textError}
            </p>
            <p className="text-xs text-slate-500">
              {text.length} / {MAX_TEXT}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Or try a synthetic demo case</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <button
                key={sample.title}
                type="button"
                onClick={() => {
                  setText(sample.text)
                  setTextError('')
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          AI (Google Gemini) reads your description and fills in the checklist. It does not decide anything: you check
          every answer, then the WHO rules decide. Your description is sent to Google, which may use it to improve its
          products.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={aiLoading}
            className="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-70"
          >
            {aiLoading ? 'Reading the description...' : 'Fill checklist with AI'}
          </button>
          <button
            type="button"
            onClick={fillManually}
            disabled={aiLoading}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-100 disabled:opacity-70"
          >
            Fill checklist myself
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {aiLoading ? 'Reading the description with AI.' : ''}
        </p>
      </form>
    )
  }

  const missing = missingInfo(fields)
  const note = scopeNote(fields)
  const errorCount = Object.values(errors).filter(Boolean).length
  const warnings = fieldWarnings(fields)

  return (
    <form onSubmit={handleSave} noValidate className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{editing ? `Edit case ${editing.id}` : 'New case'}</h1>
      <Steps step={1} />

      {text.trim() && (
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">What you wrote</p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{text.trim()}</p>
        </div>
      )}

      {aiNotice?.kind === 'success' && (
        <div role="status" className="rounded-md border border-violet-300 bg-violet-50 p-3 text-sm text-violet-900">
          AI filled {aiNotice.count} {aiNotice.count === 1 ? 'answer' : 'answers'} from your description. Check every
          answer marked <span className="font-semibold">AI</span> and correct anything wrong. Anything not in your
          description is left as "Not asked".
        </div>
      )}

      {aiNotice?.kind === 'fallback' && (
        <div role="alert" className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium">AI unavailable, using the manual checklist.</p>
          <p className="mt-1">
            {aiNotice.message} Fill in the checklist yourself. The WHO rules work exactly the same.
          </p>
        </div>
      )}

      {errorCount > 0 && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          Fix {errorCount === 1 ? '1 field' : `${errorCount} fields`} before saving.
        </div>
      )}

      {SECTIONS.map((section) => (
        <section key={section.id} className="rounded-lg border border-slate-200 bg-white px-4 py-2">
          <h2 className="pt-2 font-semibold">{section.title}</h2>
          {section.hint && <p className="text-sm text-slate-600">{section.hint}</p>}
          <div className="divide-y divide-slate-100">
            {section.fields
              .filter((field) => isVisible(field, fields))
              .map((field) => (
                <CaseField
                  key={field.key}
                  field={field}
                  value={fields[field.key]}
                  error={errors[field.key]}
                  warning={warnings[field.key]}
                  aiFilled={aiFilled.includes(field.key)}
                  onChange={(value) => updateField(field.key, value)}
                />
              ))}
          </div>
        </section>
      ))}

      {note && <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{note}</div>}

      <div className="rounded-md border border-slate-200 bg-white p-3 text-sm" aria-live="polite">
        {missing.length === 0 ? (
          <p className="text-emerald-800">Every question has an answer.</p>
        ) : (
          <>
            <p className="font-medium">Not asked yet ({missing.length}):</p>
            <p className="mt-1 text-slate-600">{missing.map((field) => field.label).join(' · ')}</p>
          </>
        )}
      </div>

      {saveError && (
        <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {saveError}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-100"
        >
          Back
        </button>
        <button type="submit" className="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800">
          Save and see result
        </button>
      </div>
    </form>
  )
}
