// Campus-wide settings: locations, technicians, statuses, urgency levels, admin passcode.
// Location is always Block + Room (dropdowns) so the hotspot statistics stay accurate.

export const BLOCKS = [
  {
    id: 'A',
    name: 'Block A (Admin)',
    rooms: ['Room 101', 'Room 102', 'Room 103', 'Staff Room', 'Washroom'],
  },
  {
    id: 'B',
    name: 'Block B (Classrooms)',
    rooms: ['Room 201', 'Room 202', 'Room 203', 'Room 204', 'Washroom'],
  },
  {
    id: 'C',
    name: 'Block C (IT & Labs)',
    rooms: ['IT Lab 1', 'IT Lab 2', 'Seminar Hall', 'Washroom'],
  },
  {
    id: 'L',
    name: 'Library',
    rooms: ['Reading Hall', 'Computer Corner'],
  },
]

export function getBlock(id) {
  return BLOCKS.find((b) => b.id === id) || null
}

export const TECHNICIANS = [
  'Electrician Asif',
  'IT Support Bilal',
  'Carpenter Rashid',
  'Plumber Imran',
]

// Which technician usually handles which category. Only a SUGGESTION shown in the admin dropdown;
// the admin still chooses.
export const SUGGESTED_TECHNICIAN = {
  computer: 'IT Support Bilal',
  projector: 'IT Support Bilal',
  wifi: 'IT Support Bilal',
  fan: 'Electrician Asif',
  light: 'Electrician Asif',
  ac: 'Electrician Asif',
  facilities: 'Carpenter Rashid',
  washroom: 'Plumber Imran',
}

export const STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
]

export const URGENCIES = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

// DEMO ONLY. This is NOT real security: anyone can read this file in the browser.
// A real version would use proper login (for example Supabase auth). Documented in the README.
export const DEMO_ADMIN_PASSCODE = 'campus123'
