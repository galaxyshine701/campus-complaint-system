import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { forReporter } from '../../lib/notifications.js'
import AppHeader from '../shared/AppHeader.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import SlipCard from '../shared/SlipCard.jsx'
import Toast from '../shared/Toast.jsx'
import ComplaintForm from './ComplaintForm.jsx'
import RatingStars from './RatingStars.jsx'
import StatusTimeline from './StatusTimeline.jsx'
import UpdatesPanel from './UpdatesPanel.jsx'

// How long the toast stays. The Updates list below keeps the message until it is marked as read.
const TOAST_MS = 8000

export default function StudentHome() {
  const { complaints, deviceId, notifications, markNotificationsRead } = useApp()
  // A student only sees complaints from THIS browser (even the anonymous ones), newest first.
  const mine = complaints
    .filter((c) => c.reporterId === deviceId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

  // Only my own notifications (matched by device id), newest first.
  const updates = forReporter(notifications, deviceId)
  const unread = updates.filter((n) => !n.read)
  const newest = unread[0] || null

  // The toast shows the newest unread update once, then hides itself (or when the student closes it).
  const [dismissedId, setDismissedId] = useState(null)
  const toastId = newest && newest.id !== dismissedId ? newest.id : null

  useEffect(() => {
    if (!toastId) return undefined
    const timer = setTimeout(() => setDismissedId(toastId), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toastId])

  const toastMessage = toastId
    ? newest.message + (unread.length > 1 ? ' (+' + (unread.length - 1) + ' more in Updates)' : '')
    : ''

  return (
    <>
      <AppHeader subtitle="Student desk" />
      {/* Extra space at the bottom: the toast floats there, and the last slip must be able to scroll above it. */}
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6">
        <UpdatesPanel
          updates={updates}
          unreadCount={unread.length}
          onMarkRead={markNotificationsRead}
        />

        <ComplaintForm />

        <h2 className="mt-10 font-display text-xl font-extrabold">My complaints ({mine.length})</h2>
        <div className="mt-3 space-y-4">
          {mine.length === 0 ? (
            <EmptyState
              title="No complaints yet"
              message="When you report something, your slip will show up here."
            />
          ) : (
            mine.map((c) => (
              <SlipCard key={c.id} complaint={c}>
                <StatusTimeline complaint={c} />
                <RatingStars complaint={c} />
              </SlipCard>
            ))
          )}
        </div>
      </main>

      <Toast message={toastMessage} onClose={() => setDismissedId(toastId)} />
    </>
  )
}
