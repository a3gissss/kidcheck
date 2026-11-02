// Possible results of a case. The rule engine (rules.js) sets case.outcome.
// Cases saved before Stage 3 have no outcome and show as "pending".

export const OUTCOMES = {
  refer: { label: 'Refer urgently', badge: 'bg-red-100 text-red-800', panel: 'border-red-300 bg-red-50' },
  treat: { label: 'Treat at home and advise', badge: 'bg-amber-100 text-amber-900', panel: 'border-amber-300 bg-amber-50' },
  home: { label: 'No illness sign found', badge: 'bg-emerald-100 text-emerald-800', panel: 'border-emerald-300 bg-emerald-50' },
  incomplete: { label: 'Needs more answers', badge: 'bg-sky-100 text-sky-900', panel: 'border-sky-300 bg-sky-50' },
  outOfScope: { label: 'Outside age range', badge: 'bg-slate-200 text-slate-800', panel: 'border-slate-300 bg-slate-50' },
  pending: { label: 'Not classified', badge: 'bg-slate-200 text-slate-700', panel: 'border-slate-300 bg-white' },
}

export function outcomeKey(c) {
  return OUTCOMES[c.outcome] ? c.outcome : 'pending'
}
