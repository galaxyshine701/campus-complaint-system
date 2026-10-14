import { createContext, useContext, useMemo, useState } from 'react'
import { DEMO_ADMIN_PASSCODE } from '../config/campus.js'
import { KEYS, read, write, remove, getDeviceId } from '../lib/storage.js'
import { seedIfNeeded, resetDemo as resetDemoData } from '../lib/seed.js'

// One shared place for the app state: who is logged in, and the complaints list.
// Step 1 only has login/logout and demo reset. Complaint actions arrive in later steps.

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
  const deviceId = useMemo(() => getDeviceId(), [])

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
  }

  const value = { session, complaints, deviceId, loginStudent, loginAdmin, logout, resetDemo }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
