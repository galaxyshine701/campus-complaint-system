import { getCategory } from '../../config/categories.js'
import { getBlock, URGENCIES } from '../../config/campus.js'
import { formatDateTime } from '../../lib/format.js'
import { formatAge, heatLevel } from '../../lib/insights.js'

// The three insights, built from the same complaints as the numbers above.
// Everything is written as text; the amber fill on the room grid only adds to the number in each cell,
// so it still works for colour-blind readers and on a black-and-white printout.

const cardClass = 'break-inside-avoid rounded-md border-2 border-ink bg-white/40 p-4'
const cardTitleClass = 'font-display text-lg font-extrabold'

// Fill by how many open complaints a room has: 0, 1, 2, 3 or more. Ink text sits on every fill.
const HEAT = {
  0: 'border-dashed bg-transparent',
  1: 'border-solid bg-slip-amber/25',
  2: 'border-solid bg-slip-amber/60',
  3: 'border-solid bg-slip-amber',
}
const HEAT_LEGEND = [
  { level: 0, label: '0' },
  { level: 1, label: '1' },
  { level: 2, label: '2' },
  { level: 3, label: '3 or more' },
]

function Cell({ room, open }) {
  return (
    <li className={'keep-print-color rounded-md border-2 border-ink px-2 py-1.5 ' + HEAT[heatLevel(open)]}>
      <span className="block text-sm font-semibold leading-tight">{room}</span>
      <span className="font-mono text-xs">{open} open</span>
    </li>
  )
}

export default function InsightsPanel({ recurring, slowest, hotspots, pendingCount }) {
  const urgency = slowest ? URGENCIES.find((u) => u.id === slowest.complaint.urgency) : null
  const slowCategory = slowest ? getCategory(slowest.complaint.category) : null

  return (
    <section aria-labelledby="insights-heading" className="mt-8">
      <h2 id="insights-heading" className="font-display text-xl font-extrabold">
        Insights
      </h2>
      <p className="mt-1 text-sm">What the numbers above hide: repeat problems, long waits and problem rooms.</p>

      <div className="mt-3 grid items-start gap-4 lg:grid-cols-2">
        {/* 1. Recurring */}
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Same problem, again</h3>
          <p className="mt-1 text-sm">
            Same room, same kind of problem, 3 or more times. A permanent fix may cost less than another repair.
          </p>
          {recurring.length === 0 ? (
            <p className="mt-3 text-sm font-semibold">No room has the same problem 3 or more times.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recurring.map((group) => {
                const category = getCategory(group.category)
                const block = getBlock(group.block)
                return (
                  <li key={group.key} className="text-sm">
                    <span className="block font-semibold">
                      <span aria-hidden="true">{category?.icon} </span>
                      {category?.label || group.category} · {block?.name || group.block} · {group.room}
                    </span>
                    <span className="block">
                      {group.count} complaints ({group.open} still open): {group.ids.join(', ')}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* 2. Waiting longest */}
        <div className={cardClass}>
          <h3 className={cardTitleClass}>Waiting the longest</h3>
          <p className="mt-1 text-sm">The Pending complaint nobody has picked up for the longest time.</p>
          {!slowest ? (
            <p className="mt-3 text-sm font-semibold">Nothing is waiting. No complaint is Pending.</p>
          ) : (
            <div className="mt-3 text-sm">
              <p className="font-semibold">
                <span className="font-mono">{slowest.complaint.id}</span> · {slowest.complaint.title}
              </p>
              <p className="mt-1">
                <span aria-hidden="true">{slowCategory?.icon} </span>
                {slowCategory?.label || slowest.complaint.category} ·{' '}
                {getBlock(slowest.complaint.block)?.name || slowest.complaint.block} · {slowest.complaint.room}
              </p>
              <p className="mt-1">
                Waiting for <span className="font-semibold">{formatAge(slowest.ageMs)}</span> (since{' '}
                {formatDateTime(slowest.since)}).
                {urgency ? ' Urgency: ' + urgency.label + '.' : ''}
              </p>
              <p className="mt-1">
                {pendingCount === 1 ? 'It is the only Pending complaint.' : pendingCount + ' complaints are Pending in total.'}
              </p>
            </div>
          )}
        </div>

        {/* 3. Hotspots */}
        <div className={cardClass + ' lg:col-span-2'}>
          <h3 className={cardTitleClass}>Where it hurts: open complaints by room</h3>
          <p className="mt-1 text-sm">Open means Pending or In Progress. The number in each box is the count.</p>

          <ul aria-label="Room shading key" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {HEAT_LEGEND.map((item) => (
              <li key={item.level} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={'keep-print-color inline-block h-4 w-4 rounded-sm border-2 border-ink ' + HEAT[item.level]}
                />
                {item.label} open
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm font-semibold">
            {hotspots.totalOpen === 0
              ? 'No open complaints. Every room is clear.'
              : 'Most open: ' + hotspots.hottest.join(' and ') + ' (' + hotspots.max + ' open).'}
          </p>

          <div className="mt-3 space-y-4">
            {hotspots.blocks.map((block) => (
              <div key={block.id}>
                <h4 className="text-sm font-semibold">{block.name}</h4>
                <ul className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {block.rooms.map((r) => (
                    <Cell key={r.room} room={r.room} open={r.open} />
                  ))}
                </ul>
              </div>
            ))}

            {hotspots.other.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold">Other places</h4>
                <ul className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {hotspots.other.map((r) => (
                    <Cell key={r.room} room={r.room} open={r.open} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
