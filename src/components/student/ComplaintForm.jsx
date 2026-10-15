import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { getCategory } from '../../config/categories.js'
import { BLOCKS, getBlock, URGENCIES } from '../../config/campus.js'
import CategoryPicker from './CategoryPicker.jsx'
import PhotoPicker from './PhotoPicker.jsx'

const LIMITS = { titleMin: 5, titleMax: 80, descMin: 15, descMax: 500, noteMax: 80 }

const INITIAL = {
  category: '',
  issue: '',
  block: '',
  room: '',
  locationNote: '',
  title: '',
  description: '',
  urgency: 'medium',
  isAnonymous: false,
  photos: [],
}

// The order errors are checked in (the first one found gets the focus).
const FIELD_ORDER = ['category', 'issue', 'block', 'room', 'title', 'description', 'urgency']

function validate(form) {
  const errors = {}
  if (!form.category) errors.category = 'Choose what is broken.'
  if (form.category && !form.issue) errors.issue = 'Choose the problem.'
  if (!form.block) errors.block = 'Choose the block.'
  if (form.block && !form.room) errors.room = 'Choose the room.'
  if (form.title.trim().length < LIMITS.titleMin) {
    errors.title = 'Write a short title (at least ' + LIMITS.titleMin + ' characters).'
  }
  if (form.description.trim().length < LIMITS.descMin) {
    errors.description = 'Describe the problem (at least ' + LIMITS.descMin + ' characters).'
  }
  if (!form.urgency) errors.urgency = 'Choose how urgent it is.'
  return errors
}

const inputClass =
  'mt-1 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60'
const labelClass = 'block text-sm font-semibold'
const chipClass =
  'flex cursor-pointer items-center justify-center rounded-md border-2 border-ink px-3 py-2 text-sm font-semibold has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm font-semibold">
      <span aria-hidden="true">⚠ </span>
      {message}
    </p>
  )
}

