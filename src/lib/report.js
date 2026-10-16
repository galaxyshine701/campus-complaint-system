// CSV report (opens in Excel / Google Sheets). The reporter's device id is never exported,
// and anonymous complaints show "Anonymous" instead of a name.

import { getCategory, getIssueLabel } from '../config/categories.js'
import { getBlock, STATUSES, URGENCIES } from '../config/campus.js'
import { isRated } from './rating.js'

const COLUMNS = [
  ['Slip', (c) => c.id],
  ['Title', (c) => c.title],
  ['Category', (c) => getCategory(c.category)?.label || c.category],
  ['Problem', (c) => getIssueLabel(c.category, c.issue)],
  ['Block', (c) => getBlock(c.block)?.name || c.block],
  ['Room', (c) => c.room],
  ['Location note', (c) => c.locationNote],
  ['Urgency', (c) => URGENCIES.find((u) => u.id === c.urgency)?.label || c.urgency],
  ['Status', (c) => STATUSES.find((s) => s.id === c.status)?.label || c.status],
  ['Assigned to', (c) => c.assignedTo || ''],
  ['Student rating (1-5)', (c) => (isRated(c) ? c.rating : '')],
  ['Reported by', (c) => (c.isAnonymous ? 'Anonymous' : c.reporterName || '')],
  ['Photos', (c) => (Array.isArray(c.photos) ? c.photos.length : 0)],
  ['Reported at', (c) => c.createdAt],
  ['Last updated', (c) => c.updatedAt],
  ['Description', (c) => c.description],
]

function cell(value) {
  let text = String(value ?? '')
  // A cell starting with = + - @ can run as a formula in Excel. A leading ' makes it plain text.
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text
  if (/[",\n\r]/.test(text)) text = '"' + text.replace(/"/g, '""') + '"'
  return text
}

export function toCsv(list) {
  const header = COLUMNS.map(([name]) => cell(name)).join(',')
  const rows = list.map((c) => COLUMNS.map(([, get]) => cell(get(c))).join(','))
  return [header, ...rows].join('\r\n')
}

export function downloadCsv(list) {
  // The ﻿ at the start makes Excel read the file as UTF-8.
  const blob = new Blob(['﻿' + toCsv(list)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'complaints-report-' + new Date().toISOString().slice(0, 10) + '.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
