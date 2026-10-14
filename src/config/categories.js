// ONE place for all complaint categories. Components read from here, nothing is hardcoded elsewhere.
// The first five are the ones the assignment requires; the rest are our extras.

export const CATEGORIES = [
  {
    id: 'computer',
    label: 'Computer',
    group: 'IT & Lab',
    icon: '💻',
    issues: [
      { id: 'hardware', label: 'Hardware fault' },
      { id: 'os-crash', label: 'OS crash / hang' },
    ],
  },
  {
    id: 'projector',
    label: 'Projector',
    group: 'IT & Lab',
    icon: '📽️',
    issues: [
      { id: 'blurred', label: 'Blurred display' },
      { id: 'missing-cable', label: 'Missing cable' },
      { id: 'no-power', label: 'Not turning on' },
    ],
  },
  {
    id: 'fan',
    label: 'Fan',
    group: 'Electrical',
    icon: '🌀',
    issues: [
      { id: 'noisy', label: 'Noisy' },
      { id: 'not-working', label: 'Not working' },
    ],
  },
  {
    id: 'light',
    label: 'Light',
    group: 'Electrical',
    icon: '💡',
    issues: [
      { id: 'flickering', label: 'Flickering' },
      { id: 'fused', label: 'Fused / not working' },
    ],
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    group: 'IT & Lab',
    icon: '📶',
    issues: [
      { id: 'slow', label: 'Slow' },
      { id: 'no-connection', label: 'No connection' },
    ],
  },
  {
    id: 'ac',
    label: 'Air Conditioner',
    group: 'Electrical',
    icon: '❄️',
    issues: [
      { id: 'not-cooling', label: 'Not cooling' },
      { id: 'leaking', label: 'Leaking' },
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    group: 'Campus Facilities',
    icon: '🪑',
    issues: [
      { id: 'furniture', label: 'Broken furniture' },
      { id: 'whiteboard', label: 'Damaged whiteboard (ghosting / old writing)' },
      { id: 'door-lock', label: 'Broken door lock' },
    ],
  },
  {
    id: 'washroom',
    label: 'Washroom',
    group: 'Washroom & Cleanliness',
    icon: '🚽',
    issues: [
      { id: 'leak', label: 'Water leak' },
      { id: 'flush', label: 'Flush issue' },
      { id: 'cleaning', label: 'Cleaning required' },
    ],
  },
]

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null
}

export function getIssueLabel(categoryId, issueId) {
  const category = getCategory(categoryId)
  const issue = category?.issues.find((i) => i.id === issueId)
  return issue ? issue.label : ''
}