export default function ComplaintForm() {
  const { addComplaint } = useApp()
  const [form, setForm] = useState(INITIAL)
  const [showErrors, setShowErrors] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [filed, setFiled] = useState(null)
  const filedRef = useRef(null)

  const errors = validate(form)
  const shown = showErrors ? errors : {}
  const errorCount = Object.keys(errors).length
  const category = getCategory(form.category)
  const block = getBlock(form.block)

  // When a complaint was filed, move the screen reader / keyboard focus to the confirmation.
  useEffect(() => {
    if (filed) filedRef.current?.focus()
  }, [filed])

  function update(patch) {
    setForm((prev) => ({ ...prev, ...patch }))
    setSaveError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (errorCount > 0) {
      setShowErrors(true)
      const firstKey = FIELD_ORDER.find((key) => errors[key])
      const element = document.getElementById('field-' + firstKey)
      if (element) {
        element.scrollIntoView({ block: 'center' })
        if (typeof element.focus === 'function') element.focus()
      }
      return
    }

    const result = addComplaint(form)
    if (!result.ok) {
      setSaveError(
        result.quota
          ? 'Browser storage is full, so this complaint could not be saved. Ask the admin to use "Reset demo".'
          : 'Could not save the complaint. Please try again.',
      )
      return
    }

    setFiled({ id: result.complaint.id, photosDropped: result.photosDropped })
    setForm(INITIAL)
    setShowErrors(false)
    setSaveError('')
  }

  return (
    <section aria-labelledby="new-slip-heading">
      {filed && (
        <div
          ref={filedRef}
          tabIndex={-1}
          role="status"
          className="mb-4 rounded-md border-2 border-ink bg-slip-amber p-4 text-ink"
        >
          <p className="font-display text-lg font-extrabold">Slip {filed.id} filed. Status: Pending.</p>
          <p className="mt-1 text-sm">You can follow it in "My complaints" below.</p>
          {filed.photosDropped && (
            <p className="mt-1 text-sm font-semibold">
              <span aria-hidden="true">⚠ </span>
              Your complaint was saved, but the photos could not be (browser storage is full).
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-md border-2 border-ink bg-white/40 p-4 shadow-[3px_3px_0_0_var(--color-ink)]"
      >
        <h2 id="new-slip-heading" className="font-display text-xl font-extrabold">
          New repair slip
        </h2>

        {showErrors && errorCount > 0 && (
          <p role="alert" className="rounded-md border-2 border-ink px-3 py-2 text-sm font-semibold">
            <span aria-hidden="true">⚠ </span>
            Please fix {errorCount} {errorCount === 1 ? 'thing' : 'things'} below.
          </p>
        )}

        <fieldset>
          <legend className={labelClass}>What is broken?</legend>
          <div className="mt-2">
            <CategoryPicker
              value={form.category}
              onChange={(id) => update({ category: id, issue: '' })}
            />
          </div>
          <FieldError id="err-category" message={shown.category} />
        </fieldset>

        <div>
          <label htmlFor="field-issue" className={labelClass}>
            What is the problem?
          </label>
          <select
            id="field-issue"
            value={form.issue}
            disabled={!category}
            onChange={(event) => update({ issue: event.target.value })}
            aria-invalid={Boolean(shown.issue)}
            aria-describedby={shown.issue ? 'err-issue' : undefined}
            className={inputClass}
          >
            <option value="">{category ? 'Choose the problem' : 'Choose a category first'}</option>
            {category?.issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.label}
              </option>
            ))}
          </select>
          <FieldError id="err-issue" message={shown.issue} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="field-block" className={labelClass}>
              Block
            </label>
            <select
              id="field-block"
              value={form.block}
              onChange={(event) => update({ block: event.target.value, room: '' })}
              aria-invalid={Boolean(shown.block)}
              aria-describedby={shown.block ? 'err-block' : undefined}
              className={inputClass}
            >
              <option value="">Choose the block</option>
              {BLOCKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <FieldError id="err-block" message={shown.block} />
          </div>

          <div>
            <label htmlFor="field-room" className={labelClass}>
              Room
            </label>
            <select
              id="field-room"
              value={form.room}
              disabled={!block}
              onChange={(event) => update({ room: event.target.value })}
              aria-invalid={Boolean(shown.room)}
              aria-describedby={shown.room ? 'err-room' : undefined}
              className={inputClass}
            >
              <option value="">{block ? 'Choose the room' : 'Choose a block first'}</option>
              {block?.rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            <FieldError id="err-room" message={shown.room} />
          </div>
        </div>

        <div>
          <label htmlFor="field-locationNote" className={labelClass}>
            Where exactly? (optional)
          </label>
          <input
            id="field-locationNote"
            type="text"
            value={form.locationNote}
            maxLength={LIMITS.noteMax}
            onChange={(event) => update({ locationNote: event.target.value })}
            placeholder="For example: back row, near the window"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="field-title" className={labelClass}>
            Title
          </label>
          <input
            id="field-title"
            type="text"
            value={form.title}
            maxLength={LIMITS.titleMax}
            onChange={(event) => update({ title: event.target.value })}
            aria-invalid={Boolean(shown.title)}
            aria-describedby={shown.title ? 'err-title' : undefined}
            placeholder="For example: Fan makes a loud noise"
            className={inputClass}
          />
          <FieldError id="err-title" message={shown.title} />
        </div>

        <div>
          <label htmlFor="field-description" className={labelClass}>
            Describe the problem
          </label>
          <textarea
            id="field-description"
            rows={4}
            value={form.description}
            maxLength={LIMITS.descMax}
            onChange={(event) => update({ description: event.target.value })}
            aria-invalid={Boolean(shown.description)}
            aria-describedby={shown.description ? 'err-description' : undefined}
            className={inputClass}
          />
          <div className="flex items-start justify-between gap-3">
            <FieldError id="err-description" message={shown.description} />
            <p className="ml-auto mt-1 font-mono text-xs">
              {form.description.length}/{LIMITS.descMax}
            </p>
          </div>
        </div>

        <fieldset id="field-urgency">
          <legend className={labelClass}>How urgent is it?</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {URGENCIES.map((u) => (
              <label key={u.id} className={chipClass}>
                <input
                  type="radio"
                  name="urgency"
                  value={u.id}
                  checked={form.urgency === u.id}
                  onChange={() => update({ urgency: u.id })}
                  className="sr-only"
                />
                {u.label}
              </label>
            ))}
          </div>
          <FieldError id="err-urgency" message={shown.urgency} />
        </fieldset>

        <div>
          <p className={labelClass}>Photos (optional, up to 3)</p>
          <div className="mt-2">
            <PhotoPicker photos={form.photos} onChange={(photos) => update({ photos })} />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={(event) => update({ isAnonymous: event.target.checked })}
            className="mt-0.5 h-5 w-5 accent-ink"
          />
          <span>Report anonymously (my name will not be shown on the slip)</span>
        </label>

        {saveError && (
          <p role="alert" className="rounded-md border-2 border-ink px-3 py-2 text-sm font-semibold">
            <span aria-hidden="true">⚠ </span>
            {saveError}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md border-2 border-ink bg-ink px-4 py-2.5 font-semibold text-paper hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          File this complaint
        </button>
      </form>
    </section>
  )
}
