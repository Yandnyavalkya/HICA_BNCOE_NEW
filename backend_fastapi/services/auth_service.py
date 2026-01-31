"""Auth service: login for admin and normal user, register for subscribers."""
from fastapi import HTTPException
from models.schemas import User
from models.dto import LoginRequest, LoginResponse, RegisterRequest
from utils.security import hash_password


def login(data: LoginRequest) -> LoginResponse:
    email = data.email.lower().strip()
    user = User.objects(email=email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is inactive")
    if not user.check_password(data.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    token = user.generate_token({"sub": user.email, "email": user.email})
    role = "admin" if user.is_admin else "user"
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        role=role,
    )


def register(data: RegisterRequest) -> dict:
    email = data.email.lower().strip()
    existing = User.objects(email=email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = User(
        email=email,
        full_name=data.full_name or None,
        hashed_password=hash_password(data.password),
        is_active=True,
        is_admin=False,
        subscribe_events=True,
    )
    user.save()
    return {"message": "Registered successfully. You will receive event updates at your email."}
