import { STATUSES } from '../../config/campus.js'

// The rubber stamp that shows a complaint's status. This is the app's one meaningful animation:
// giving the component a new `key` (the status) replays the "thump" when the status changes.
// Colours: red and green are only used at 20px+ bold. Amber is a fill with ink text on top.

const LOOK = {
  pending: 'border-stamp-red text-stamp-red',
  in_progress: 'border-ink bg-slip-amber text-ink',
  resolved: 'border-stamp-green text-stamp-green',
}

export default function StampBadge({ status }) {
  const label = STATUSES.find((s) => s.id === status)?.label || status

  return (
    // The tilt lives on the outer span; the inner span animates (a transform on both would clash).
    <span className="inline-block -rotate-3">
      <span
        key={status}
        className={
          'animate-stamp inline-block rounded-sm border-[3px] px-2 py-0.5 font-mono text-xl font-extrabold uppercase tracking-wider ' +
          (LOOK[status] || LOOK.pending)
        }
      >
        {label}
      </span>
    </span>
  )
}
