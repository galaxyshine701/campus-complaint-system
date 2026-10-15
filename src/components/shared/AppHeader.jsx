import { useApp } from '../../context/AppContext.jsx'

// Top bar used by both the student and admin screens. Hidden when printing a report.
export default function AppHeader({ subtitle, wide = false }) {
  const { session, logout } = useApp()

  return (
    <header className="border-b-2 border-ink print:hidden">
      <div
        className={
          'mx-auto flex items-center justify-between gap-3 px-4 py-3 ' +
          (wide ? 'max-w-5xl' : 'max-w-3xl')
        }
      >
        <div>
          <h1 className="font-display text-2xl font-extrabold leading-none">Repair Slip</h1>
          <p className="mt-1 font-mono text-xs">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline">{session?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border-2 border-ink px-3 py-1.5 font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
