"""Cloudinary upload helper. Optional - image_url can be used if not configured."""
from config.settings import get_cloudinary_settings


def upload_image(file_bytes: bytes, folder: str = "hica/gallery") -> str:
    s = get_cloudinary_settings()
    if not s.get("cloud_name") or not s.get("api_key") or not s.get("api_secret"):
        raise ValueError("Cloudinary not configured. Set CLOUDINARY_* env vars or use image_url.")
    import cloudinary
    import cloudinary.uploader
    cloudinary.config(
        cloud_name=s["cloud_name"],
        api_key=s["api_key"],
        api_secret=s["api_secret"],
        secure=True,
    )
    import io
    result = cloudinary.uploader.upload(
        io.BytesIO(file_bytes),
        folder=folder,
    )
    return result["secure_url"]
