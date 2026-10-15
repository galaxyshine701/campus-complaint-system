import { useRef, useState } from 'react'
import { compressImage, MAX_PHOTOS } from '../../lib/image.js'

// Choose up to MAX_PHOTOS pictures. Each one is shrunk before it is kept (see lib/image.js).
export default function PhotoPicker({ photos, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const full = photos.length >= MAX_PHOTOS

  async function handleFiles(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = '' // lets the same photo be chosen again later
    if (files.length === 0) return

    setError('')
    setBusy(true)

    const room = MAX_PHOTOS - photos.length
    const added = []
    const problems = []

    for (const file of files.slice(0, room)) {
      try {
        added.push(await compressImage(file))
      } catch (err) {
        problems.push(err.message)
      }
    }
    if (files.length > room) problems.push('Only ' + MAX_PHOTOS + ' photos are allowed.')

    if (added.length > 0) onChange([...photos, ...added])
    if (problems.length > 0) setError(problems.join(' '))
    setBusy(false)
  }

  function removePhoto(index) {
    onChange(photos.filter((_, i) => i !== index))
    setError('')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy || full}
          className="rounded-md border-2 border-ink px-3 py-2 text-sm font-semibold hover:bg-paper-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? 'Preparing photo...' : '📷 Add photo'}
        </button>
        <span className="font-mono text-xs">
          {photos.length}/{MAX_PHOTOS} photos
        </span>
        <input
          ref={inputRef}
          id="field-photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose photos"
        />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {photos.map((src, index) => (
            <li key={index} className="relative">
              <img
                src={src}
                alt={'Selected photo ' + (index + 1)}
                className="h-20 w-20 rounded border-2 border-ink object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                aria-label={'Remove photo ' + (index + 1)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-paper text-sm font-bold leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
