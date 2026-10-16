import { formatDateTime } from '../../lib/format.js'

const SHOWN = 5

// "Updates" box at the top of the student screen: the latest status changes on MY complaints.
// New ones carry a NEW tag (text, not only colour). Nothing is shown when there are no updates yet.
export default function UpdatesPanel({ updates, unreadCount, onMarkRead }) {
  if (updates.length === 0) return null

  return (
    <section
      aria-labelledby="updates-heading"
      className="mb-8 rounded-md border-2 border-ink bg-white/40 p-4 shadow-[3px_3px_0_0_var(--color-ink)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="updates-heading" className="font-display text-xl font-extrabold">
          Updates{unreadCount > 0 ? ' (' + unreadCount + ' new)' : ''}
        </h2>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkRead}
            className="rounded-md border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Mark all as read
          </button>
        )}
      </div>

      <ul className="mt-3 space-y-2">
        {updates.slice(0, SHOWN).map((n) => (
          <li key={n.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            {!n.read && (
              <span className="rounded-sm bg-ink px-1.5 py-0.5 font-mono text-xs font-semibold text-paper">
                NEW
              </span>
            )}
            <span>{n.message}</span>
            <span className="font-mono text-xs">{formatDateTime(n.at)}</span>
          </li>
        ))}
      </ul>

      {updates.length > SHOWN && (
        <p className="mt-2 font-mono text-xs">
          Showing the latest {SHOWN} of {updates.length} updates.
        </p>
      )}
    </section>
  )
}
