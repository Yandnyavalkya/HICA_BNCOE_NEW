"""JWT encode/decode utilities."""
from typing import Optional
from datetime import datetime, timedelta
import jwt
from config.settings import get_jwt_secret, get_jwt_algo


class JwtHandler:
    @staticmethod
    def encode(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            to_encode["exp"] = datetime.utcnow() + expires_delta
        return jwt.encode(
            to_encode,
            get_jwt_secret(),
            algorithm=get_jwt_algo(),
        )

    @staticmethod
    def decode(token: str) -> dict:
        try:
            return jwt.decode(
                token,
                get_jwt_secret(),
                algorithms=[get_jwt_algo()],
            )
        except jwt.ExpiredSignatureError:
            return {"message": "Token is Expired"}
        except jwt.PyJWTError:
            return {"message": "Invalid Token"}
