"""Site config. Single document. Admin-only for create/update."""
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from models.schemas import SiteConfig
from models.dto import SiteConfigUpdate
from utils.auth_deps import require_admin
from utils.serialize import doc_to_dict

router = APIRouter()


def _config_to_dict(c):
    d = doc_to_dict(c)
    if d is None:
        return {}
    # Frontend expects site_description and site_name as aliases
    if d.get("about_text") and "site_description" not in d:
        d["site_description"] = d["about_text"]
    if d.get("site_title") and "site_name" not in d:
        d["site_name"] = d["site_title"]
    return d


@router.get("/")
async def get_config():
    config = SiteConfig.objects.first()
    if not config:
        config = SiteConfig()
        config.save()
    return [_config_to_dict(config)]


@router.post("/", dependencies=[Depends(require_admin)])
async def create_config(data: SiteConfigUpdate):
    if SiteConfig.objects.first():
        raise HTTPException(
            status_code=400,
            detail="Config already exists. Use PUT to update.",
        )
    config = SiteConfig(**data.dict(exclude_unset=True))
    config.save()
    return _config_to_dict(config)


@router.put("/{config_id}", dependencies=[Depends(require_admin)])
async def update_config(config_id: str, data: SiteConfigUpdate):
    try:
        config = SiteConfig.objects(id=ObjectId(config_id)).first()
    except Exception:
        config = None
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    updates = data.dict(exclude_unset=True)
    if "site_description" in updates:
        updates["about_text"] = updates.pop("site_description")
    if "site_name" in updates:
        updates["site_title"] = updates.pop("site_name")
    config.update(**updates)
    config.reload()
    return _config_to_dict(config)
