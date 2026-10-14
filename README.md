# Repair Slip — Campus Electronic Complaint Management System

> DRAFT. The full README (screenshots, live link, features) is written on the last day.

Students report broken things on campus (computers, projectors, fans, lights, Wi-Fi and more).
Every complaint is a paper "repair slip" with a status stamp: Pending, In Progress, Resolved.

## Run it on your computer

You need Node.js (LTS version) from https://nodejs.org

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Demo access

- Student: type a name (or nothing) and press "Continue as Student".
- Admin: press "I am an admin" and enter the passcode `campus123`.

## Honest limits

- The data is saved in your browser (localStorage). There is no server, so a student on one phone and an
  admin on another computer do NOT see each other's complaints.
- The admin passcode is a demo gate, not real security. A real version would use proper login
  (for example Supabase auth).
- "Anonymous" hides the name in the screens, but the data is still in the same browser. Real anonymity needs a backend.
- Use "Reset demo" on the admin screen to bring back the sample complaints.

## How AI was used

See `CLAUDE_CODE_LOG.md`.
