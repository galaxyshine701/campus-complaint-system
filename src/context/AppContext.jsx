import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEMO_ADMIN_PASSCODE, TECHNICIANS } from '../config/campus.js'
import { KEYS, read, write, remove, getDeviceId, storageKey } from '../lib/storage.js'
import { seedIfNeeded, resetDemo as resetDemoData } from '../lib/seed.js'
import { buildComplaint, nextSlipNumber, saveNewComplaint } from '../lib/complaints.js'
import {
  addNotification,
  buildNotification,
  loadNotifications,
  markAllRead,
} from '../lib/notifications.js'
import { ratingProblem } from '../lib/rating.js'

// One shared place for the app state: who is logged in, the complaints list and the notifications.
// Admin actions (status change, technician) and student actions (rating, mark updates as read) live here too.

const AppContext = createContext(null)

function loadSession() {
  const saved = read(KEYS.session, null)
  const valid = saved && (saved.role === 'student' || saved.role === 'admin')
  return valid ? saved : null
}

function loadComplaints() {
  const list = seedIfNeeded()
  return Array.isArray(list) ? list : []
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(loadSession)
  const [complaints, setComplaints] = useState(loadComplaints)
  const [notifications, setNotifications] = useState(loadNotifications)
  const deviceId = useMemo(() => getDeviceId(), [])

  // Two tabs of the same browser share one localStorage. When the other tab saves something,
  // pick it up here, so this tab never saves an old copy over the newer one and
  // a student tab sees a new notification right away.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === storageKey(KEYS.complaints)) {
        const list = read(KEYS.complaints, null)
        if (Array.isArray(list)) setComplaints(list)
      } else if (event.key === storageKey(KEYS.notifications)) {
        setNotifications(loadNotifications())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function saveSession(next) {
    write(KEYS.session, next)
    setSession(next)
  }

  function loginStudent(name) {
    const clean = String(name || '').trim()
    saveSession({ role: 'student', name: clean || 'Student' })
  }

  // Returns true when the passcode is right, false otherwise (the screen shows the error).
  function loginAdmin(passcode) {
    if (String(passcode).trim() !== DEMO_ADMIN_PASSCODE) return false
    saveSession({ role: 'admin', name: 'Admin' })
    return true
  }

  function logout() {
    remove(KEYS.session)
    setSession(null)
  }

  function resetDemo() {
    setComplaints(resetDemoData())
    setNotifications([])
  }

  // Files a new complaint from the form. The form screen shows the result message.
  function addComplaint(form) {
    const number = nextSlipNumber(complaints)
    const complaint = buildComplaint(
      form,
      { name: session?.name, deviceId },
      number,
      new Date().toISOString(),
    )
    const result = saveNewComplaint(complaints, complaint)
    if (result.ok) setComplaints(result.list)
    return result
  }

  // Admin: move a complaint to another status. Saves the change, adds it to the slip's history
  // and leaves a notification for the student who reported it.
  function updateStatus(id, status) {
    const target = complaints.find((c) => c.id === id)
    if (!target || target.status === status) return { ok: true, changed: false }

    const now = new Date().toISOString()
    const history = Array.isArray(target.history) ? target.history : []
    const next = complaints.map((c) =>
      c.id === id ? { ...c, status, updatedAt: now, history: [...history, { status, at: now }] } : c,
    )

    const result = write(KEYS.complaints, next)
    if (!result.ok) return { ok: false, quota: Boolean(result.quota) }
    setComplaints(next)

    // The status change is already saved. If the notification cannot be saved, the change still stands.
    if (target.reporterId) {
      const nextNotes = addNotification(notifications, buildNotification(target, status, now))
      write(KEYS.notifications, nextNotes)
      setNotifications(nextNotes)
    }
    return { ok: true, changed: true }
  }

  // Admin: give a complaint to a technician. An empty name means "unassigned".
  function assignTechnician(id, name) {
    const target = complaints.find((c) => c.id === id)
    const wanted = name || null
    if (!target || (target.assignedTo || null) === wanted) return { ok: true, changed: false }
    // Only names from the technician list are accepted (the dropdown cannot send anything else).
    if (wanted !== null && !TECHNICIANS.includes(wanted)) return { ok: false, quota: false }

    const now = new Date().toISOString()
    const next = complaints.map((c) =>
      c.id === id ? { ...c, assignedTo: wanted, updatedAt: now } : c,
    )

    const result = write(KEYS.complaints, next)
    if (!result.ok) return { ok: false, quota: Boolean(result.quota) }
    setComplaints(next)
    return { ok: true, changed: true }
  }

  // Student: rate a repair from 1 to 5 stars. Only the reporter's own browser, only when the
  // complaint is Resolved, and only once (see lib/rating.js).
  function rateComplaint(id, stars) {
    const target = complaints.find((c) => c.id === id)
    const problem = ratingProblem(target, stars, deviceId)
    if (problem) return { ok: false, reason: problem }

    const now = new Date().toISOString()
    const next = complaints.map((c) => (c.id === id ? { ...c, rating: stars, ratedAt: now } : c))

    const result = write(KEYS.complaints, next)
    if (!result.ok) return { ok: false, reason: result.quota ? 'quota' : 'save-failed' }
    setComplaints(next)
    return { ok: true }
  }

  // Student: "Mark all as read" in the Updates list.
  function markNotificationsRead() {
    const next = markAllRead(notifications, deviceId)
    write(KEYS.notifications, next)
    setNotifications(next)
  }

  const value = {
    session,
    complaints,
    notifications,
    deviceId,
    loginStudent,
    loginAdmin,
    logout,
    resetDemo,
    addComplaint,
    updateStatus,
    assignTechnician,
    rateComplaint,
    markNotificationsRead,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
