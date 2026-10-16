# PLAN.md — Repair Slip (Campus Electronic Complaint Management System)

Assignment due: **Oct 18, 2026, 11:59 PM**. Submit by the evening of Oct 18, not at 11:59.
Stack: React (Vite) + Tailwind CSS v4, data in browser localStorage, deployed on Vercel.

## 1. Requirements that MUST be met (from the assignment)

- Report issues about computers, projectors, fans, lights, Wi-Fi.
- Submit complaints with a description AND real pictures (not a mock).
- Track status: Pending, In Progress, Resolved.
- Admin dashboard to manage complaints.
- Issue statistics AND reports (CSV or print).
- Responsive, user-friendly interface (mobile-first).
- Originality: the app needs its own identity, not a generic AI template.

## 2. Concept: Option A "Repair Slip"

Every complaint is a paper job-slip with a slip number, like a workshop or hospital chit.
The status is a rubber stamp. When the status changes, the stamp "thumps" onto the slip.
That stamp animation is the only animation, because it has a real meaning.

| Token | Value | Use |
|---|---|---|
| paper | `#F4EBD9` | page background |
| ink | `#1F2A44` | ALL small text, borders |
| stamp-red | `#C8352B` | big bold stamps only (20px+) |
| stamp-green | `#2F7D5B` | big bold stamps only (20px+) |
| slip-amber | `#D99A22` | FILL only, always with ink text on top |

Fonts: **Fraunces** (headings), **IBM Plex Mono** (slip numbers, labels, stamps),
**IBM Plex Sans** (body text and long descriptions, because mono is tiring to read).

Rules from our review:
- Small text is always ink on paper (amber and red fail contrast for small text).
- Only the stamp and slip number are tilted. Cards stay straight so phones never scroll sideways.
- The stamp animation is switched off for users with `prefers-reduced-motion`.

## 3. Locked decisions

1. **No sign-up / sign-in.** Student: "Continue as Student" with a name (optional). A device id
   (`reporterId`) is generated so My Complaints works even for anonymous reports.
   Admin: simple passcode screen (demo gate only, see README).
2. **Categories live in ONE config file** (`src/config/categories.js`).
   Required five first: Computer, Projector, Fan, Light, Wi-Fi. Extras: Air Conditioner, Facilities
   (furniture, whiteboard ghosting / old writing, door lock), Washroom (leak, flush, cleaning).
3. **Location = Block dropdown + Room dropdown** (+ optional note). Free text would make
   "Room 204", "room204" and "R-204" count as different places and break the hotspot stats.
4. **Photos:** real upload, resized to about 600px JPEG before saving, limited number per complaint,
   quota errors handled gracefully.
5. **Seed demo data + "Reset demo" button**, because reviewers open the live link with empty storage.
   Seed complaints have NO photos (photos would eat the ~5MB localStorage quota).
6. Data is per browser (no backend). The README must say so.

## 4. Four-step architecture

1. **Foundation:** Vite + React + Tailwind, design tokens, config files, safe localStorage helper, seed data.
2. **Student side:** role gate, complaint form, photo compression, My Complaints (slips + timeline).
3. **Admin side:** passcode, list + filters, status and technician change, stats cards,
   category bars, CSV/print report. **Tier 1 ends here.**
4. **Tier 2 + polish:** notifications/toasts, rating, insights (recurring, slowest pending,
   hotspot grid), before/after photo, README, log.

State: one React Context (`AppContext`). No router; the saved role decides the screen.

## 5. Feature tiers

- **Tier 1 (assignment):** 5 required categories, form + real photo, status tracking, admin list with
  filters and status change, stats cards, category percentage bars, CSV/print report, responsive layout, seed data.
- **Tier 2:** technician assignment, 5-star rating after Resolved, anonymous reporting, toast
  notifications, before/after photo on resolve, and three insights from the same data:
  (a) hotspots by block/room as a Tailwind colour grid, (b) recurring flag (same room + same category 3+ times),
  (c) slowest pending complaint.
- **Out of scope:** Kanban drag-and-drop, admin-added categories, maps/heatmaps, real backend.

Cost order for Tier 2 (cheap to expensive): recurring flag, slowest pending, technician, rating,
hotspot grid, before/after photo (expensive only because of the storage quota).

## 6. File tree

```
src/
  main.jsx                   starts React and wraps the app in AppProvider
  App.jsx                    picks the screen: gate / student / admin
  styles/index.css           Tailwind import, design tokens, stamp animation
  config/
    categories.js            all categories, issues, icons (ONE place)
    campus.js                blocks, rooms, technicians, statuses, urgencies, demo admin passcode
  lib/
    storage.js               safe localStorage read/write, quota error handling, device id
    seed.js                  demo complaints + resetDemo()
    image.js                 compress photo to ~600px JPEG (done in Step 2)
    complaints.js            build + save a new complaint, retry without photos if storage is full (Step 2)
    format.js                date display helper (Step 2)
    rating.js                is a complaint rated, may this device rate it (Step 5)
    notifications.js         build / load / cap / mark read, for the reporter's device (Step 5)
    insights.js              (Step 7) hotspots, recurring, slowest pending
    report.js                CSV export, formula-safe, anonymous shown as "Anonymous" (done in Step 3)
    stats.js                 totals, category percentages, filtering, admin sort order (Step 3)
  context/
    AppContext.jsx           session + complaints + actions
  components/
    shared/   AppHeader, SlipCard, StampBadge, EmptyState,   (Toast, StarsDisplay done in Step 5)
              Toast, StarsDisplay                            (later: BeforeAfter)
    gate/     RoleGate, AdminPasscode
    student/  StudentHome, ComplaintForm, CategoryPicker,    (done in Step 2)
              PhotoPicker, StatusTimeline,
              RatingStars, UpdatesPanel                      (done in Step 5)
    admin/    AdminDashboard, StatsCards, CategoryBars,      (done in Step 3)
              AdminFilters, AdminControls                    (later: InsightsPanel, HotspotGrid, technician select)
```

