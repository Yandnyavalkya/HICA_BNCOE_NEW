"""Global exception handler middleware."""
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse


class CustomExceptionHandler(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            print("-----Exception Handler-----", e)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error"},
            )
