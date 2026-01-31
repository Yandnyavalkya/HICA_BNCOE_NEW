"""Pydantic DTOs for request/response."""
from pydantic import BaseModel
from typing import Optional, List


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str  # "admin" | "user"


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


# Event
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    registration_link: Optional[str] = None
    event_category: Optional[str] = None
    is_published: bool = True


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    registration_link: Optional[str] = None
    event_category: Optional[str] = None
    is_published: Optional[bool] = None


# Team member
class TeamMemberCreate(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    social_links: Optional[dict] = None
    order: int = 0


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    social_links: Optional[dict] = None
    order: Optional[int] = None


# Gallery
class GalleryImageCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_category: Optional[str] = None
    image_url: Optional[str] = None


class GalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_category: Optional[str] = None
    image_url: Optional[str] = None


# Site config
class SiteConfigUpdate(BaseModel):
    site_title: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    about_text: Optional[str] = None
    contact_email: Optional[str] = None
    recruitment_title: Optional[str] = None
    recruitment_subtitle: Optional[str] = None
    recruitment_form_url: Optional[str] = None
    recruitment_deadline: Optional[str] = None
    recruitment_message: Optional[str] = None
    show_recruitment: Optional[bool] = None
    team_intro_video_url: Optional[str] = None
    social_links: Optional[dict] = None
    site_name: Optional[str] = None
    site_description: Optional[str] = None
