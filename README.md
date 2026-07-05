# InterviewOS

Your personal operating system for coding interview preparation.

## Project Structure

```
dashboard/
├── frontend/          # React + TypeScript + Vite + Tailwind
└── backend/           # FastAPI + Python + PostgreSQL
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+

---

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API runs at http://localhost:8000
Interactive docs at http://localhost:8000/api/docs

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `AUTH_SECRET` | JWT signing secret (long random string) |
| `CORS_ALLOWED_ORIGINS` | JSON array of allowed origins |
| `DEBUG` | Enable debug mode |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (default: `/api`) |

---

## Development Commands

### Frontend

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
```

### Backend

```bash
uvicorn app.main:app --reload           # Start dev server
alembic revision --autogenerate -m ""   # Generate migration
alembic upgrade head                    # Apply migrations
alembic downgrade -1                    # Rollback last migration
pytest                                  # Run tests
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion |
| State | TanStack Query, React Router |
| Backend | FastAPI, Python, Pydantic |
| ORM | SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT (Clerk or Auth.js in production) |
| Deploy | Vercel (frontend), Railway/Render (backend), Neon (database) |

---

## Roadmap

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the full product specification.
