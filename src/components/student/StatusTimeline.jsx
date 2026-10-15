import { STATUSES } from '../../config/campus.js'
import { formatDateTime } from '../../lib/format.js'

// Pending -> In Progress -> Resolved, with the date each step was reached.
// Reached steps are filled with a tick, so progress does not depend on colour alone.
export default function StatusTimeline({ complaint }) {
  const currentIndex = STATUSES.findIndex((s) => s.id === complaint.status)
  const history = Array.isArray(complaint.history) ? complaint.history : []
  const last = STATUSES.length - 1

  return (
    <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Complaint progress">
      {STATUSES.map((step, index) => {
        const reached = index <= currentIndex
        const entry = [...history].reverse().find((h) => h.status === step.id)
        const leftLine = index === 0 ? 'bg-transparent' : reached ? 'bg-ink' : 'bg-ink/30'
        const rightLine = index === last ? 'bg-transparent' : index < currentIndex ? 'bg-ink' : 'bg-ink/30'

        return (
          <li
            key={step.id}
            className="text-center"
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <div className="flex items-center">
              <span className={'h-0.5 flex-1 ' + leftLine} />
              <span
                className={
                  'mx-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink text-xs font-bold ' +
                  (reached ? 'bg-ink text-paper' : 'bg-paper')
                }
              >
                {reached ? '✓' : index + 1}
              </span>
              <span className={'h-0.5 flex-1 ' + rightLine} />
            </div>
            <p className="mt-1 text-xs font-semibold">{step.label}</p>
            <p className="font-mono text-xs">{reached && entry ? formatDateTime(entry.at) : '-'}</p>
          </li>
        )
      })}
    </ol>
  )
}
