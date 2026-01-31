"""Gallery images CRUD. Admin-only for create/update/delete. Supports file upload to Cloudinary."""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from bson import ObjectId
from typing import Optional
from models.schemas import GalleryImage
from utils.auth_deps import require_admin
from utils.cloudinary_util import upload_image
from utils.serialize import doc_to_dict

router = APIRouter()


def _image_to_dict(img):
    return doc_to_dict(img) or {}


@router.get("/")
async def get_gallery():
    images = GalleryImage.objects.order_by("-created_at")
    return [_image_to_dict(img) for img in images]


@router.post("/", dependencies=[Depends(require_admin)])
async def create_gallery_image(
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    event_category: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
):
    final_url = None
    if file and file.filename:
        try:
            content = await file.read()
            final_url = upload_image(content, "hica/gallery")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}",
            )
    elif image_url:
        final_url = image_url
    if not final_url:
        raise HTTPException(
            status_code=400,
            detail="Either file upload or image_url must be provided",
        )
    img = GalleryImage(
        title=title or None,
        description=description or None,
        category=category or None,
        event_category=event_category or None,
        image_url=final_url,
    )
    img.save()
    return _image_to_dict(img)


@router.put("/{image_id}", dependencies=[Depends(require_admin)])
async def update_gallery_image(
    image_id: str,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    event_category: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
):
    try:
        img = GalleryImage.objects(id=ObjectId(image_id)).first()
    except Exception:
        img = None
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    if file and file.filename:
        try:
            content = await file.read()
            img.image_url = upload_image(content, "hica/gallery")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {str(e)}",
            )
    elif image_url:
        img.image_url = image_url
    if title is not None:
        img.title = title or None
    if description is not None:
        img.description = description or None
    if category is not None:
        img.category = category or None
    if event_category is not None:
        img.event_category = event_category or None
    img.save()
    return _image_to_dict(img)


@router.delete("/{image_id}", dependencies=[Depends(require_admin)])
async def delete_gallery_image(image_id: str):
    try:
        img = GalleryImage.objects(id=ObjectId(image_id)).first()
    except Exception:
        img = None
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    img.delete()
    return {"detail": "Deleted"}
