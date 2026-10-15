import { useApp } from '../../context/AppContext.jsx'
import AppHeader from '../shared/AppHeader.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import SlipCard from '../shared/SlipCard.jsx'
import ComplaintForm from './ComplaintForm.jsx'
import StatusTimeline from './StatusTimeline.jsx'

export default function StudentHome() {
  const { complaints, deviceId } = useApp()
  // A student only sees complaints from THIS browser (even the anonymous ones), newest first.
  const mine = complaints
    .filter((c) => c.reporterId === deviceId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

  return (
    <>
      <AppHeader subtitle="Student desk" />
      <main className="mx-auto max-w-3xl px-4 py-6">
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
              </SlipCard>
            ))
          )}
        </div>
      </main>
    </>
  )
}
