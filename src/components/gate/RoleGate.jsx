import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import AdminPasscode from './AdminPasscode.jsx'

// First screen. No sign-up: a student just types a name (or leaves it empty).
// Admin goes through a simple passcode screen.
export default function RoleGate() {
  const { loginStudent } = useApp()
  const [name, setName] = useState('')
  const [showAdmin, setShowAdmin] = useState(false)

  if (showAdmin) return <AdminPasscode onBack={() => setShowAdmin(false)} />

  function handleSubmit(event) {
    event.preventDefault()
    loginStudent(name)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <p className="font-mono text-sm">Campus Complaint Management</p>
      <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight">Repair Slip</h1>
      <p className="mt-2">Something broken on campus? Write it on a slip and watch it get fixed.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-md border-2 border-ink bg-white/40 p-4 shadow-[3px_3px_0_0_var(--color-ink)]"
      >
        <label htmlFor="student-name" className="block text-sm font-semibold">
          Your name (optional)
        </label>
        <input
          id="student-name"
          type="text"
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          placeholder="For example: Ali"
          className="mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-md border-2 border-ink bg-ink px-4 py-2.5 font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Continue as Student
        </button>
      </form>

      <button
        type="button"
        onClick={() => setShowAdmin(true)}
        className="mt-4 self-start text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        I am an admin
      </button>
    </main>
  )
}
