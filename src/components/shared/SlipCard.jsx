import { getCategory, getIssueLabel } from '../../config/categories.js'
import { getBlock, URGENCIES } from '../../config/campus.js'
import StampBadge from './StampBadge.jsx'

// One complaint shown as a paper job-slip. The card stays straight (no tilt) so it never
// causes sideways scrolling on phones; only the stamp is tilted.
// `children` lets a screen add extra parts at the bottom (for example the progress timeline).

const URGENCY_DOT = {
  high: 'bg-stamp-red',
  medium: 'bg-slip-amber',
  low: 'bg-stamp-green',
}

export default function SlipCard({ complaint, children }) {
  const category = getCategory(complaint.category)
  const block = getBlock(complaint.block)
  const issue = getIssueLabel(complaint.category, complaint.issue)
  const urgency = URGENCIES.find((u) => u.id === complaint.urgency)
  const photos = Array.isArray(complaint.photos) ? complaint.photos : []

  return (
    <article className="rounded-md border-2 border-ink bg-white/40 p-4 shadow-[3px_3px_0_0_var(--color-ink)]">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-sm font-semibold">{complaint.id}</p>
        <StampBadge status={complaint.status} />
      </div>

      <h3 className="mt-2 font-display text-lg font-extrabold leading-snug">{complaint.title}</h3>

      <p className="mt-1 text-sm">
        <span aria-hidden="true">{category?.icon} </span>
        {category?.label}
        {issue ? ` · ${issue}` : ''}
      </p>

      <p className="mt-1 text-sm">
        {block?.name || complaint.block} · {complaint.room}
        {complaint.locationNote ? ` (${complaint.locationNote})` : ''}
      </p>

      {complaint.description && (
        <p className="mt-2 line-clamp-3 text-sm">{complaint.description}</p>
      )}

      {photos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {photos.map((src, index) => (
            <li key={index}>
              <img
                src={src}
                alt={'Photo ' + (index + 1) + ' of complaint ' + complaint.id}
                loading="lazy"
                className="h-16 w-16 rounded border-2 border-ink object-cover"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink px-2 py-0.5">
          <span
            className={'h-2.5 w-2.5 rounded-full ' + (URGENCY_DOT[complaint.urgency] || 'bg-ink')}
            aria-hidden="true"
          />
          {urgency?.label || complaint.urgency} urgency
        </span>
        {complaint.isAnonymous && (
          <span className="rounded-full border border-ink px-2 py-0.5">Anonymous</span>
        )}
        {complaint.assignedTo && (
          <span className="rounded-full border border-ink px-2 py-0.5">{complaint.assignedTo}</span>
        )}
      </div>

      {children}
    </article>
  )
}
