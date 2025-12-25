# Alumni Management System

A full-stack alumni engagement platform that combines community conversations, mentorship matching, event management, and career resources in one experience for students and alumni.

---

## Screenshots

> ℹ️ Drop your own captures in `public/screenshots/` and update the paths below.

| Section | Preview |
|---------|---------|
| Landing & Hero | `![Landing](./public/screenshots/landing.png)` |
| Mentorship Dashboard | `![Mentorship](./public/screenshots/mentorship.png)` |
| Events Hub | `![Events](./public/screenshots/events.png)` |
| Profile & Career Tools | `![Profile](./public/screenshots/profile.png)` |

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Data Flow & Journey Diagrams](#data-flow--journey-diagrams)
	- [Account Creation & Verification](#account-creation--verification)
	- [Mentorship Match Lifecycle](#mentorship-match-lifecycle)
	- [Event Registration Funnel](#event-registration-funnel)
4. [Tech Stack](#tech-stack)
5. [Features](#features)
6. [Setup Instructions](#setup-instructions)
	- [Environment Variables](#environment-variables)
	- [Frontend](#frontend)
	- [Backend](#backend)
	- [Verification Email Test](#verification-email-test)
7. [API Surface](#api-surface)
8. [Database Schema](#database-schema)
9. [Authentication & Access Control](#authentication--access-control)
10. [Folder Structure](#folder-structure)
11. [Roadmap & Contributions](#roadmap--contributions)
12. [License](#license)

---

## Project Overview

The **Alumni Management System** helps universities keep alumni engaged and gives current students access to mentors, events, and curated resources.

**Core goals**
- Maintain a directory of alumni, mentors, and students with rich profiles.
- Facilitate structured mentorship requests with availability and capacity controls.
- Run community features: posts, notifications, and secure messaging.
- Manage events with attendee registration and self-service history.
- Offer email-verified authentication with role-aware interfaces.

---

## Architecture

- **Frontend**: Vite + React + TypeScript, styled with Tailwind CSS and shadcn/ui, state handled via React Context + React Query.
- **Backend**: Node.js + Express REST API with MongoDB models and JWT auth.
- **Database**: MongoDB (local or Atlas).
- **Email**: Nodemailer SMTP integration for verification, mentorship, and notification emails.

```
[Browser]
	│ React SPA (Vite)
	▼
[Axios Client]
	│ REST/JSON
	▼
[Express API]
	│ JWT Auth + Validation
	│
	├── MongoDB Atlas / Local
	└── Nodemailer SMTP
```

---

## Data Flow & Journey Diagrams

### Account Creation & Verification

```
User → Register Form → POST /api/auth/register
		→ User saved with verification token
		→ Nodemailer sends verify link (FRONTEND_URL/verify-email/:token)

User clicks link → React VerifyEmail page → GET /api/auth/verify-email/:token
		→ Backend validates token, marks isEmailVerified, returns JWT
		→ Frontend stores token + user, auto-redirects home
```

### Mentorship Match Lifecycle

```
Mentee browses mentors → Opens request modal
	 └─ POST /api/mentorship/request
			• Checks availability/capacity
			• Scores match via expertise & goals
			• Creates notification + email to mentor

Mentor decisions → PUT /api/mentorship/:id/status
	 ├─ accepted → increments activeMentees, notifies mentee, emails acceptance
	 └─ rejected → stores reason, notifies mentee, emails status

Active mentors can schedule sessions or conclude matches (future scope)
```

### Event Registration Funnel

```
Events page → selects event → EventRegistrationModal
	 └─ POST /api/events/:id/register (auth required)
			• Prevents duplicate registrations
			• Stores attendee details inside event doc
			• Returns updated attendee list

Profile → "My Events" → GET /api/events/user/registered
```

---

## Tech Stack

**Frontend**
- React 18, Vite, TypeScript
- Tailwind CSS, shadcn/ui, Radix UI primitives
- React Router v6, React Query, Zod, React Hook Form, Recharts

**Backend**
- Node.js, Express, MongoDB with Mongoose
- JWT for auth, bcryptjs for hashing, express-validator, cors, helmet (via middleware), Nodemailer

**Tooling**
- ESLint, TypeScript, PostCSS, Tailwind CLI
- Nodemon for backend dev, npm scripts for workflows

---

## Features

- ✅ **Secure auth with email verification** and JWT sessions.
- 👥 **Role-aware profiles** (alumni, mentors, students, admins).
- 🤝 **Mentorship matchmaking** with availability, capacity, scoring, and email notifications.
- 💬 **Community posts** with likes, threaded replies, and modal detail view.
- 🗓️ **Event management** (browse, register, create) with attendee tracking.
- 📬 **Notification center** for mentorship updates and system alerts.
- 💌 **Email service** for verification, mentorship requests, approvals, and schedule reminders.
- 🔐 **Protected routes** on the frontend with graceful prompts in the Auth modal.
- 📱 **Responsive UI** with animated hero, testimonials, stats, and mobile navigation.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm (bundled) or pnpm
- MongoDB (local `mongodb://localhost:27017` or Atlas connection string)
- SMTP credentials (Gmail App Password recommended)

### Environment Variables

Create `.env` files at project root (frontend) and in `backend/`.

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Alumni Management System
```

**Backend `.env`** *(already scaffolded)*
```
MONGODB_URI=mongodb://localhost:27017/alumni-network
JWT_SECRET=change_me
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# Email (example using Gmail SMTP + App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-google-app-password
EMAIL_FROM="Alumni Network" <your-email@gmail.com>
```

### Frontend
```bash
git clone https://github.com/tripathi-khushi/Alumni-Network.git
cd "Alumni Management System"
npm install
npm run dev # serves on http://localhost:8080
```

### Backend
```bash
cd backend
npm install
npm run dev   # nodemon dev server
# or npm start for production mode
```

### Verification Email Test

1. Ensure `.env` contains valid SMTP credentials.
2. Register with a new email from the frontend.
3. Check inbox (or terminal logs if using a dev SMTP like Ethereal) for the verify link.
4. Verification hits `/verify-email/:token`, marks `isEmailVerified`, and logs you in.

---

## API Surface

`/api/auth`
- `POST /register` – create user, send email verification
- `GET /verify-email/:token` – confirm address and issue JWT
- `POST /login` – email/password login, blocked until verified
- `GET /me` – current profile (auth)
- `PUT /profile` – update profile & expertise
- `POST /logout` – client wipes token
- `POST /resend-verification` – re-issue verification link

`/api/events`
- `GET /` – list events
- `GET /:id` – event detail
- `POST /:id/register` – register for event (auth)
- `GET /user/registered` – events current user joined
- `POST /` – create event (authorized users/admins)

`/api/mentorship`
- `GET /` – mentorship requests involving the user
- `POST /request` – submit new mentor request
- `PUT /:id/status` – mentor accept/reject with optional reason
- Additional routes handle availability, chat, and session scheduling where implemented

`/api/posts`
- CRUD operations for community posts, likes, replies

`/api/notifications`
- Fetch & manage in-app notifications

`/api/messages`
- Supports private messaging threads and mentorship chat hand-off

All endpoints use JWT Bearer tokens via the `Authorization` header.

---

## Database Schema

### User
```
name, email, password, role
batch, phone, bio, company, position
expertise[], mentorshipPreferences{}, availability{}
isEmailVerified, emailVerificationToken, emailVerificationExpires
mentorCapacity, activeMentees, isMentorAvailable
createdAt
```

### Mentorship
```
mentorId, menteeId, menteeName/email
goals, message, matchScore
status (pending/accepted/rejected/completed)
acceptedAt, updatedAt, rejectionReason, session tracking
```

### Event
```
title, description, date, time, location, category
attendees[{ user, name, email, phone, attendeeCount, registeredAt }]
createdAt
```

### Post & Message
```
Post: author, title, content, category, likes[], replies[]
Message: conversationId, participants[], sender, content, readAt
```

### Notification
```
userId, type, title, message, relatedId, relatedModel, isRead, createdAt
```

---

## Authentication & Access Control

### Frontend Flow

```
AuthModal
  ├─ Login: calls login(), saves token + user via AuthContext
  └─ Register: creates account, shows "Check your email" panel

VerifyEmail page
  └─ GET /verify-email/:token → persists token + user using setToken/setUser

ProtectedRoute
  └─ Renders children if token present, otherwise shows modal prompt
```

### Legacy Accounts

Users created before email verification can be upgraded manually:
```
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: "", emailVerificationExpires: "" } }
)
```

---

## Folder Structure

```
Alumni Management System/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── services/emailService.js
│   ├── middleware/auth.js
│   ├── seed*.js (seed scripts)
│   ├── server.js
│   └── package.json
├── public/
│   └── placeholder.svg
├── src/
│   ├── components/
│   │   ├── AuthModal.tsx, MentorshipChat.tsx, EventRegistrationModal.tsx, ...
│   ├── contexts/AuthContext.tsx
│   ├── hooks/
│   ├── lib/api.ts, utils.ts
│   ├── pages/Index.tsx, Events.tsx, Mentorship.tsx, Members.tsx, Profile.tsx, ...
│   ├── services/authService.ts
│   └── App.tsx, main.tsx
├── package.json
├── README.md
└── tsconfig*.json
```

---

## Roadmap & Contributions

- [ ] Real-time messaging with WebSocket integration
- [ ] Admin analytics dashboard for engagement stats
- [ ] Calendar sync for mentorship sessions and events
- [ ] Bulk alumni import via CSV
- [ ] Mobile push notifications

**Contributing**
1. Fork the repo and create a feature branch.
2. Run `npm run lint` (frontend) and `npm test` if tests exist.
3. Open a PR describing your change.

---

## License

MIT License © Khushi Tripathi
