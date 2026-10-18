# Repair Slip: Campus Complaint Management System

A web app where students report broken equipment on campus and the admin tracks every complaint until it is fixed.
Each complaint is a paper-style repair slip with a stamped status: Pending, In Progress or Resolved.

**Live demo:** https://campus-complaints-system.vercel.app

**Demo access**
- Student: press "Continue as Student" (a name is optional).
- Admin: press "I am an admin" and enter the passcode `campus123`.

## Features

**Students**
- Report computer, projector, fan, light and Wi-Fi problems, plus air conditioner, facilities and washroom issues.
- Choose the block and room from dropdowns, set the urgency, and attach up to 3 photos.
- Report anonymously. The slip still appears under "My complaints" on the same device.
- Follow each complaint on a status timeline, get a message when the status changes, and rate the repair from 1 to 5 stars once it is resolved.

**Admin**
- Passcode-protected dashboard with every complaint.
- Statistics: totals by status, complaints by category, and the average repair rating.
- Filter by status, category and urgency.
- Change the status and assign a technician on each slip. Every change is kept in the slip's history.
- Download a CSV report or print the dashboard as a report.
- Insights: problems reported 3 or more times in the same room, the complaint that has been Pending the longest, and open complaints per room.

## Tech stack

React 18, Vite, Tailwind CSS v4. Data is stored in the browser's localStorage. Deployed on Vercel.

## Run locally

Requires Node.js (LTS).

```bash
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173). `npm run build` creates the production build.

## Limitations

- There is no backend. Data is stored in each browser, so a student on one device and an admin on another do not see each other's complaints. Messages and ratings are also per browser.
- "My complaints" is linked to the device, not to the name, so students sharing one computer see each other's complaints.
- Browser storage is about 5 MB. Photos are resized before saving. If storage is full, the complaint is saved without its photos and the student is told.
- The admin passcode is a demo gate, not real security. A production version needs proper authentication.
- Anonymous reports hide the name on screen and in the CSV, but the data is still stored in the same browser.
- Not included: a Kanban board, admin-defined categories and a backend.

## AI usage

This project was built with the help of Claude, Anthropic's AI assistant. I planned the features and the design, made the decisions (for example the Repair Slip design, no sign-up for students, and leaving out a before/after repair photo), ran the app on my computer, and reported what I found. Claude wrote the code in steps. The step-by-step record of what I asked and what I decided is in [`AI_USAGE_LOG.md`](AI_USAGE_LOG.md). The plan is in [`PLAN.md`](PLAN.md).
