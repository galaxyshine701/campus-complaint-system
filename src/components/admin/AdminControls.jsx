import { STATUSES } from '../../config/campus.js'
import { formatDateTime } from '../../lib/format.js'

// The admin's part of a slip: who reported it, and the status dropdown.
// Anonymous reporters are never named here (and the device id is never shown).
export default function AdminControls({ complaint, onStatusChange }) {
  const selectId = 'status-' + complaint.id
  const reporter = complaint.isAnonymous ? 'Anonymous' : complaint.reporterName || 'Unknown'

  return (
    <div className="mt-4 border-t-2 border-dashed border-ink pt-3">
      <p className="text-sm">
        Reported by <span className="font-semibold">{reporter}</span> on{' '}
        {formatDateTime(complaint.createdAt)}
      </p>

      <div className="print:hidden">
        <label htmlFor={selectId} className="mt-3 block text-sm font-semibold">
          Change status
        </label>
        <select
          id={selectId}
          value={complaint.status}
          onChange={(event) => onStatusChange(complaint.id, event.target.value)}
          className="mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
