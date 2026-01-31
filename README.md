# HICA

Full-stack app for HICA BNCOE: team, events, gallery, and site config. **Backend:** FastAPI (Python). **Frontend:** React (TypeScript, Vite, Tailwind).

## Structure

```
HICA/
├── backend_fastapi/     # API (Python/FastAPI, MongoEngine)
│   ├── app.py
│   ├── requirements.txt
│   ├── config/          # Settings, MongoDB
│   ├── models/          # Schemas, DTOs
│   ├── routers/         # auth, events, team, gallery, config
│   ├── services/        # auth, email
│   ├── utils/           # JWT, security, serialize
│   ├── seed_all.py      # Seed DB (admin, events, team, config)
│   └── create_admin.py
├── frontend/            # React (Vite, TypeScript, Tailwind)
│   ├── src/
│   │   ├── pages/       # Home, Events, Gallery, Team, About, Admin
│   │   ├── components/
│   │   └── services/    # api.ts
│   └── package.json
├── render.yaml          # Render blueprint (backend + frontend)
└── README.md
```

## Local setup

### Backend

```bash
cd backend_fastapi
cp .env.example .env   # Edit: MONGODB_URI, JWT_SECRET, etc.
pip install -r requirements.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Optional: seed DB with `python seed_all.py`.

### Frontend

```bash
cd frontend
npm install
# Optional: .env with VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Runs at `http://localhost:5173`.

## Deploy on Render

See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for:

- Using the root `render.yaml` (backend + frontend)
- Environment variables for API and web
- CORS and `VITE_API_BASE_URL` after first deploy

## API (summary)

- **Auth:** `POST /auth/login` (form: username, password) → `access_token`, `role` (admin | user). `POST /auth/register` for subscribers.
- **Public:** `GET /events`, `GET /team`, `GET /gallery`, `GET /config`.
- **Admin (Bearer):** `POST/PUT/DELETE` on `/events`, `/team`, `/gallery`, `/config`.

## Tech stack

- **Backend:** FastAPI, MongoEngine, PyJWT, bcrypt, Cloudinary (optional), SMTP (optional for event emails).
- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS.
