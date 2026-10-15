import { STATUSES, SUGGESTED_TECHNICIAN, TECHNICIANS } from '../../config/campus.js'
import { formatDateTime } from '../../lib/format.js'

const selectClass =
  'mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

// The admin's part of a slip: who reported it, the status dropdown and the technician dropdown.
// Anonymous reporters are never named here (and the device id is never shown).
export default function AdminControls({ complaint, onStatusChange, onAssign }) {
  const statusId = 'status-' + complaint.id
  const techId = 'tech-' + complaint.id
  const reporter = complaint.isAnonymous ? 'Anonymous' : complaint.reporterName || 'Unknown'

  const suggested = SUGGESTED_TECHNICIAN[complaint.category]
  const current = complaint.assignedTo || ''
  // If an old slip has a name that is not in the list any more, keep it visible instead of hiding it.
  const options = current && !TECHNICIANS.includes(current) ? [...TECHNICIANS, current] : TECHNICIANS

  return (
    <div className="mt-4 border-t-2 border-dashed border-ink pt-3">
      <p className="text-sm">
        Reported by <span className="font-semibold">{reporter}</span> on{' '}
        {formatDateTime(complaint.createdAt)}
      </p>

      {complaint.status === 'in_progress' && !complaint.assignedTo && (
        <p className="mt-2 text-sm font-semibold">
          <span aria-hidden="true">⚠ </span>
          No technician assigned yet.
        </p>
      )}

      <div className="print:hidden">
        <label htmlFor={statusId} className="mt-3 block text-sm font-semibold">
          Change status
        </label>
        <select
          id={statusId}
          value={complaint.status}
          onChange={(event) => onStatusChange(complaint.id, event.target.value)}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <label htmlFor={techId} className="mt-3 block text-sm font-semibold">
          Assign technician
        </label>
        <select
          id={techId}
          value={current}
          onChange={(event) => onAssign(complaint.id, event.target.value)}
          className={selectClass}
        >
          <option value="">Unassigned</option>
          {options.map((name) => (
            <option key={name} value={name}>
              {name}
              {name === suggested ? ' (suggested)' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
