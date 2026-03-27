# Event Management System

A full-stack web application for creating and managing events. Users can register, create public or private events, join events with capacity limits, and view their schedule on a calendar.

## Tech Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS, React Router v7, React Big Calendar, React Hook Form + Yup

**Backend** — NestJS, TypeScript, Passport.js + JWT, TypeORM

**Database** — PostgreSQL 15

**Infrastructure** — Docker, Docker Compose, deployed on Render

## Features

- JWT authentication (register / login)
- Create, edit, and delete events (organizer only)
- Public and private event visibility
- Join / leave events with capacity enforcement
- Monthly / weekly calendar view of your events

## Getting Started

### One-command local setup (Docker)

```bash
docker-compose up
```

This starts the database, backend (port 3000), and frontend (port 5173).

### Manual setup

**Prerequisites:** Node.js 20+, PostgreSQL 15

```bash
# Start database
docker-compose up db

# Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run start:dev

# Frontend (new terminal)
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend API: http://localhost:3000

## Environment Variables

**Backend** (`backend/.env`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full Postgres connection string (production) |
| `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` / `DB_NAME` | Individual DB config (local dev) |
| `JWT_SECRET` | Secret key for signing tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `3600s`) |
| `FRONTEND_URL` | Allowed CORS origin |

**Frontend** (`frontend/.env`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## Deployment (Render)

1. Create a **PostgreSQL** database on Render — copy the `DATABASE_URL`
2. Create a **Web Service** for the backend — set root dir to `backend`, use the Dockerfile, add env vars
3. Create a **Static Site** for the frontend — set root dir to `frontend`, build command `npm run build`, publish dir `dist`, set `VITE_API_URL` to your backend URL