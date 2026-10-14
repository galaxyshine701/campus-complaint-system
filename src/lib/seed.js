// Demo data. A reviewer opens the live link with an EMPTY localStorage, so the app
// fills itself with these complaints on first load (and "Reset demo" brings them back).
// No photos here on purpose: base64 photos would eat the ~5MB localStorage quota.

import { KEYS, read, write, remove } from './storage.js'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function ago(ms) {
  return new Date(Date.now() - ms).toISOString()
}

function slip(n) {
  return 'RS-' + String(n).padStart(4, '0')
}

function makeComplaint(n, data) {
  const createdAt = data.createdAt
  return {
    id: slip(n),
    title: data.title,
    category: data.category,
    issue: data.issue,
    block: data.block,
    room: data.room,
    locationNote: data.locationNote || '',
    description: data.description,
    urgency: data.urgency,
    isAnonymous: Boolean(data.isAnonymous),
    reporterName: data.isAnonymous ? null : data.reporterName,
    reporterId: 'seed-' + n,
    photos: [],
    status: data.status || 'pending',
    assignedTo: data.assignedTo || null,
    createdAt,
    updatedAt: data.updatedAt || createdAt,
    history: data.history || [{ status: 'pending', at: createdAt }],
    rating: data.rating ?? null,
    resolvedPhoto: null,
  }
}

export function buildSeedComplaints() {
  const list = [
    makeComplaint(1, {
      title: 'Fan makes a loud rattling noise',
      category: 'fan',
      issue: 'noisy',
      block: 'B',
      room: 'Room 204',
      description: 'The ceiling fan rattles the whole lesson and we cannot hear the teacher.',
      urgency: 'high',
      reporterName: 'Sara',
      createdAt: ago(6 * DAY),
    }),
    makeComplaint(2, {
      title: 'Fan noisy again',
      category: 'fan',
      issue: 'noisy',
      block: 'B',
      room: 'Room 204',
      description: 'Same fan as before, it started rattling again after two days.',
      urgency: 'medium',
      reporterName: 'Hamza',
      createdAt: ago(3 * DAY),
    }),
    makeComplaint(3, {
      title: 'Fan in the back row wobbles',
      category: 'fan',
      issue: 'noisy',
      block: 'B',
      room: 'Room 204',
      description: 'It wobbles and makes a scraping sound. It looks unsafe.',
      urgency: 'high',
      isAnonymous: true,
      createdAt: ago(1 * DAY),
    }),
    makeComplaint(4, {
      title: 'Projector image is blurred',
      category: 'projector',
      issue: 'blurred',
      block: 'C',
      room: 'IT Lab 1',
      description: 'The picture is blurry even after focusing. Presentations are hard to read.',
      urgency: 'medium',
      reporterName: 'Ms. Nadia',
      status: 'in_progress',
      assignedTo: 'IT Support Bilal',
      createdAt: ago(2 * DAY),
      updatedAt: ago(1 * DAY),
      history: [
        { status: 'pending', at: ago(2 * DAY) },
        { status: 'in_progress', at: ago(1 * DAY) },
      ],
    }),
    makeComplaint(5, {
      title: 'Wi-Fi keeps disconnecting',
      category: 'wifi',
      issue: 'no-connection',
      block: 'L',
      room: 'Reading Hall',
      description: 'The Wi-Fi drops every few minutes, so online research is impossible.',
      urgency: 'high',
      reporterName: 'Ayesha',
      createdAt: ago(5 * HOUR),
    }),
    makeComplaint(6, {
      title: 'Tube light flickering',
      category: 'light',
      issue: 'flickering',
      block: 'A',
      room: 'Room 102',
      description: 'The light above the whiteboard flickers all day.',
      urgency: 'low',
      reporterName: 'Mr. Kamran',
      status: 'resolved',
      assignedTo: 'Electrician Asif',
      rating: 5,
      createdAt: ago(7 * DAY),
      updatedAt: ago(5 * DAY),
      history: [
        { status: 'pending', at: ago(7 * DAY) },
        { status: 'in_progress', at: ago(6 * DAY) },
        { status: 'resolved', at: ago(5 * DAY) },
      ],
    }),
    makeComplaint(7, {
      title: 'Whiteboard shows old writing',
      category: 'facilities',
      issue: 'whiteboard',
      block: 'B',
      room: 'Room 201',
      description: 'Old marker writing does not erase, so new notes mix with the old ones.',
      urgency: 'medium',
      reporterName: 'Zainab',
      createdAt: ago(4 * DAY),
    }),
    makeComplaint(8, {
      title: 'Washroom tap is leaking',
      category: 'washroom',
      issue: 'leak',
      block: 'C',
      room: 'Washroom',
      description: 'Water keeps running from the tap and the floor is wet.',
      urgency: 'high',
      isAnonymous: true,
      status: 'in_progress',
      assignedTo: 'Plumber Imran',
      createdAt: ago(1 * DAY),
      updatedAt: ago(6 * HOUR),
      history: [
        { status: 'pending', at: ago(1 * DAY) },
        { status: 'in_progress', at: ago(6 * HOUR) },
      ],
    }),
  ]
  return list
}

function writeSeed() {
  const complaints = buildSeedComplaints()
  write(KEYS.complaints, complaints)
  write(KEYS.notifications, [])
  write(KEYS.counter, complaints.length)
  write(KEYS.seeded, true)
  return complaints
}

// Runs on app start. Seeds only when nothing usable is stored yet.
export function seedIfNeeded() {
  const seeded = read(KEYS.seeded, false)
  const complaints = read(KEYS.complaints, null)
  if (seeded && Array.isArray(complaints)) return complaints
  return writeSeed()
}

// "Reset demo" button: back to the original demo data. The device id and login are kept.
export function resetDemo() {
  remove(KEYS.complaints)
  remove(KEYS.notifications)
  remove(KEYS.counter)
  remove(KEYS.seeded)
  return writeSeed()
}
