import os
import uuid
import time
import logging
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, Path, Depends
from pydantic import BaseModel, Field
from services.supabase import get_supabase, get_bucket_name

# Set up logging
logger = logging.getLogger("taxi_transporter_api")

router = APIRouter(
    prefix="/media",
    tags=["media"]
)

# Pydantic Schemas
class MediaItem(BaseModel):
    id: str
    filename: str
    original_name: str
    url: str
    type: str  # photo | video
    description: Optional[str] = None
    order_index: int
    active: bool
    created_at: str

class MediaUpdate(BaseModel):
    description: Optional[str] = None
    order_index: Optional[int] = None
    active: Optional[bool] = None

# Helper validation config
ALLOWED_PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_PHOTO_MIMES = {"image/jpeg", "image/png", "image/webp"}
MAX_PHOTO_SIZE = 10 * 1024 * 1024  # 10MB

ALLOWED_VIDEO_EXTS = {".mp4", ".webm", ".mov"}
ALLOWED_VIDEO_MIMES = {"video/mp4", "video/webm", "video/quicktime", "video/x-matroska", "video/ogg"}
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB

@router.get("", response_model=List[MediaItem])
def get_media(
    type: str = Query("all", description="Filter by type: photo, video, or all"),
    active: bool = Query(True, description="Filter by active status"),
    client=Depends(get_supabase)
):
    """
    Fetch all media items ordered by order_index.
    """
    if client is None:
        logger.warning("Supabase client is not configured. Returning empty media list.")
        return []

    try:
        query = client.table("fleet_media").select("*")
        
        if type != "all":
            query = query.eq("type", type)
            
        if active is not None:
            query = query.eq("active", active)
            
        response = query.order("order_index", desc=False).execute()
        
        media_list = []
        for item in response.data:
            media_list.append(MediaItem(
                id=str(item["id"]),
                filename=item["filename"],
                original_name=item["original_name"],
                url=item["url"],
                type=item["type"],
                description=item.get("description"),
                order_index=item.get("order_index", 0),
                active=item.get("active", True),
                created_at=item["created_at"]
            ))
        return media_list
    except Exception as e:
        logger.error(f"Error fetching media items: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database query failed: {str(e)}")

@router.post("/upload", response_model=MediaItem)
async def upload_media(
    file: UploadFile = File(...),
    type: str = Form(..., description="photo or video"),
    description: Optional[str] = Form(None),
    client=Depends(get_supabase)
):
    """
    Upload media to Supabase Storage and register in fleet_media database table.
    """
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase service is not configured.")

    if type not in ("photo", "video"):
        raise HTTPException(status_code=400, detail="Invalid media type. Must be 'photo' or 'video'.")

    # Read and check file size
    try:
        file_bytes = await file.read()
        file_size = len(file_bytes)
    except Exception as e:
        logger.error(f"Error reading file bytes: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not read uploaded file.")

    # Validation
    filename_lower = file.filename.lower()
    _, ext = os.path.splitext(filename_lower)
    content_type = file.content_type

    if type == "photo":
        if ext not in ALLOWED_PHOTO_EXTS:
            raise HTTPException(status_code=400, detail=f"Extension {ext} not allowed for photos. Use: {', '.join(ALLOWED_PHOTO_EXTS)}")
        if content_type not in ALLOWED_PHOTO_MIMES:
            raise HTTPException(status_code=400, detail=f"Mime type '{content_type}' is not allowed for photos.")
        if file_size > MAX_PHOTO_SIZE:
            raise HTTPException(status_code=400, detail=f"Photo size exceeds the 10MB limit (size: {file_size / (1024*1024):.2f}MB).")
    else:  # video
        if ext not in ALLOWED_VIDEO_EXTS:
            raise HTTPException(status_code=400, detail=f"Extension {ext} not allowed for videos. Use: {', '.join(ALLOWED_VIDEO_EXTS)}")
        if content_type not in ALLOWED_VIDEO_MIMES:
            raise HTTPException(status_code=400, detail=f"Mime type '{content_type}' is not allowed for videos.")
        if file_size > MAX_VIDEO_SIZE:
            raise HTTPException(status_code=400, detail=f"Video size exceeds the 100MB limit (size: {file_size / (1024*1024):.2f}MB).")

    # Generate unique filename: {type}_{uuid4}_{timestamp}.{ext}
    unique_id = uuid.uuid4()
    timestamp = int(time.time())
    sanitized_ext = ext if ext else (".webp" if type == "photo" else ".mp4")
    unique_filename = f"{type}_{unique_id}_{timestamp}{sanitized_ext}"

    # Determine Storage path: media/flota/... or media/videos/...
    folder = "flota" if type == "photo" else "videos"
    storage_path = f"{folder}/{unique_filename}"
    bucket_name = get_bucket_name()

    logger.info(f"Uploading file {file.filename} to storage path {bucket_name}/{storage_path}...")
    
    # 1. Upload to Supabase Storage
    try:
        # We upload file bytes
        client.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": content_type}
        )
    except Exception as e:
        logger.error(f"Supabase storage upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file to storage: {str(e)}")

    # Get Public URL
    try:
        url_res = client.storage.from_(bucket_name).get_public_url(storage_path)
        if isinstance(url_res, str):
            public_url = url_res
        else:
            public_url = getattr(url_res, "public_url", str(url_res))
    except Exception as e:
        logger.error(f"Failed to fetch public URL for {storage_path}: {str(e)}")
        # Rollback storage upload
        try:
            client.storage.from_(bucket_name).remove([storage_path])
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Failed to resolve public URL for uploaded media.")

    # 2. Insert into Database Table (fleet_media)
    try:
        db_data = {
            "filename": unique_filename,
            "original_name": file.filename,
            "url": public_url,
            "type": type,
            "description": description,
            "order_index": 0,
            "active": True
        }
        db_response = client.table("fleet_media").insert(db_data).execute()
        
        if not db_response.data:
            raise Exception("No data returned from database insert operation.")
            
        inserted_item = db_response.data[0]
        return MediaItem(
            id=str(inserted_item["id"]),
            filename=inserted_item["filename"],
            original_name=inserted_item["original_name"],
            url=inserted_item["url"],
            type=inserted_item["type"],
            description=inserted_item.get("description"),
            order_index=inserted_item.get("order_index", 0),
            active=inserted_item.get("active", True),
            created_at=inserted_item["created_at"]
        )
    except Exception as e:
        logger.error(f"Database insert failed: {str(e)}. Rolling back storage upload...")
        # Rollback storage
        try:
            client.storage.from_(bucket_name).remove([storage_path])
            logger.info(f"Successfully rolled back storage file {storage_path}")
        except Exception as rollback_err:
            logger.critical(f"Failed to delete storage file during rollback: {str(rollback_err)}")
        raise HTTPException(status_code=500, detail=f"Database insert failed, storage upload was rolled back: {str(e)}")

