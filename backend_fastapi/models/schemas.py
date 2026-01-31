"""MongoEngine document schemas matching the Node backend collections."""
from datetime import datetime
from mongoengine import Document, StringField, BooleanField, DateTimeField, IntField, DictField
import bcrypt
from utils.jwt import JwtHandler
from datetime import timedelta
from config.settings import get_jwt_expire_minutes


class User(Document):
    email = StringField(required=True, unique=True)
    full_name = StringField(default=None)
    hashed_password = StringField(required=True)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=False)
    subscribe_events = BooleanField(default=False)  # normal users get event emails
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "users", "strict": False}

    def check_password(self, plain_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            self.hashed_password.encode("utf-8"),
        )

    def generate_token(self, payload: dict) -> str:
        minutes = get_jwt_expire_minutes()
        return JwtHandler.encode(payload, timedelta(minutes=minutes))


class Event(Document):
    title = StringField(required=True)
    description = StringField(default=None)
    date = DateTimeField(default=None)
    location = StringField(default=None)
    image_url = StringField(default=None)
    registration_link = StringField(default=None)
    event_category = StringField(default=None)
    is_published = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "events", "strict": False}


class TeamMember(Document):
    name = StringField(required=True)
    role = StringField(required=True)
    bio = StringField(default=None)
    image_url = StringField(default=None)
    social_links = DictField(default=None)
    order = IntField(default=0)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "team_members", "strict": False}


class GalleryImage(Document):
    title = StringField(default=None)
    description = StringField(default=None)
    image_url = StringField(required=True)
    category = StringField(default=None)
    event_category = StringField(default=None)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "gallery_images", "strict": False}


class SiteConfig(Document):
    site_title = StringField(default="HICA")
    hero_title = StringField(default="Welcome to HICA")
    hero_subtitle = StringField(default="Empowering innovation and collaboration.")
    about_text = StringField(default="About HICA...")
    contact_email = StringField(default="info@example.com")
    recruitment_title = StringField(default=None)
    recruitment_subtitle = StringField(default=None)
    recruitment_form_url = StringField(default=None)
    recruitment_deadline = StringField(default=None)
    recruitment_message = StringField(default=None)
    show_recruitment = BooleanField(default=False)
    team_intro_video_url = StringField(default=None)
    social_links = DictField(default=None)

    meta = {"collection": "site_config", "strict": False}
