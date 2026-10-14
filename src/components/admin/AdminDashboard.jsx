import { useApp } from '../../context/AppContext.jsx'
import AppHeader from '../shared/AppHeader.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import SlipCard from '../shared/SlipCard.jsx'

// PLACEHOLDER (Step 1). It only lists the demo slips and offers "Reset demo".
// Filters, status changes, stats and reports arrive in Step 3.
export default function AdminDashboard() {
  const { complaints, resetDemo } = useApp()

  function handleReset() {
    const sure = window.confirm('Reset all complaints back to the demo data?')
    if (sure) resetDemo()
  }

  return (
    <>
      <AppHeader subtitle="Admin desk" />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold">All complaints ({complaints.length})</h2>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Reset demo
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {complaints.length === 0 ? (
            <EmptyState title="No complaints" message="Use Reset demo to load the sample slips." />
          ) : (
            complaints.map((c) => <SlipCard key={c.id} complaint={c} />)
          )}
        </div>
      </main>
    </>
  )
}
