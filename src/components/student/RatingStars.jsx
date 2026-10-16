import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { isRated } from '../../lib/rating.js'
import StarsDisplay from '../shared/StarsDisplay.jsx'

const REASONS = {
  'already-rated': 'This repair was already rated.',
  quota: 'Browser storage is full, so the rating was not saved.',
}

// Under a slip on the student screen:
// - rated already: shows "Your rating" (it can never be changed),
// - Resolved and mine, not rated yet: shows 5 stars to pick from and a "Send rating" button,
// - anything else: shows nothing.
// Picking a star only selects it. The rating is saved when the student presses "Send rating",
// so a slip of the thumb on a phone does not lock in a wrong rating.
export default function RatingStars({ complaint }) {
  const { deviceId, rateComplaint } = useApp()
  const [picked, setPicked] = useState(0)
  const [error, setError] = useState('')

  if (isRated(complaint)) {
    return (
      <p className="mt-4 border-t-2 border-dashed border-ink pt-3 text-sm">
        <span className="font-semibold">Your rating: </span>
        <StarsDisplay value={complaint.rating} />
      </p>
    )
  }

  if (complaint.status !== 'resolved' || complaint.reporterId !== deviceId) return null

  function send() {
    const result = rateComplaint(complaint.id, picked)
    if (!result.ok) {
      setError(REASONS[result.reason] || 'Could not save your rating. Please try again.')
    }
  }

  return (
    <fieldset className="mt-4 border-t-2 border-dashed border-ink pt-3">
      <legend className="pr-2 text-sm font-semibold">How was the repair? You can rate it once.</legend>

      <div className="mt-1 flex items-center">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="flex h-11 w-11 cursor-pointer items-center justify-center text-3xl has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
          >
            <input
              type="radio"
              name={'rating-' + complaint.id}
              value={n}
              checked={picked === n}
              onChange={() => {
                setPicked(n)
                setError('')
              }}
              className="sr-only"
            />
            <span aria-hidden="true">{n <= picked ? '★' : '☆'}</span>
            <span className="sr-only">{n === 1 ? '1 star' : n + ' stars'}</span>
          </label>
        ))}
        <span className="ml-2 font-mono text-xs">{picked > 0 ? picked + '/5' : 'Choose 1 to 5'}</span>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={send}
        disabled={picked === 0}
        className="mt-2 rounded-md border-2 border-ink bg-ink px-3 py-1.5 text-sm font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-70"
      >
        Send rating
      </button>
    </fieldset>
  )
}
