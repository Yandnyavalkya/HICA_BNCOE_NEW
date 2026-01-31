"""Helper: create default admin user on startup."""
from models.schemas import User
from utils.security import hash_password
from config.settings import get_jwt_secret
import os
from dotenv import load_dotenv
load_dotenv()


def create_admin_user():
    """Create admin user if none exists (same as Node seed_admin)."""
    try:
        admin_email = os.getenv("ADMIN_EMAIL", "admin@hica.com").lower().strip()
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        existing = User.objects(email=admin_email).first()
        if existing:
            print(f"✓ Admin already exists: {admin_email}")
            return
        admin = User(
            email=admin_email,
            full_name="Admin User",
            hashed_password=hash_password(admin_password),
            is_active=True,
            is_admin=True,
            subscribe_events=False,
        )
        admin.save()
        print("✓ Admin user created successfully.")
        print(f"  Email: {admin_email}")
        print(f"  Password: {admin_password}")
    except Exception as e:
        print(f"⚠️  Warning: Could not create admin: {e}")
        print("   Run: python create_admin.py")
