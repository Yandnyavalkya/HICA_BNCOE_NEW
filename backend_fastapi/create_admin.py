"""Create admin user. Run: python create_admin.py"""
import os
from dotenv import load_dotenv
load_dotenv()

from config.mongodb import init_db
from models.schemas import User
from utils.security import hash_password


def main():
    init_db()
    admin_email = os.getenv("ADMIN_EMAIL", "admin@hica.com").lower().strip()
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    if User.objects(email=admin_email).first():
        print(f"Admin with email {admin_email} already exists.")
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
    print("Admin created successfully.")
    print(f"  Email: {admin_email}")
    print(f"  Password: {admin_password}")


if __name__ == "__main__":
    main()
