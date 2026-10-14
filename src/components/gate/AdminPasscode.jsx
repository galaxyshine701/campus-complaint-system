import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'

// Demo-only passcode gate (see README: this is not real security).
export default function AdminPasscode({ onBack }) {
  const { loginAdmin } = useApp()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const ok = loginAdmin(passcode)
    if (!ok) {
      setError('Wrong passcode. Please try again.')
      setPasscode('')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold leading-tight">Admin desk</h1>
      <p className="mt-2 text-sm">Enter the admin passcode to manage complaints.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-md border-2 border-ink bg-white/40 p-4 shadow-[3px_3px_0_0_var(--color-ink)]"
      >
        <label htmlFor="admin-passcode" className="block text-sm font-semibold">
          Passcode
        </label>
        <input
          id="admin-passcode"
          type="password"
          value={passcode}
          onChange={(event) => {
            setPasscode(event.target.value)
            setError('')
          }}
          aria-describedby={error ? 'admin-passcode-error' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className="mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        {error && (
          <p id="admin-passcode-error" role="alert" className="mt-2 text-sm font-semibold">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-md border-2 border-ink bg-ink px-4 py-2.5 font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Open admin desk
        </button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 self-start text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Back
      </button>
    </main>
  )
}
