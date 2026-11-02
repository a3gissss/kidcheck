import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { SECTIONS, isVisible, formatValue } from '../lib/fields.js'
import { OUTCOMES, outcomeKey } from '../lib/outcomes.js'
import { RULES_SOURCE, RULES_VERSION } from '../lib/rules.js'
import { getCase, deleteCase } from '../lib/storage.js'
import { formatDate } from '../lib/dates.js'

const SEX_LABEL = { female: 'Girl', male: 'Boy' }

function Page({ page }) {
  return <span className="whitespace-nowrap text-xs text-slate-600"> (chart p. {page})</span>
}

function UrgentAlert({ triggers, onClose }) {
  const buttonRef = useRef(null)
  useEffect(() => {
    buttonRef.current?.focus()
  }, [])

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="urgent-title"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-700 p-6 text-center text-white print:hidden"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-red-100">Danger sign found</p>
      <h2 id="urgent-title" className="mt-2 text-3xl font-bold sm:text-4xl">
        Refer urgently to a health facility now
      </h2>
      <ul className="mt-6 space-y-1 text-lg">
        {triggers.map((t) => (
          <li key={t.id}>{t.label}</li>
        ))}
      </ul>
      <button
        ref={buttonRef}
        type="button"
        onClick={onClose}
        className="mt-10 rounded-lg bg-white px-8 py-3 font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-4 focus-visible:outline-white"
      >
        See what to do
      </button>
    </div>
  )
}

function ReferralNote({ caseData, result }) {
  const { fields } = caseData
  const who = [fields.ageMonths !== null && `${fields.ageMonths} months`, SEX_LABEL[fields.sex]].filter(Boolean).join(', ')
  const positives = SECTIONS.flatMap((s) => s.fields).filter(
    (field) => field.key !== 'ageMonths' && field.key !== 'sex' && isVisible(field, fields) && fields[field.key] !== null && fields[field.key] !== false
  )

  return (
    <section className="hidden text-black print:block">
      <h1 className="text-2xl font-bold">Referral note</h1>
      <p className="mt-1">
        Case {caseData.id} · {formatDate(caseData.createdAt)} · {who}
      </p>
      <h2 className="mt-4 font-bold">Referred urgently because of</h2>
      <ul className="list-disc pl-6">
        {result.triggers.map((t) => (
          <li key={t.id}>{t.label}</li>
        ))}
      </ul>
      <h2 className="mt-4 font-bold">Findings recorded by the community health worker</h2>
      <ul className="list-disc pl-6">
        {positives.map((field) => (
          <li key={field.key}>
            {field.shortLabel ?? field.label}: {formatValue(field, fields[field.key])}
          </li>
        ))}
      </ul>
      {result.unknown.length > 0 && (
        <p className="mt-4">Not checked: {result.unknown.map((u) => u.label).join(', ')}.</p>
      )}
      <p className="mt-4">First dose of treatment given before referral: ______________________________</p>
      <p className="mt-6">CHW signature: ______________________ Date: ____________</p>
      <p className="mt-8 text-sm">
        Produced by KidCheck, an educational prototype. Not a medical device. Not clinically validated. Rules from {RULES_SOURCE}.
      </p>
    </section>
  )
}

