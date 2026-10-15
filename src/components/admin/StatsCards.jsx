const CARDS = [
  { key: 'total', label: 'Total' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
]

// Four big numbers across the top of the admin desk.
export default function StatsCards({ stats }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-md border-2 border-ink bg-white/40 p-3 shadow-[3px_3px_0_0_var(--color-ink)]"
        >
          <dt className="text-sm font-semibold">{card.label}</dt>
          <dd className="mt-1 font-display text-3xl font-extrabold">{stats[card.key]}</dd>
        </div>
      ))}
    </dl>
  )
}
