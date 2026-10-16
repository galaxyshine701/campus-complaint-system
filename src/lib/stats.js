// Numbers for the admin dashboard. Pure functions: give a list of complaints, get a result.

import { getCategory } from '../config/categories.js'
import { isRated } from './rating.js'

const STATUS_RANK = { pending: 0, in_progress: 1, resolved: 2 }
const URGENCY_RANK = { high: 0, medium: 1, low: 2 }

// Whole-number percentages that always add up to exactly 100 ("largest remainder" method):
// round every share down, then hand the leftover points to the biggest fractions.
// Plain rounding can give 103% (for example 38 + 13 x 5), which looks like a mistake on a report.
// Everything stays in whole numbers, so ties are decided the same way every time (list order).
export function roundedPercents(counts) {
  const total = counts.reduce((sum, n) => sum + n, 0)
  if (total === 0) return counts.map(() => 0)

  const parts = counts.map((n, index) => ({
    index,
    whole: Math.floor((n * 100) / total),
    remainder: (n * 100) % total,
  }))
  let left = 100 - parts.reduce((sum, p) => sum + p.whole, 0)

  const byRemainder = [...parts].sort((a, b) => b.remainder - a.remainder || a.index - b.index)
  for (const part of byRemainder) {
    if (left <= 0) break
    part.whole += 1
    left -= 1
  }
  return parts.map((p) => p.whole)
}

// Total, count per status, how many complaints each category has, and the average repair rating.
// `share` is the exact percentage (used for the bar width), `percent` is the whole-number one (used for the text).
export function computeStats(list) {
  const total = list.length
  const byStatus = { pending: 0, in_progress: 0, resolved: 0 }
  const byCategory = new Map()
  let ratingCount = 0
  let ratingSum = 0

  for (const complaint of list) {
    if (Object.prototype.hasOwnProperty.call(byStatus, complaint.status)) {
      byStatus[complaint.status] += 1
    }
    byCategory.set(complaint.category, (byCategory.get(complaint.category) || 0) + 1)
    if (isRated(complaint)) {
      ratingCount += 1
      ratingSum += complaint.rating
    }
  }

  const categories = [...byCategory.entries()]
    .map(([id, count]) => {
      const category = getCategory(id)
      const share = total > 0 ? (count * 100) / total : 0
      return {
        id,
        label: category ? category.label : id,
        icon: category ? category.icon : '❔',
        group: category ? category.group : '',
        count,
        share,
        percent: 0,
      }
    })
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  // The text percentages are worked out on the sorted list, so ties are always broken the same way.
  const percents = roundedPercents(categories.map((c) => c.count))
  categories.forEach((c, index) => {
    c.percent = percents[index]
  })

  const rating = {
    count: ratingCount,
    average: ratingCount > 0 ? ratingSum / ratingCount : null,
  }

  return { total, ...byStatus, categories, rating }
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
