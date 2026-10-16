// A small message that appears at the bottom of the screen (used for "your complaint was updated").
// The outer box is ALWAYS on the page, so screen readers announce text that appears inside it.
// It never replaces the Updates list: the toast goes away, the list stays until it is marked as read.
export default function Toast({ message, onClose }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden"
    >
      {message && (
        <div className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-md border-2 border-ink bg-slip-amber p-3 shadow-[3px_3px_0_0_var(--color-ink)]">
          <p className="flex-1 text-sm font-semibold">{message}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss this update"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 border-ink text-lg font-bold leading-none hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