@router.delete("/{id}")
def delete_media(
    id: str = Path(..., description="UUID of the media item to delete"),
    client=Depends(get_supabase)
):
    """
    Delete media from Supabase Storage and remove its database entry.
    """
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase service is not configured.")

    bucket_name = get_bucket_name()
    
    # 1. Fetch item to get file paths
    try:
        response = client.table("fleet_media").select("*").eq("id", id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Media item not found.")
        item = response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database fetch failed for deletion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to query database: {str(e)}")

    filename = item["filename"]
    media_type = item["type"]
    folder = "flota" if media_type == "photo" else "videos"
    storage_path = f"{folder}/{filename}"

    # 2. Delete from Storage
    try:
        client.storage.from_(bucket_name).remove([storage_path])
        logger.info(f"Deleted file {storage_path} from storage.")
    except Exception as e:
        # Log warning but proceed with DB deletion so we don't end up with dangling DB records
        logger.warning(f"Could not delete storage file {storage_path}: {str(e)}")

    # 3. Delete from DB
    try:
        client.table("fleet_media").delete().eq("id", id).execute()
        logger.info(f"Deleted record {id} from database.")
        return {"deleted": True}
    except Exception as e:
        logger.error(f"Failed to delete DB record for {id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete database entry: {str(e)}")

@router.patch("/{id}", response_model=MediaItem)
def update_media(
    id: str = Path(..., description="UUID of the media item to update"),
    update_data: MediaUpdate = None,
    client=Depends(get_supabase)
):
    """
    Partially update a media item's metadata (description, order_index, active).
    """
    if client is None:
        raise HTTPException(status_code=503, detail="Supabase service is not configured.")

    if update_data is None:
        raise HTTPException(status_code=400, detail="No update payload provided.")

    # Build filtered update fields
    payload = {}
    if update_data.description is not None:
        payload["description"] = update_data.description
    if update_data.order_index is not None:
        payload["order_index"] = update_data.order_index
    if update_data.active is not None:
        payload["active"] = update_data.active

    if not payload:
        raise HTTPException(status_code=400, detail="No fields to update were provided (description, order_index, active).")

    try:
        response = client.table("fleet_media").update(payload).eq("id", id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Media item not found.")
            
        updated_item = response.data[0]
        return MediaItem(
            id=str(updated_item["id"]),
            filename=updated_item["filename"],
            original_name=updated_item["original_name"],
            url=updated_item["url"],
            type=updated_item["type"],
            description=updated_item.get("description"),
            order_index=updated_item.get("order_index", 0),
            active=updated_item.get("active", True),
            created_at=updated_item["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update database record for {id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")
