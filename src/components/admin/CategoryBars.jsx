import { GROUPS, getGroupBarClass } from '../../config/categories.js'
import EmptyState from '../shared/EmptyState.jsx'

// "Chart" made of plain Tailwind boxes: one bar per category, width = share of all complaints.
// Bar colour = the category's group (see the legend). The count and percentage are also written
// as text, so the numbers never depend on colour. Each bar has an ink edge so the amber one is clear too.
export default function CategoryBars({ categories }) {
  if (categories.length === 0) {
    return <EmptyState title="No data yet" message="The chart appears when complaints are filed." />
  }

  return (
    <div>
      <ul aria-label="Colour legend" className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {GROUPS.map((group) => (
          <li key={group.id} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={'keep-print-color inline-block h-3 w-3 border-2 border-ink ' + group.barClass}
            />
            {group.id}
          </li>
        ))}
      </ul>

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
              className="keep-print-color h-4 overflow-hidden rounded-sm border-2 border-ink bg-paper-deep"
            >
              <div
                className={'h-full border-r-2 border-ink ' + getGroupBarClass(item.group)}
                style={{ width: item.share + '%' }}
              />
            </div>
            <span className="text-right font-mono text-xs">
              {item.count} · {item.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
