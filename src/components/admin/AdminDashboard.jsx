import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { STATUSES } from '../../config/campus.js'
import { computeStats, filterComplaints, sortForAdmin } from '../../lib/stats.js'
import { downloadCsv } from '../../lib/report.js'
import AppHeader from '../shared/AppHeader.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import SlipCard from '../shared/SlipCard.jsx'
import StatusTimeline from '../student/StatusTimeline.jsx'
import StatsCards from './StatsCards.jsx'
import CategoryBars from './CategoryBars.jsx'
import AdminFilters from './AdminFilters.jsx'
import AdminControls from './AdminControls.jsx'

const NO_FILTERS = { status: '', category: '', urgency: '' }

const buttonClass =
  'rounded-md border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function AdminDashboard() {
  const { complaints, resetDemo, updateStatus, assignTechnician } = useApp()
  const [filters, setFilters] = useState(NO_FILTERS)
  const [message, setMessage] = useState('')

  const stats = computeStats(complaints)
  const visible = sortForAdmin(filterComplaints(complaints, filters))

  function handleStatusChange(id, status) {
    const result = updateStatus(id, status)
    if (!result.ok) {
      setMessage(
        result.quota
          ? 'Browser storage is full, so the change was not saved. Use "Reset demo" to free space.'
          : 'Could not save the change. Please try again.',
      )
      return
    }
    if (result.changed) {
      const label = STATUSES.find((s) => s.id === status)?.label || status
      setMessage(id + ' moved to ' + label + '.')
    }
  }

  function handleAssign(id, name) {
    const result = assignTechnician(id, name)
    if (!result.ok) {
      setMessage(
        result.quota
          ? 'Browser storage is full, so the change was not saved. Use "Reset demo" to free space.'
          : 'Could not save the change. Please try again.',
      )
      return
    }
    if (result.changed) {
      setMessage(name ? id + ' assigned to ' + name + '.' : id + ' is now unassigned.')
    }
  }

  function handleReset() {
    const sure = window.confirm('Reset all complaints back to the demo data?')
    if (sure) {
      resetDemo()
      setFilters(NO_FILTERS)
      setMessage('Demo data restored.')
    }
  }

  return (
    <>
      <AppHeader subtitle="Admin desk" wide />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Only visible on the printed report */}
        <div className="mb-4 hidden print:block">
          <h1 className="font-display text-2xl font-extrabold">Repair Slip: Complaint report</h1>
          <p className="font-mono text-sm">Printed {new Date().toLocaleString('en-GB')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="font-display text-xl font-extrabold">Overview</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadCsv(visible)}
              disabled={visible.length === 0}
              className="rounded-md border-2 border-ink bg-ink px-3 py-1.5 text-sm font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              Download CSV ({visible.length})
            </button>
            <button type="button" onClick={() => window.print()} className={buttonClass}>
              Print report
            </button>
            <button type="button" onClick={handleReset} className={buttonClass}>
              Reset demo
            </button>
          </div>
        </div>

        <div className="mt-4">
          <StatsCards stats={stats} />
        </div>

        <p className="mt-3 text-sm">
          <span className="font-semibold">Repair rating: </span>
          {stats.rating.count > 0
            ? stats.rating.average.toFixed(1) +
              ' / 5 from ' +
              stats.rating.count +
              (stats.rating.count === 1 ? ' rating' : ' ratings')
            : 'No ratings yet. Students can rate a repair once it is Resolved.'}
        </p>

        <section aria-labelledby="by-category-heading" className="mt-6">
          <h2 id="by-category-heading" className="font-display text-xl font-extrabold">
            Complaints by category
          </h2>
          <div className="mt-3 rounded-md border-2 border-ink bg-white/40 p-4">
            <CategoryBars categories={stats.categories} />
          </div>
        </section>

        <section aria-labelledby="slips-heading" className="mt-8">
          <h2 id="slips-heading" className="font-display text-xl font-extrabold">
            All complaints
          </h2>
          <p className="mt-1 text-sm">Pending first, then most urgent, then oldest.</p>

          <div className="mt-3">
            <AdminFilters
              filters={filters}
              onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
              onClear={() => setFilters(NO_FILTERS)}
              shown={visible.length}
              total={complaints.length}
            />
          </div>

          {message && (
            <p
              role="status"
              className="mt-3 rounded-md border-2 border-ink bg-slip-amber px-3 py-2 text-sm font-semibold text-ink print:hidden"
            >
              {message}
            </p>
          )}

          <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
            {visible.length === 0 ? (
              <div className="lg:col-span-2">
                <EmptyState
                  title={complaints.length === 0 ? 'No complaints' : 'No complaints match these filters'}
                  message={
                    complaints.length === 0
                      ? 'Use Reset demo to load the sample slips.'
                      : 'Try clearing a filter.'
                  }
                />
              </div>
            ) : (
              visible.map((c) => (
                <SlipCard key={c.id} complaint={c}>
                  <StatusTimeline complaint={c} />
                  <AdminControls
                    complaint={c}
                    onStatusChange={handleStatusChange}
                    onAssign={handleAssign}
                  />
                </SlipCard>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  )
}
