# Deployment Guide

HICA now uses **FastAPI (Python)** for the backend. For deploying to Render, see:

**[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

It covers:

- One-click deploy from the root `render.yaml` (backend + frontend)
- Environment variables for API and web
- CORS and `VITE_API_BASE_URL` after first deploy
- MongoDB Atlas and optional Cloudinary/SMTP

For local setup, see [README.md](./README.md).