export default function CaseResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [caseData] = useState(() => getCase(id))
  const [showAlert, setShowAlert] = useState(() => Boolean(location.state?.justSaved) && caseData?.outcome === 'refer')
  const [deleteError, setDeleteError] = useState('')

  if (!caseData) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Case not found</h1>
        <p className="mt-2 text-slate-600">It may have been deleted, or it was saved in a different browser.</p>
        <Link to="/cases" className="mt-4 inline-block text-teal-700 underline">
          Go to the case log
        </Link>
      </div>
    )
  }

  const key = outcomeKey(caseData)
  const outcome = OUTCOMES[key]
  const result = caseData.result

  function closeAlert() {
    setShowAlert(false)
    // Clear the "just saved" flag so a page refresh does not show the alert again.
    navigate(location.pathname, { replace: true, state: null })
  }

  function handleDelete() {
    if (!window.confirm(`Delete case ${caseData.id}? This cannot be undone.`)) return
    try {
      deleteCase(caseData.id)
    } catch {
      setDeleteError('Could not delete the case. Your browser may be blocking storage.')
      return
    }
    navigate('/cases')
  }

  function handleEdit() {
    navigate('/new', { state: { editId: caseData.id } })
  }

  return (
    <>
      {showAlert && <UrgentAlert triggers={result.triggers} onClose={closeAlert} />}
      {key === 'refer' && <ReferralNote caseData={caseData} result={result} />}

      <div className="mx-auto max-w-2xl space-y-6 print:hidden">
        <div>
          <p className="text-sm text-slate-500">
            {formatDate(caseData.createdAt)}
            {caseData.updatedAt && ` · edited ${formatDate(caseData.updatedAt)}`}
            {caseData.source === 'ai' ? ` · checklist filled by AI (${caseData.aiModel}), checked by CHW` : ' · checklist filled by CHW'}
          </p>
          <h1 className="text-2xl font-bold">Case {caseData.id}</h1>
        </div>

        <section className={`rounded-lg border-2 p-4 ${outcome.panel}`} aria-labelledby="result-title">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Result from the WHO iCCM rules</p>
          <h2 id="result-title" className="mt-1 text-2xl font-bold">
            {outcome.label}
          </h2>

          {key === 'pending' && (
            <p className="mt-2 text-sm">This case has no saved result (it was saved before the rule engine existed, or the stored data was damaged). Edit and save it to classify it.</p>
          )}

          {key === 'refer' && (
            <>
              <p className="mt-2 font-medium">Go to the nearest health facility now. Triggered by:</p>
              <ul className="mt-1 list-disc pl-6">
                {result.triggers.map((t) => (
                  <li key={t.id}>
                    {t.label}
                    <Page page={t.page} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {key === 'incomplete' && (
            <>
              <p className="mt-2">
                No danger sign found so far, but KidCheck will not decide until these are checked. A question not asked is
                never treated as "No".
              </p>
              <ul className="mt-2 list-disc pl-6">
                {result.unknown.map((u) => (
                  <li key={u.label}>{u.label}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleEdit}
                className="mt-4 rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800"
              >
                Answer the missing questions
              </button>
            </>
          )}

          {key === 'treat' && (
            <>
              <p className="mt-2">No danger sign. The child is sick and can be treated at home:</p>
              <ul className="mt-2 space-y-2">
                {result.findings.map((finding) => (
                  <li key={finding.text} className="rounded-md bg-white/70 p-2">
                    <p className="font-medium">{finding.text}</p>
                    <p className="text-sm">
                      {finding.action}
                      <Page page={finding.page} />
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {result?.actions.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold">{key === 'refer' ? 'Before the child leaves' : 'What to do'}</h3>
              <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                {result.actions.map((action) => (
                  <li key={action.text}>
                    {action.text}
                    <Page page={action.page} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {key === 'refer' && (
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-4 rounded-lg bg-red-700 px-5 py-2.5 font-medium text-white hover:bg-red-800"
            >
              Print referral note
            </button>
          )}

          {key === 'refer' && result.unknown.length > 0 && (
            <p className="mt-3 text-sm text-slate-700">Not checked: {result.unknown.map((u) => u.label).join(' · ')}</p>
          )}
        </section>

        {caseData.rulesVersion && caseData.rulesVersion !== RULES_VERSION && key !== 'pending' && (
          <p className="rounded-md border border-slate-300 bg-white p-3 text-sm">
            This result came from an older version of the rules ({caseData.rulesVersion}). Edit and save the case to
            check it with the current rules.
          </p>
        )}

        <p className="text-xs text-slate-500">
          Rules from {RULES_SOURCE}. Treatment doses are not shown: use your chart booklet and training. This is a
          prototype and not clinically validated.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-semibold">{section.title}</h2>
            <dl className="mt-2 divide-y divide-slate-100 text-sm">
              {section.fields
                .filter((field) => isVisible(field, caseData.fields))
                .map((field) => {
                  const value = caseData.fields[field.key]
                  return (
                    <div key={field.key} className="flex justify-between gap-4 py-2">
                      <dt className="text-slate-600">{field.label}</dt>
                      <dd className={`text-right font-medium ${value === null ? 'text-slate-500' : ''}`}>
                        {formatValue(field, value)}
                      </dd>
                    </div>
                  )
                })}
            </dl>
          </section>
        ))}

        {caseData.intakeText && (
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-semibold">Original description</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm">{caseData.intakeText}</p>
          </section>
        )}

        {deleteError && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {deleteError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link to="/cases" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-100">
            Back to case log
          </Link>
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-100"
          >
            Edit answers
          </button>
          <Link to="/new" className="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800">
            New case
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-lg px-4 py-3 font-medium text-red-700 hover:bg-red-50"
          >
            Delete case
          </button>
        </div>
      </div>
    </>
  )
}
