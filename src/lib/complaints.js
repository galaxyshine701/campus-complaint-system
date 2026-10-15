// Creating and saving a new complaint. Kept out of the React components so it is easy to test.

import { KEYS, read, write } from './storage.js'

export function slipId(number) {
  return 'RS-' + String(number).padStart(4, '0')
}

function numberFromId(id) {
  const n = parseInt(String(id).replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}

// Next slip number. Uses the saved counter AND the highest id in the list,
// so a lost counter can never create a duplicate id.
export function nextSlipNumber(list) {
  const stored = Number(read(KEYS.counter, 0)) || 0
  const highest = list.reduce((max, c) => Math.max(max, numberFromId(c.id)), 0)
  return Math.max(stored, highest) + 1
}

export function buildComplaint(form, who, number, nowIso) {
  return {
    id: slipId(number),
    title: form.title.trim(),
    category: form.category,
    issue: form.issue,
    block: form.block,
    room: form.room,
    locationNote: form.locationNote.trim(),
    description: form.description.trim(),
    urgency: form.urgency,
    isAnonymous: Boolean(form.isAnonymous),
    // Anonymous: no name on the slip. reporterId stays so the student still sees it in My Complaints.
    reporterName: form.isAnonymous ? null : who.name || 'Student',
    reporterId: who.deviceId,
    photos: form.photos,
    status: 'pending',
    assignedTo: null,
    createdAt: nowIso,
    updatedAt: nowIso,
    history: [{ status: 'pending', at: nowIso }],
    rating: null,
    resolvedPhoto: null,
  }
}

// Saves the complaint. If storage is full, it tries once more WITHOUT the photos,
// so the complaint itself is never lost just because the pictures were too big.
// Returns { ok, list, complaint, photosDropped } or { ok: false, quota }.
export function saveNewComplaint(list, complaint) {
  let saved = complaint
  let next = [...list, saved]
  let result = write(KEYS.complaints, next)
  let photosDropped = false

  if (!result.ok && complaint.photos.length > 0) {
    saved = { ...complaint, photos: [] }
    next = [...list, saved]
    result = write(KEYS.complaints, next)
    photosDropped = result.ok
  }

  if (!result.ok) return { ok: false, quota: Boolean(result.quota) }

  write(KEYS.counter, numberFromId(saved.id))
  return { ok: true, list: next, complaint: saved, photosDropped }
}
