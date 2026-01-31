"""Auth routes: login (admin + user), register (subscribe for event emails)."""
from fastapi import APIRouter, Form, HTTPException
from models.dto import LoginRequest, LoginResponse, RegisterRequest
from services.auth_service import login as auth_login, register as auth_register

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(
    username: str = Form(..., description="Email (sent as 'username' for compatibility)"),
    password: str = Form(...),
):
    """Login for admin or normal user. Admin is redirected to admin panel; user gets event emails."""
    email = username.strip().lower()
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return auth_login(LoginRequest(email=email, password=password))


@router.post("/register")
async def register(data: RegisterRequest):
    """Register as normal user (subscriber). You will receive emails about new events."""
    return auth_register(data)
