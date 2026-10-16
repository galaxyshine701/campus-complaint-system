// Notifications: when the admin changes a complaint's status, the student who reported it gets a message.
// They are stored in localStorage (rs_notifications) and addressed to the reporter's device id,
// so an anonymous reporter is notified too, and the admin screens never show them.
// This works inside one browser only (there is no backend), and the README says so.

import { STATUSES } from '../config/campus.js'
import { KEYS, read } from './storage.js'

export const MAX_NOTIFICATIONS = 100

export function isValidNotification(n) {
  return (
    Boolean(n) &&
    typeof n.id === 'string' &&
    typeof n.forReporterId === 'string' &&
    typeof n.message === 'string' &&
    typeof n.at === 'string'
  )
}

// Corrupt or missing data gives an empty list instead of a crash.
export function loadNotifications() {
  const list = read(KEYS.notifications, [])
  return Array.isArray(list) ? list.filter(isValidNotification) : []
}

export function buildNotification(complaint, status, at) {
  const label = STATUSES.find((s) => s.id === status)?.label || status
  const title = String(complaint.title || '').trim()
  const shortTitle = title.length > 50 ? title.slice(0, 49) + '…' : title
  let message = complaint.id + (shortTitle ? ' "' + shortTitle + '"' : '') + ' is now ' + label + '.'
  if (status === 'resolved') message += ' You can rate the repair.'

  return {
    id: 'N-' + at + '-' + Math.random().toString(36).slice(2, 6),
    complaintId: complaint.id,
    forReporterId: complaint.reporterId,
    message,
    status,
    at,
    read: false,
  }
}

// Newest first, and the list never grows past MAX_NOTIFICATIONS.
export function addNotification(list, note) {
  return [note, ...list].slice(0, MAX_NOTIFICATIONS)
}

// The notifications that belong to this browser's student, newest first.
export function forReporter(list, deviceId) {
  return list
    .filter((n) => n.forReporterId === deviceId)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))
}

export function markAllRead(list, deviceId) {
  return list.map((n) => (n.forReporterId === deviceId && !n.read ? { ...n, read: true } : n))
}
