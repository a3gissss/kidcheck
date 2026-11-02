import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { OUTCOMES, outcomeKey } from '../lib/outcomes.js'
import { loadCases, clearCases, STORAGE_KEY } from '../lib/storage.js'
import { formatDate } from '../lib/dates.js'

const SEX_LABEL = { female: 'Girl', male: 'Boy' }

export default function CaseLog() {
  const [cases, setCases] = useState(loadCases)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  // Stay current when cases change in another tab.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === null || e.key === STORAGE_KEY) setCases(loadCases())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const filters = [
    ['all', 'All', cases.length],
    ...Object.entries(OUTCOMES)
      .map(([key, o]) => [key, o.label, cases.filter((c) => outcomeKey(c) === key).length])
      .filter(([key, , count]) => count > 0 || key === filter),
  ]
  const shown = filter === 'all' ? cases : cases.filter((c) => outcomeKey(c) === filter)

  function handleClear() {
    if (!window.confirm(`Delete all ${cases.length} cases from this device? This cannot be undone.`)) return
    try {
      clearCases()
      setCases([])
      setError('')
    } catch {
      setError('Could not delete the cases. Your browser may be blocking storage.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Case log</h1>
        <Link to="/new" className="rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800">
          New case
        </Link>
      </div>
      <p className="text-sm text-slate-600">Cases are saved only in this browser on this device.</p>

      {cases.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-medium">No cases yet</p>
          <p className="mt-1 text-sm text-slate-600">Cases you save will appear here.</p>
          <Link to="/new" className="mt-4 inline-block text-teal-700 underline">
            Start a new case
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by outcome">
            {filters.map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  filter === key ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white hover:bg-slate-100'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
              No cases match this filter.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
              {shown.map((c) => {
                const outcome = OUTCOMES[outcomeKey(c)]
                const who = [c.fields.ageMonths !== null && `${c.fields.ageMonths} months`, SEX_LABEL[c.fields.sex]]
                  .filter(Boolean)
                  .join(', ')
                return (
                  <li key={c.id}>
                    <Link to={`/cases/${c.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-slate-50">
                      <div>
                        <p className="font-medium">{c.id}</p>
                        <p className="text-sm text-slate-600">
                          {formatDate(c.createdAt)}
                          {who && ` · ${who}`}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${outcome.badge}`}>{outcome.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {error && (
            <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <button type="button" onClick={handleClear} className="text-sm font-medium text-red-700 hover:underline">
            Delete all cases
          </button>
        </>
      )}
    </div>
  )
}
