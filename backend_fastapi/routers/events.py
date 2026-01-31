"""Events CRUD. Admin-only for create/update/delete. New events trigger email to subscribers."""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from bson import ObjectId
from models.schemas import Event
from models.dto import EventCreate, EventUpdate
from utils.auth_deps import require_admin
from services.email_service import send_event_notification_emails
from utils.serialize import doc_to_dict

router = APIRouter()


def _event_to_dict(e):
    return doc_to_dict(e) or {}


@router.get("/")
async def get_events():
    events = Event.objects.order_by("-date")
    return [_event_to_dict(e) for e in events]


def _parse_date(s):
    if not s:
        return None
    from datetime import datetime
    s = str(s).strip().replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        return None


@router.post("/", dependencies=[Depends(require_admin)])
async def create_event(data: EventCreate, background_tasks: BackgroundTasks):
    event = Event(
        title=data.title,
        description=data.description,
        date=_parse_date(data.date),
        location=data.location,
        image_url=data.image_url,
        registration_link=data.registration_link,
        event_category=data.event_category,
        is_published=data.is_published,
    )
    event.save()
    # Send emails to subscribed users in background
    background_tasks.add_task(
        send_event_notification_emails,
        data.title,
        data.description or "",
    )
    return _event_to_dict(event)


@router.put("/{event_id}", dependencies=[Depends(require_admin)])
async def update_event(event_id: str, data: EventUpdate):
    try:
        event = Event.objects(id=ObjectId(event_id)).first()
    except Exception:
        event = None
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    updates = data.dict(exclude_unset=True)
    if "date" in updates and updates["date"]:
        updates["date"] = _parse_date(updates["date"])
    event.update(**updates)
    event.reload()
    return _event_to_dict(event)


@router.delete("/{event_id}", dependencies=[Depends(require_admin)])
async def delete_event(event_id: str):
    try:
        event = Event.objects(id=ObjectId(event_id)).first()
    except Exception:
        event = None
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.delete()
    return {"detail": "Deleted"}
