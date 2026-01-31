"""Application settings from environment."""
import os
from dotenv import load_dotenv

load_dotenv()


def get_mongodb_uri() -> str:
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/hica")
    return uri.rstrip("/").strip('"').strip("'")


def get_db_name() -> str:
    return os.getenv("MONGODB_DB_NAME", "hica")


def get_jwt_secret() -> str:
    return os.getenv("JWT_SECRET", "CHANGE_ME_SUPER_SECRET")


def get_jwt_algo() -> str:
    return os.getenv("JWT_ALGO", "HS256")


def get_jwt_expire_minutes() -> int:
    try:
        return int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))
    except ValueError:
        return 1440


def get_frontend_origins() -> list:
    origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
    return [o.strip() for o in origins.split(",")]


def get_smtp_settings():
    """SMTP settings for sending event notification emails."""
    return {
        "host": os.getenv("SMTP_HOST", ""),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASSWORD", ""),
        "from_email": os.getenv("EMAIL_FROM", "noreply@hica.com"),
        "use_tls": os.getenv("SMTP_USE_TLS", "true").lower() == "true",
    }


def get_cloudinary_settings():
    return {
        "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.getenv("CLOUDINARY_API_KEY"),
        "api_secret": os.getenv("CLOUDINARY_API_SECRET"),
    }
