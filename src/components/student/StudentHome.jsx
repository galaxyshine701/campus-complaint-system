import { useApp } from '../../context/AppContext.jsx'
import AppHeader from '../shared/AppHeader.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import SlipCard from '../shared/SlipCard.jsx'

// PLACEHOLDER (Step 1). The real complaint form and My Complaints timeline arrive in Step 2.
export default function StudentHome() {
  const { complaints, deviceId } = useApp()
  // A student only sees complaints from THIS browser, even the anonymous ones.
  const mine = complaints.filter((c) => c.reporterId === deviceId)

  return (
    <>
      <AppHeader subtitle="Student desk" />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="rounded-md border-2 border-dashed border-ink p-4">
          <p className="font-display text-lg font-extrabold">Complaint form: coming in Step 2</p>
          <p className="mt-1 text-sm">The skeleton works. Next we build the real form with photo upload.</p>
        </div>

        <h2 className="mt-8 font-display text-xl font-extrabold">My complaints</h2>
        <div className="mt-3 space-y-4">
          {mine.length === 0 ? (
            <EmptyState
              title="No complaints yet"
              message="When you report something, your slip will show up here."
            />
          ) : (
            mine.map((c) => <SlipCard key={c.id} complaint={c} />)
          )}
        </div>
      </main>
    </>
  )
}
