// Three insights for the admin, worked out from the same complaints list as the other numbers.
// Pure functions (no React, no storage), so they are easy to test.
//   1. Recurring: the same kind of problem in the same room, 3 or more times.
//   2. Waiting longest: the Pending complaint that has waited the longest.
//   3. Hotspots: how many OPEN complaints (Pending + In Progress) each room has.

import { BLOCKS, getBlock } from '../config/campus.js'

export const RECURRING_MIN = 3

function isOpen(complaint) {
  return complaint.status === 'pending' || complaint.status === 'in_progress'
}

// ---------- 1. Recurring ----------

// Groups complaints by category + block + room. The block is part of the key because
// "Washroom" exists in several blocks. Resolved complaints count too: a fan that was fixed
// and broke again is exactly what this should show.
// Returns the groups with `min` or more complaints, the biggest first.
export function findRecurring(list, min = RECURRING_MIN) {
  const groups = new Map()
  for (const c of list) {
    if (!c || !c.category || !c.block || !c.room) continue
    const key = [c.category, c.block, c.room].join('|')
    let group = groups.get(key)
    if (!group) {
      group = { key, category: c.category, block: c.block, room: c.room, ids: [], open: 0, lastAt: '' }
      groups.set(key, group)
    }
    group.ids.push(c.id)
    if (isOpen(c)) group.open += 1
    if (String(c.createdAt) > group.lastAt) group.lastAt = String(c.createdAt)
  }

  return [...groups.values()]
    .filter((g) => g.ids.length >= min)
    .map((g) => ({ ...g, ids: [...g.ids].sort(), count: g.ids.length }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        b.open - a.open ||
        b.lastAt.localeCompare(a.lastAt) ||
        a.key.localeCompare(b.key),
    )
}

// complaint id -> its recurring group (used to show the warning on each slip)
export function recurringById(groups) {
  const map = new Map()
  for (const group of groups) for (const id of group.ids) map.set(id, group)
  return map
}

// ---------- 2. Waiting longest ----------

// When did this Pending complaint start waiting? Normally when it was filed. If it was reopened,
// it waits from the moment it went back to Pending (the last "pending" entry in its history).
function waitingSince(complaint) {
  const history = Array.isArray(complaint.history) ? complaint.history : []
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] && history[i].status === 'pending' && history[i].at) return history[i].at
  }
  return complaint.createdAt
}

// The Pending complaint that has waited longest, or null when nothing is Pending.
// Complaints with an unreadable date are skipped; a date in the future counts as 0 waiting.
export function slowestPending(list, nowMs = Date.now()) {
  let best = null
  for (const c of list) {
    if (!c || c.status !== 'pending') continue
    const since = waitingSince(c)
    const time = Date.parse(since)
    if (Number.isNaN(time)) continue
    const ageMs = Math.max(0, nowMs - time)
    const better =
      !best || ageMs > best.ageMs || (ageMs === best.ageMs && String(c.id) < String(best.complaint.id))
    if (better) best = { complaint: c, ageMs, since }
  }
  return best
}

// "less than an hour", "5 hours", "1 day", "6 days"
export function formatAge(ms) {
  const hours = Math.floor(Math.max(0, ms) / (60 * 60 * 1000))
  if (hours < 1) return 'less than an hour'
  if (hours < 24) return hours + (hours === 1 ? ' hour' : ' hours')
  const days = Math.floor(hours / 24)
  return days + (days === 1 ? ' day' : ' days')
}

// ---------- 3. Hotspots ----------

// Every room from the campus config with its number of open complaints. A room that is not in the
// config (old data) goes to `other`, so the numbers always add up to all open complaints.
export function buildHotspots(list) {
  const counts = new Map()
  let totalOpen = 0
  for (const c of list) {
    if (!c || !isOpen(c)) continue
    const key = c.block + '|' + c.room
    counts.set(key, (counts.get(key) || 0) + 1)
    totalOpen += 1
  }

  const known = new Set()
  const blocks = BLOCKS.map((block) => ({
    id: block.id,
    name: block.name,
    rooms: block.rooms.map((room) => {
      const key = block.id + '|' + room
      known.add(key)
      return { room, open: counts.get(key) || 0 }
    }),
  }))

  const other = []
  for (const [key, open] of counts) {
    if (known.has(key)) continue
    const [blockId, ...rest] = key.split('|')
    const blockName = getBlock(blockId)?.name || (blockId && blockId !== 'undefined' ? blockId : 'Unknown block')
    const room = rest.join('|')
    other.push({ room: blockName + ' · ' + (room && room !== 'undefined' ? room : 'Unknown room'), open })
  }
  other.sort((a, b) => b.open - a.open || a.room.localeCompare(b.room))

  // The room(s) with the most open complaints, for the one-line summary.
  const all = [
    ...blocks.flatMap((b) => b.rooms.map((r) => ({ label: b.name + ' · ' + r.room, open: r.open }))),
    ...other.map((o) => ({ label: o.room, open: o.open })),
  ]
  const max = all.reduce((m, r) => Math.max(m, r.open), 0)
  const hottest = max > 0 ? all.filter((r) => r.open === max).map((r) => r.label) : []

  return { blocks, other, totalOpen, max, hottest }
}

// 0 open = 0, 1 = 1, 2 = 2, 3 or more = 3 (how dark the cell is)
export function heatLevel(open) {
  return open <= 0 ? 0 : Math.min(open, 3)
}
