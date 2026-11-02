// One editable case field: a number box, or a row of choices with "Not asked".

const NOT_ASKED = [null, 'Not asked']

function AiBadge() {
  return (
    <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-xs font-semibold text-violet-800">
      AI<span className="sr-only"> filled this answer, check it</span>
    </span>
  )
}

export default function CaseField({ field, value, error, warning, aiFilled, onChange }) {
  const id = `field-${field.key}`

  if (field.type === 'number') {
    return (
      <div className="py-3">
        <label htmlFor={id} className="block text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-700"> *</span>}
          {aiFilled && <AiBadge />}
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={field.min}
            max={field.max}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : warning ? `${id}-warning` : undefined}
            className={`w-28 rounded-md border px-3 py-2 ${error ? 'border-red-600' : 'border-slate-300'}`}
          />
          <span className="text-sm text-slate-600">{field.unit}</span>
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
            {error}
          </p>
        )}
        {!error && warning && (
          <p id={`${id}-warning`} className="mt-1 text-sm text-amber-800">
            {warning}
          </p>
        )}
      </div>
    )
  }

  const options = [...field.options, NOT_ASKED]
  return (
    <fieldset className="py-3">
      <legend className="text-sm font-medium">
        {field.label}
        {aiFilled && <AiBadge />}
      </legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map(([optionValue, optionLabel]) => {
          const checked = value === optionValue
          return (
            <label
              key={optionLabel}
              className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-teal-700 ${
                checked
                  ? optionValue === null
                    ? 'border-slate-500 bg-slate-200'
                    : 'border-teal-700 bg-teal-700 text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-100'
              }`}
            >
              <input
                type="radio"
                name={id}
                className="sr-only"
                checked={checked}
                onChange={() => onChange(optionValue)}
              />
              {optionLabel}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
