// Shown instead of a blank page when a list has nothing in it.
export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-md border-2 border-dashed border-ink px-4 py-8 text-center">
      <p className="font-display text-lg font-extrabold">{title}</p>
      {message && <p className="mt-1 text-sm">{message}</p>}
    </div>
  )
}
