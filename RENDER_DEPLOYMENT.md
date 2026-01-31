# Deploy HICA on Render

This project uses **backend_fastapi** (Python/FastAPI) and **frontend** (Vite/React). The root `render.yaml` defines both services.

## 1. One-click from repo

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your repo and select the HICA repo.
3. Render will read `render.yaml` and create:
   - **hica-api** (Python web service, rootDir: `backend_fastapi`)
   - **hica-web** (Node static site, rootDir: `frontend`)

## 2. Environment variables

Set these in **Render Dashboard** for each service.

### Backend (hica-api)

| Key | Required | Example |
|-----|----------|--------|
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB_NAME` | No | `hica` (default) |
| `JWT_SECRET` | Yes | Long random string |
| `JWT_ALGO` | No | `HS256` |
| `JWT_EXPIRE_MINUTES` | No | `1440` |
| `FRONTEND_ORIGINS` | Yes | `https://hica-web.onrender.com` (your frontend URL) |
| `ADMIN_EMAIL` | No | Admin login email |
| `ADMIN_PASSWORD` | No | Admin password |
| `CLOUDINARY_CLOUD_NAME` | For gallery uploads | |
| `CLOUDINARY_API_KEY` | For gallery uploads | |
| `CLOUDINARY_API_SECRET` | For gallery uploads | |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | For event emails | Optional |

### Frontend (hica-web)

| Key | Required | Example |
|-----|----------|--------|
| `VITE_API_BASE_URL` | Yes | `https://hica-api.onrender.com` (your backend URL) |

Set `VITE_API_BASE_URL` **before** the first build; Vite bakes it in at build time.

## 3. After first deploy

1. **Backend URL**: Note the URL Render gives the API (e.g. `https://hica-api.onrender.com`).
2. **Frontend**: In **hica-web** → Environment, set `VITE_API_BASE_URL` to that URL, then **Manual Deploy** → **Clear build cache & deploy**.
3. **CORS**: In **hica-api** → Environment, set `FRONTEND_ORIGINS` to your frontend URL (e.g. `https://hica-web.onrender.com`).
4. **MongoDB**: Use MongoDB Atlas and add `0.0.0.0/0` in Network Access (or Render’s outbound IPs) so the API can connect.
5. **Seed data** (optional): After backend is live, run locally once with the same `MONGODB_URI`:
   ```bash
   cd backend_fastapi && python seed_all.py
   ```

## 4. Project structure (deployment)

```
HICA/
├── render.yaml           # Render blueprint (both services)
├── backend_fastapi/      # API (Python)
│   ├── app.py
│   ├── requirements.txt
│   ├── config/, models/, routers/, services/, utils/
│   └── seed_all.py       # Optional: seed DB
└── frontend/             # Web app (Vite/React)
    ├── package.json
    └── src/
```

Backend start command (in `render.yaml`):

```bash
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT
```

Frontend build + serve:

```bash
npm install && npm run build
npx serve -s dist -l $PORT
```
