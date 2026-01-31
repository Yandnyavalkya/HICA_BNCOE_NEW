"""Team members CRUD. Admin-only for create/update/delete."""
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from models.schemas import TeamMember
from models.dto import TeamMemberCreate, TeamMemberUpdate
from utils.auth_deps import require_admin
from utils.serialize import doc_to_dict

router = APIRouter()


def _member_to_dict(m):
    return doc_to_dict(m) or {}


@router.get("/")
async def get_team():
    members = TeamMember.objects.order_by("order")
    return [_member_to_dict(m) for m in members]


@router.post("/", dependencies=[Depends(require_admin)])
async def create_member(data: TeamMemberCreate):
    member = TeamMember(
        name=data.name,
        role=data.role,
        bio=data.bio,
        image_url=data.image_url,
        social_links=data.social_links,
        order=data.order,
    )
    member.save()
    return _member_to_dict(member)


@router.put("/{member_id}", dependencies=[Depends(require_admin)])
async def update_member(member_id: str, data: TeamMemberUpdate):
    try:
        member = TeamMember.objects(id=ObjectId(member_id)).first()
    except Exception:
        member = None
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    updates = data.dict(exclude_unset=True)
    member.update(**updates)
    member.reload()
    return _member_to_dict(member)


@router.delete("/{member_id}", dependencies=[Depends(require_admin)])
async def delete_member(member_id: str):
    try:
        member = TeamMember.objects(id=ObjectId(member_id)).first()
    except Exception:
        member = None
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    member.delete()
    return {"detail": "Deleted"}
