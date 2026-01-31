"""FastAPI dependencies for JWT auth and admin-only routes."""
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt import JwtHandler
from models.schemas import User

security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    token = credentials.credentials
    decoded = JwtHandler.decode(token)
    if "message" in decoded:
        raise HTTPException(status_code=401, detail=decoded["message"])
    email = decoded.get("sub") or decoded.get("email")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = User.objects(email=email.lower()).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is inactive")
    request.state.user = user
    return user


async def require_admin(
    user=Depends(get_current_user),
):
    if not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Admin privileges required.",
        )
    return user
