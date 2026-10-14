// Safe wrapper around localStorage. Every key gets the "rs_" prefix.
// Reads never crash on corrupt data, and writes report quota errors instead of throwing.

const PREFIX = 'rs_'

export const KEYS = {
  complaints: 'complaints',
  notifications: 'notifications',
  deviceId: 'deviceId',
  session: 'session',
  seeded: 'seeded',
  counter: 'counter',
}

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    // Corrupt JSON or storage blocked (private mode): use the fallback instead of crashing.
    return fallback
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return { ok: true }
  } catch (error) {
    const quota =
      error &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014)
    return { ok: false, quota: Boolean(quota), error }
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // Nothing useful to do if storage is blocked.
  }
}

// A random id for this browser. It lets a student see their own complaints,
// even when they reported anonymously (the admin screens never show it).
export function getDeviceId() {
  let id = read(KEYS.deviceId, null)
  if (typeof id !== 'string' || id.length === 0) {
    const random =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10)
    id = 'dev-' + random
    write(KEYS.deviceId, id)
  }
  return id
}
