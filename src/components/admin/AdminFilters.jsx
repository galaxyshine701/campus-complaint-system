import { CATEGORIES } from '../../config/categories.js'
import { STATUSES, URGENCIES } from '../../config/campus.js'

const selectClass =
  'mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

// Filter the list by status, category and urgency. Hidden when printing.
export default function AdminFilters({ filters, onChange, onClear, shown, total }) {
  const active = Boolean(filters.status || filters.category || filters.urgency)

  return (
    <div className="print:hidden">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="filter-status" className="block text-sm font-semibold">
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-category" className="block text-sm font-semibold">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(event) => onChange({ category: event.target.value })}
            className={selectClass}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-urgency" className="block text-sm font-semibold">
            Urgency
          </label>
          <select
            id="filter-urgency"
            value={filters.urgency}
            onChange={(event) => onChange({ urgency: event.target.value })}
            className={selectClass}
          >
            <option value="">All urgency levels</option>
            {URGENCIES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-sm">
          Showing {shown} of {total}
        </p>
        {active && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
