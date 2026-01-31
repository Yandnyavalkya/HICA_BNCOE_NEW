# HICA FastAPI Backend

Python FastAPI backend for the HICA frontend. Replaces the Node backend with the same API contract.

## Features

- **Auth**: Login for **admin** (redirect to admin panel) and **normal user** (subscribed to event emails).
- **Admin login**: Email + password → JWT + `role: "admin"` → frontend redirects to `/admin`.
- **User login**: Email + password → JWT + `role: "user"` → frontend shows "You're subscribed to event updates."
- **Register**: `POST /auth/register` (email, password, full_name) creates a user with `subscribe_events=True`. When new events are created, these users receive an email (if SMTP is configured).
- **Events, Team, Gallery, Config**: Same endpoints as the Node backend; frontend works unchanged.

## Setup

1. **Python 3.9+** and virtualenv recommended.

2. **Copy env and install**:
   ```bash
   cd backend_fastapi
   cp .env.example .env
   # Edit .env: set MONGODB_URI, JWT_SECRET, optional SMTP and Cloudinary
   pip install -r requirements.txt
   ```

3. **Create admin** (or let startup create it):
   ```bash
   python create_admin.py
   ```

4. **Run** (local):
   ```bash
   python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```
   Or use `run.bat` on Windows.

5. **Seed DB** (optional):
   ```bash
   python seed_all.py
   ```

## Deploy on Render

Root `render.yaml` defines this service with `rootDir: backend_fastapi`. Production start:

```bash
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
```

See [RENDER_DEPLOYMENT.md](../RENDER_DEPLOYMENT.md) for env vars and CORS.

## Environment

- `MONGODB_URI`, `MONGODB_DB_NAME` – same as Node backend (can reuse DB).
- `JWT_SECRET`, `JWT_ALGO`, `JWT_EXPIRE_MINUTES` – JWT for auth.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` – default admin (created on first run).
- `FRONTEND_ORIGINS` – CORS (e.g. `http://localhost:5173`).
- **Optional**: `CLOUDINARY_*` for gallery image uploads.
- **Optional**: `SMTP_*`, `EMAIL_FROM` for sending event notification emails to subscribed users.

## API (aligned with Node)

- `POST /auth/login` – form: `username` (email), `password`. Returns `access_token`, `token_type`, `role` (`admin` | `user`).
- `POST /auth/register` – JSON: `email`, `password`, `full_name?`. Subscribes user to event emails.
- `GET/POST/PUT/DELETE /events`, `/team`, `/gallery`, `/config` – same as Node (admin-only for write; Bearer token required).

## Frontend

Point the frontend API base URL to this backend (e.g. `VITE_API_BASE_URL=http://localhost:8000`). Admin login redirects to `/admin` when `role === 'admin'`; normal users get a success message and redirect home.
