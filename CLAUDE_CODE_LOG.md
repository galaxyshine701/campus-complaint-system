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

## Step 4b — Fixing the Vercel deploy (Oct 15-16)

- **What happened:** after I pushed Step 4 to GitHub, the live site still showed the old version.
  Claude helped me read my screenshots instead of guessing. The Vercel project was connected to a different repo
  (`campus-complaints-system`, with an "s", with one "Initial commit") that Vercel had created by itself.
  My real work was in `campus-complaint-system`, without the "s".
- **What I did:** disconnected Vercel from the wrong repo, connected it to the real one, and pushed an empty commit
  to start a deploy. Then I checked on the live link that "Switch role" and "Assign technician" appear.
- **What I understood / changed:** _(write 2-3 lines here: what a Vercel project is versus a GitHub repo,
  and why the live site only updates when Vercel is connected to the repo I push to)_

## Step 5 — Rating, notifications, rounding fix (Oct 16)

- **What I asked:** the next Tier 2 features from my plan: a 5-star rating after a complaint is Resolved,
  a message to the student when the admin changes the status, and a fix for percentages adding up to 103%.
- **What Claude built:**
  - Rating: only on my own Resolved slip, only once. Choosing stars does not save; "Send rating" does, so a
    slip of the thumb on a phone cannot lock in a wrong rating. The admin sees the stars on the slip, the average
    ("4.5 / 5 from 2 ratings") and a rating column in the CSV. Stars are text (★ and ☆) with the number next to
    them, so they also work on a black-and-white printout.
  - Notifications: each status change leaves a message for the student who reported it (anonymous students too,
    because it uses the device id, never the name). The student gets a toast for 8 seconds and an "Updates" box
    with a NEW tag until "Mark all as read". The admin never sees these messages.
  - Percentages: the numbers on the category bars now always add up to exactly 100.
  - Two tabs of one browser stay in sync, so the admin tab and the student tab can be tried side by side.
- **How it was checked:** Claude ran the earlier 96 browser checks again (all still pass) and wrote new ones for
  this step: the full loop student files, admin resolves, student gets the toast, rates, admin sees the rating;
  rating once only; storage full while rating; another person's slip does not notify me; corrupt notification data
  does not break the app; Reset demo clears notifications; star buttons are 44 px; no sideways scroll at 390 px.
  Still not run with `npm run dev` in Claude's own workspace (its npm registry is blocked); I run that myself.
- **Limit I must say in the README:** notifications and ratings live in one browser. A student on a different phone
  receives nothing, because there is no backend.
- **What I understood / changed:** _(write 2-3 lines here after you try it on your computer)_

## Step 6 — Insights for the admin (Oct 17)

- **What I asked:** after rating and notifications worked on my laptop and on the live link, build the three
  insights from my plan: repeated problems, the longest-waiting complaint, and a hotspot grid by room.
- **What Claude built:**
  - "Same problem, again": if the same kind of problem is reported in the same room 3 or more times, it is listed,
    and every slip in that group shows a warning with the other slip numbers. My demo data already has this case
    (the fan in Block B, Room 204, reported three times).
  - "Waiting the longest": the Pending complaint that has waited longest, with how long. A reopened complaint waits
    from the day it went back to Pending.
  - "Where it hurts": every room of the campus as a box with its number of open complaints. The number is written
    in each box and the amber fill only adds to it, so it also works for colour-blind readers and on paper.
  - Claude made two choices on its own that I should know about: resolved complaints still count as repeats
    (a fixed fan that breaks again is the whole point), and the insights always use all complaints, not only
    the ones left after the filters.
- **How it was checked:** Claude ran all 155 earlier browser checks again (all still pass), and added 35 new browser
  checks and 39 logic checks: the demo data case, the 2-versus-3 boundary, "Washroom" in different blocks not mixed
  up, a reopened complaint, a room that is not in the campus list, an empty list, a second tab filing complaints
  while the admin tab updates by itself, print colours, and no sideways scroll at 390 px.
  Still not run with `npm run dev` in Claude's own workspace (its npm registry is blocked); I run that myself.
- **Decision still open:** the before/after photo from my plan. Claude recommends cutting it, because pictures
  take most of the browser's 5 MB storage, and a half-working photo feature is worse than none.
- **What I understood / changed:** _(write 2-3 lines here after you try it on your computer)_
