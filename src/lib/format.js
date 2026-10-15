// Small display helpers.

// "2026-10-15T10:00:00.000Z" -> "15 Oct, 15:00" (in the viewer's own time zone).
export function formatDateTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
