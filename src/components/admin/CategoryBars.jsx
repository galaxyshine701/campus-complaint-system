import EmptyState from '../shared/EmptyState.jsx'

// "Chart" made of plain Tailwind boxes: one bar per category, width = share of all complaints.
// The count and percentage are also written as text, so the numbers never depend on the bar alone.
export default function CategoryBars({ categories }) {
  if (categories.length === 0) {
    return <EmptyState title="No data yet" message="The chart appears when complaints are filed." />
  }

  return (
    <ul className="space-y-2">
      {categories.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-2 text-sm sm:grid-cols-[10rem_1fr_5rem]"
        >
          <span className="leading-tight">
            <span aria-hidden="true">{item.icon} </span>
            {item.label}
          </span>
          <div
            role="progressbar"
            aria-label={item.label + ' share of all complaints'}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={item.percent}
            className="h-4 overflow-hidden rounded-sm border-2 border-ink bg-paper-deep"
          >
            <div className="h-full bg-ink" style={{ width: item.share + '%' }} />
          </div>
          <span className="text-right font-mono text-xs">
            {item.count} · {item.percent}%
          </span>
        </li>
      ))}
    </ul>
  )
}
