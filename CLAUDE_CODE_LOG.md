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

## Step 4 — Technician assignment + design polish (Oct 15)

- **What I asked:** after Step 3 worked and was deployed to Vercel, I noticed that demo slips show an assigned
  technician but the admin screen had no way to assign one. I also had design feedback (button colour,
  chart colours, text contrast) and asked Claude whether each point was right.
- **What Claude changed:**
  - Technician: an "Assign technician" dropdown on every slip (the usual technician for the category is marked
    "(suggested)"), a warning on slips that are In Progress with nobody assigned, and the name in the CSV report.
  - "Log out" is now "Switch role", because that is what the button does.
  - "Download CSV" is the one solid navy button on the admin screen.
  - Category bars are coloured by group (IT & Lab navy, Electrical amber, Facilities green, Washroom steel-blue)
    with a legend. The count and percentage stay as text, so colour is never the only information.
  - Claude checked the contrast numbers instead of just accepting the feedback: timestamps were already dark
    navy (13:1), so they were NOT changed to grey. The real weak spots were placeholder text (2.9:1) and disabled
    dropdowns (3.8:1); both are now about 5:1.
  - Print: browsers drop background colours when printing, so bars, legend, stamps, timeline and urgency dots now
    keep their colours on paper (checked on a real PDF).
- **How it was checked:** Claude ran 27 + 34 + 34 browser checks in its own workspace (technician assign/unassign,
  warning, refresh, CSV column, bar colours, legend, button colours, placeholder, print PDF). Still not run
  with `npm run dev` there.
- **What I understood / changed:** _(write 2-3 lines here after you try it on your computer)_
