"""HICA FastAPI backend. Auth (admin + user), events, team, gallery, config. Event emails to subscribers."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.mongodb import init_db
from config.settings import get_frontend_origins
from utils.exception import CustomExceptionHandler
from utils.helper import create_admin_user
from routers import auth, events, team, gallery, config

app = FastAPI(
    title="HICA API",
    description="Backend for HICA frontend. Admin and user login; event emails to subscribers.",
    version="1.0.0",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_frontend_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(CustomExceptionHandler)


@app.on_event("startup")
async def startup_event():
    try:
        init_db()
        create_admin_user()
    except Exception as e:
        print(f"⚠️  Warning: Could not initialize database on startup: {e}")
        print("   The application will continue, but database operations may fail.")


@app.get("/")
async def root():
    return {"message": "HICA Backend API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "HICA"}


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(events.router, prefix="/events", tags=["Events"])
app.include_router(team.router, prefix="/team", tags=["Team"])
app.include_router(gallery.router, prefix="/gallery", tags=["Gallery"])
app.include_router(config.router, prefix="/config", tags=["Config"])