## 7. One complaint (JSON)

```json
{
  "id": "RS-0042",
  "title": "Fan makes a loud rattling noise",
  "category": "fan",
  "issue": "noisy",
  "block": "B",
  "room": "Room 204",
  "locationNote": "Back row",
  "description": "...",
  "urgency": "high",
  "isAnonymous": false,
  "reporterName": "Ali",
  "reporterId": "dev-8f3a1c2d",
  "photos": ["data:image/jpeg;base64,..."],
  "status": "pending",
  "assignedTo": null,
  "createdAt": "2026-10-15T10:00:00.000Z",
  "updatedAt": "2026-10-15T10:00:00.000Z",
  "history": [{ "status": "pending", "at": "2026-10-15T10:00:00.000Z" }],
  "rating": null,
  "resolvedPhoto": null
}
```

Anonymous complaint: `reporterName` is `null`, but `reporterId` stays so the student still sees it in My Complaints.
Allowed values: `status` = pending | in_progress | resolved; `urgency` = high | medium | low.

## 8. localStorage keys (all start with `rs_`)

| Key | Content |
|---|---|
| `rs_complaints` | array of complaints |
| `rs_notifications` | `{ id, complaintId, forReporterId, message, status, at, read }` |
| `rs_deviceId` | random id of this browser |
| `rs_session` | `{ role, name }` |
| `rs_seeded` | `true` once demo data was written |
| `rs_counter` | last slip number used |

## 9. Edge cases to handle

- **Quota full:** if the photo cannot be saved, the complaint is still saved and the user sees
  "photo could not be saved".
- **Empty form:** title, category, block, room and description are required; description has a minimum length.
- **Empty states:** student and admin lists show a clear message, never a blank page.
- **Refresh:** session, complaints and notifications come back from localStorage.
- **Corrupt data:** `JSON.parse` is wrapped in try/catch; bad data falls back to seed data.
- **Rating:** only on Resolved complaints, only once.
- **Admin passcode:** wrong passcode shows an error.
- **Anonymity is demo-level only:** the data lives in the same browser, so real anonymity needs a backend.
  The README must say this.
- **Data is per browser:** student and admin on different devices will not see each other's data.
  The README must say this too.

## 10. Build order

- **Oct 15:** project setup (this step), Vercel skeleton deploy, then complaint form + categories.
- **Oct 16:** photo upload, admin list/filters/status, stats + report, responsive. **Tier 1 live by night.**
- **Oct 17:** technician, rating, recurring flag, slowest pending, hotspot grid, then before/after photo last.
- **Oct 18:** README, CLAUDE_CODE_LOG.md, final deploy, submit in the evening.

Rule: after every feature, check the Vercel deploy. If something breaks, go back to the last working
commit. Never leave a half-done feature on `main`. If Tier 1 is not live by Oct 16 night, cut Tier 2.

## 11. Submission checklist

- [ ] GitHub repository link
- [ ] Vercel live link
- [ ] README (what it is, how to run, demo passcode, limits, how AI was used)
- [ ] Brief description of how AI was used (from CLAUDE_CODE_LOG.md)

## 12. Progress (updated Oct 15)

- [x] Step 1 skeleton, Step 2 student form + photo + timeline, Step 3 admin dashboard + report  (Tier 1 code complete)
- [x] Deployed to Vercel (Oct 15)
- [x] Step 4: technician assignment, "Switch role", navy primary button, group-coloured bars, text contrast, print colours
- [x] Vercel fixed (Oct 16): it had made its own second repo (`campus-complaints-system`, with an "s"); it now deploys
      from the real repo `campus-complaint-system`. Step 4 confirmed working on the live link.
- [x] Step 5 (Oct 16): 5-star rating after Resolved (once, student only), notifications + toast for the reporter,
      average rating + CSV column for the admin, percentages that always add up to 100.
- [ ] Tier 2 left: before/after photo, insights (recurring flag, slowest pending, hotspot grid)
- [ ] README (screenshots, live link), final log entries, final deploy, submit on the evening of Oct 18

### How rating and notifications behave (so the README can say it)

- A student can rate only a Resolved slip from the same browser, once. Picking stars only selects; "Send rating" saves.
  A reopened slip keeps its rating, and a second rating is never offered.
- Every status change by the admin leaves one notification addressed to the reporter's device id
  (anonymous reporters included). The student sees a toast (8 seconds, can be closed) and an "Updates" box
  until "Mark all as read". The admin screens never show notifications or device ids.
- It all lives in this browser's localStorage. Two tabs of the same browser stay in sync through the `storage` event.
  A student on another phone will NOT receive anything, because there is no backend.
