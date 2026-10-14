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
