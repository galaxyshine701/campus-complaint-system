// Numbers for the admin dashboard. Pure functions: give a list of complaints, get a result.

import { getCategory } from '../config/categories.js'

const STATUS_RANK = { pending: 0, in_progress: 1, resolved: 2 }
const URGENCY_RANK = { high: 0, medium: 1, low: 2 }

// Total, count per status, and how many complaints each category has.
// `share` is the exact percentage (used for the bar width), `percent` is the rounded one (used for the text).
export function computeStats(list) {
  const total = list.length
  const byStatus = { pending: 0, in_progress: 0, resolved: 0 }
  const byCategory = new Map()

  for (const complaint of list) {
    if (Object.prototype.hasOwnProperty.call(byStatus, complaint.status)) {
      byStatus[complaint.status] += 1
    }
    byCategory.set(complaint.category, (byCategory.get(complaint.category) || 0) + 1)
  }

  const categories = [...byCategory.entries()]
    .map(([id, count]) => {
      const category = getCategory(id)
      const share = total > 0 ? (count * 100) / total : 0
      return {
        id,
        label: category ? category.label : id,
        icon: category ? category.icon : '❔',
        count,
        share,
        percent: Math.round(share),
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  return { total, ...byStatus, categories }
}

// An empty string means "no filter" for that field.
export function filterComplaints(list, filters) {
  return list.filter(
    (c) =>
      (!filters.status || c.status === filters.status) &&
      (!filters.category || c.category === filters.category) &&
      (!filters.urgency || c.urgency === filters.urgency),
  )
}

// What the admin should look at first: pending before in-progress before resolved,
// then high urgency first, then the oldest complaint first.
export function sortForAdmin(list) {
  return [...list].sort(
    (a, b) =>
      (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) ||
      (URGENCY_RANK[a.urgency] ?? 9) - (URGENCY_RANK[b.urgency] ?? 9) ||
      String(a.createdAt).localeCompare(String(b.createdAt)),
  )
}
