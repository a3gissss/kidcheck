import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SAMPLES } from '../lib/samples.js'
import { aiTextError, MAX_TEXT } from '../lib/privacy.js'

const BOOKLET_URL =
  'https://www.childhealthtaskforce.org/sites/default/files/2019-06/Caring%20for%20Sick%20Child%20in%20the%20Community%20CHW%20Chart%20Booklet%28WHO%2CUNICEF%2C2014%29.pdf'

function ArrowIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className={className}>
      <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const STEPS = [
  {
    title: 'You describe the child',
    text: 'In your own words, the way the carer told you. No names.',
  },
  {
    title: 'AI fills the checklist, you check it',
    text: 'Gemini turns the description into answers, each marked AI. You confirm or correct every one. Anything not mentioned stays "Not asked".',
  },
  {
    title: 'WHO rules decide',
    text: 'Fixed rules from the WHO/UNICEF chart booklet give the result and show the sign that triggered it, with the booklet page.',
  },
]

function HowItWorks() {
  return (
    <section aria-labelledby="how-title">
      <h2 id="how-title" className="text-lg font-semibold">
        How it works
      </h2>
      <ol className="mt-4 space-y-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex gap-4">
            {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute left-4 top-9 -bottom-5 w-px bg-teal-200" />}
            <span
              aria-hidden="true"
              className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white"
            >
              {i + 1}
            </span>
            <div className="pt-1">
              <p className="font-semibold">{step.title}</p>
              <p className="mt-1 max-w-[60ch] text-slate-600">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function StartPanel() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function start(mode) {
    if (mode === 'ai') {
      const problem = aiTextError(text)
      if (problem) {
        setError(problem)
        document.getElementById('landing-intake')?.focus()
        return
      }
    }
    navigate('/new', { state: { draft: { text: text.trim(), start: mode } } })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        start('ai')
      }}
      aria-labelledby="start-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_-12px_rgb(15_23_42_/_0.18)] sm:p-6"
    >
      <h2 id="start-title" className="text-xl font-bold">
        Start a case
      </h2>
      <label htmlFor="landing-intake" className="mt-4 block font-medium">
        What is wrong with the child?
      </label>
      <textarea
        id="landing-intake"
        rows={5}
        maxLength={MAX_TEXT}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError('')
        }}
        placeholder="e.g. Boy, 18 months, coughing for 3 days, breathing fast..."
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={`landing-intake-help${error ? ' landing-intake-error' : ''}`}
        className={`mt-2 w-full rounded-md border p-3 placeholder:text-slate-500 ${error ? 'border-red-600' : 'border-slate-300'}`}
      />
      {error && (
        <p id="landing-intake-error" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
      <p id="landing-intake-help" className="mt-1 text-sm text-slate-600">
        Do not type names or phone numbers. With AI, the description is sent to Google Gemini.
      </p>

      <p className="mt-4 text-sm font-medium">Or try a synthetic demo case</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SAMPLES.map((sample) => (
          <button
            key={sample.title}
            type="button"
            onClick={() => {
              setText(sample.text)
              setError('')
            }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            {sample.title}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
        <button type="submit" className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800">
          Fill checklist with AI
        </button>
        <button
          type="button"
          onClick={() => start('manual')}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-100"
        >
          Fill checklist myself
        </button>
      </div>
    </form>
  )
}

function WorkedExample() {
  return (
    <section aria-labelledby="example-title">
      <h2 id="example-title" className="text-2xl font-bold">
        One case, start to finish
      </h2>
      <p className="mt-2 text-slate-600">A synthetic example. This is what the app shows at each step.</p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_auto_1.1fr_auto_1.1fr]">
        <figure>
          <figcaption className="text-sm font-semibold text-slate-600">The CHW writes</figcaption>
          <blockquote className="mt-3 text-xl leading-relaxed text-slate-900">
            “Boy, 18 months. Coughing for 3 days and breathing fast. Mother says he vomits everything he takes.”
          </blockquote>
        </figure>

        <ArrowIcon className="mx-auto size-6 rotate-90 text-teal-700 lg:mt-10 lg:rotate-0" />

        <div>
          <p className="text-sm font-semibold text-slate-600">AI fills, the CHW checks and adds</p>
          <dl className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-4 text-sm">
            {[
              ['Age', '18 months', true],
              ['Vomits everything', 'Yes', true],
              ['Cough', 'Yes, 3 days', true],
              ['Breaths in one minute', '52', false],
              ['Chest indrawing', 'No', false],
            ].map(([label, value, ai]) => (
              <div key={label} className="flex items-center justify-between gap-3 py-2">
                <dt className="text-slate-600">
                  {label}
                  {ai && <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-xs font-semibold text-violet-800">AI</span>}
                </dt>
                <dd className="text-right font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-slate-600">The CHW counted the breaths and checked for chest indrawing.</p>
        </div>

        <ArrowIcon className="mx-auto size-6 rotate-90 text-teal-700 lg:mt-10 lg:rotate-0" />

        <div>
          <p className="text-sm font-semibold text-slate-600">The rules decide</p>
          <div className="mt-3 rounded-lg border-2 border-red-300 bg-red-50 p-4">
            <p className="text-2xl font-bold text-red-900">Refer urgently</p>
            <p className="mt-2 text-sm">
              Triggered by: <span className="font-semibold">Vomits everything</span>{' '}
              <span className="whitespace-nowrap text-xs text-slate-600">(chart p. 6)</span>
            </p>
            <p className="mt-2 text-sm">Steps before the child leaves, and a printable referral note.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const LIMITS = [
  ['The AI never decides.', 'It only fills answers, and the CHW checks each one before the rules run.'],
  ['"Not asked" is never "No".', 'If a danger sign was not checked, KidCheck asks for it instead of deciding.'],
  ['No doses.', 'It names the treatment from the chart and leaves the dose to the booklet and training.'],
  ['It works without AI.', 'If the AI is down, the CHW fills the same checklist by hand and the rules work the same.'],
  ['Cases stay on the device.', 'Only the description is sent to the AI, and only when the CHW chooses AI.'],
  ['It is a prototype.', 'Not a medical device and not clinically validated. Demo cases are synthetic.'],
]

export default function Landing() {
  return (
    <div className="space-y-20 sm:space-y-24">
      {/* Phones: headline, start panel, then the problem. Desktop: text left, panel right. */}
      <section className="grid items-start gap-x-12 gap-y-8 lg:grid-cols-12 lg:pt-6">
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl">
            Plain words in, WHO‑backed decisions out.
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate-700">
            KidCheck helps community health workers check every danger sign in a sick child aged 2 months to 5 years and
            decide: refer urgently, treat at home, or no illness sign found.
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1">
          <StartPanel />
        </div>

        <section aria-labelledby="problem-title" className="lg:col-span-7 lg:row-start-2">
          <h2 id="problem-title" className="text-lg font-semibold">
            The problem
          </h2>
          <p className="mt-2 max-w-[60ch] text-slate-700">
            In rural communities, the first person to see a sick child is often a community health worker with a few weeks
            of training and a paper chart. Under pressure, danger signs like chest indrawing or not being able to drink get
            missed, and the child reaches a clinic too late.
          </p>
        </section>

        <div className="lg:col-span-7 lg:row-start-3">
          <HowItWorks />
        </div>
      </section>

      <WorkedExample />

      <section aria-labelledby="limits-title" className="border-t border-slate-200 pt-12">
        <h2 id="limits-title" className="text-2xl font-bold">
          What KidCheck will not do
        </h2>
        <dl className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2">
          {LIMITS.map(([title, text]) => (
            <div key={title}>
              <dt className="font-semibold">{title}</dt>
              <dd className="mt-1 max-w-[60ch] text-slate-600">{text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-[70ch] text-sm text-slate-600">
          Rules come from WHO/UNICEF,{' '}
          <a href={BOOKLET_URL} className="text-teal-800 underline underline-offset-2 hover:text-teal-900">
            Caring for the sick child in the community: CHW chart booklet (2014)
          </a>
          . KidCheck covers cough and fast breathing, diarrhoea, fever in a malaria area, malnutrition signs and the general
          danger signs. It does not cover the booklet's HIV and TB questions or babies under 2 months.
        </p>
      </section>

      <section className="flex flex-col items-start gap-4 rounded-xl border border-slate-200 bg-white px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xl font-semibold">Try it with a synthetic case.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/new" className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white hover:bg-teal-800">
            Start a new case
          </Link>
          <Link to="/cases" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-medium hover:bg-slate-100">
            Open the case log
          </Link>
        </div>
      </section>
    </div>
  )
}
