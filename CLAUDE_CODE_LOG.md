# AI Usage Log

This log becomes the "how I used AI" part of the submission. Write it honestly.

**Tool used:** Claude (browser chat). My mentor told me to build this assignment with it instead of
Claude Code, because I do not have Claude Code access. I am NOT claiming that Claude Code was used.

For every step, keep 3 lines: what I asked, what Claude built, what I understood or changed myself.

---

## Step 0 — Planning (Oct 14-15)

- **What I asked:** guidance on how to show creativity in the app, then a full plan for the project.
- **What Claude gave:** a list of problems in my first prompt (mock photo upload, no report, no responsive
  requirement, generic look), three design concepts, a tiered feature list, and a 4-day build order.
- **My decisions:** chose the "Repair Slip" concept (Option A). Chose no sign-up for students and a passcode
  for admin. Moved Kanban drag-and-drop and admin-added categories out of scope.

## Step 1 — Project skeleton (Oct 15)

- **What I asked:** build the project skeleton from the approved plan: setup, design tokens, config files,
  storage helper, seed data, role gate with placeholder screens, PLAN.md and this log.
- **What Claude built:** the files in `src/` (see PLAN.md section 6).
  Note: Claude could not run `npm install` in its own workspace, so this step was checked for syntax only.
  I must run `npm install` and `npm run dev` myself and report any error.
- **What I understood / changed:** _(write 2-3 lines here after you run it: what opened, what you
  changed, what you learned)_

## Step 2 — Complaint form, real photo upload, My Complaints timeline (Oct 15)

- **What I asked:** continue the build; I wanted to finish the app before deploying to Vercel.
- **What Claude built:** `ComplaintForm` (category icon buttons, problem, block + room dropdowns, title,
  description, urgency, anonymous checkbox), `PhotoPicker` + `lib/image.js` (real upload, shrunk to
  600px JPEG before saving, max 3 photos), `lib/complaints.js` (saves the complaint; if browser storage is
  full it saves the complaint without photos and warns), `StatusTimeline` (Pending, In Progress, Resolved),
  and a student screen that lists only my own complaints.
- **How it was checked:** Claude ran the app in a real browser in its own workspace (not with `npm run dev`
  there, because its npm registry was blocked) and tested 34 things: empty form errors, photo shrinking,
  3-photo limit, anonymous complaint keeps the device id but no name, refresh keeps data,
  storage-full behaviour, admin passcode, Reset demo, no horizontal scroll at 390px.
- **What I understood / changed:** _(write 2-3 lines here after you try it on your computer)_

## Step 3 — Admin dashboard: stats, filters, status change, report (Oct 15)

- **What I asked:** after Step 2 worked on my laptop (form filed, slip showed in My complaints), build the admin side.
- **What Claude built:** stats cards (total / pending / in progress / resolved), category percentage bars made
  only with Tailwind boxes, filters (status, category, urgency), a status dropdown on every slip that saves
  the change and adds it to the slip history, CSV download, and a print-friendly report.
  The stamp on a slip "thumps" only when its status changes, not every time the list is redrawn.
- **How it was checked:** Claude ran the app in a real browser in its own workspace and tested 34 admin checks
  (numbers, filters, sort order, status change + history + refresh, CSV content, print view, anonymous never named,
  no device ids on screen) on top of the 34 student checks from Step 2. Still not checked with `npm run dev` there.
- **What I understood / changed:** _(write 2-3 lines here after you try it on your computer)_
