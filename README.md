# Event Management System

A full-stack web application for creating and managing events.

**Live Demo → [events-frontend-xu55.onrender.com](https://events-frontend-xu55.onrender.com)**

> First load may take ~30 seconds (free tier spin-up)

**Test credentials:**
- `alice@example.com` / `password123`
- `bob@example.com` / `password123`

---

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS, React Router v7, React Hook Form + Yup, React Big Calendar

**Backend** — NestJS, TypeScript, Passport.js + JWT, TypeORM

**Database** — PostgreSQL (Neon)

**Infrastructure** — Docker, deployed on Render

---

## Features

- JWT authentication (register / login)
- Create, edit, and delete events (organizer only)
- Public and private event visibility
- Join / leave events with capacity enforcement
- "Full" badge when event capacity is reached
- Participant list on event detail page
- Monthly / weekly calendar view of your events
- Delete confirmation modal
- Inline form validation with Yup
- Swagger API docs at `/api/docs`

---

## Getting Started

### One-command local setup

```bash
docker-compose up
```

Starts the database, backend on port 3000, and frontend on port 5173.

### Manual setup

**Prerequisites:** Node.js 20+, PostgreSQL 15

```bash
# 1. Start database
docker-compose up db

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run start:dev

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

### Seed the database

```bash
cd backend
npm run seed
```

Creates 2 users (`alice@example.com`, `bob@example.com`) and 3 public events, both with password `password123`.

---

## Environment Variables

**Backend** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full Postgres connection string |
| `JWT_SECRET` | Secret key for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry, e.g. `3600s` |
| `FRONTEND_URL` | Allowed CORS origin |

**Frontend** (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## API

Full API documentation available at `/api/docs` (Swagger UI).

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/events` | List all public events |
| POST | `/events` | Create an event |
| GET | `/events/:id` | Get event details |
| PATCH | `/events/:id` | Update event (organizer only) |
| DELETE | `/events/:id` | Delete event (organizer only) |
| POST | `/events/:id/join` | Join an event |
| POST | `/events/:id/leave` | Leave an event |
| GET | `/events/users/me/events` | Get current user's events |