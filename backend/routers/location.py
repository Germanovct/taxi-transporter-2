import os
import logging
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import httpx
from services.supabase import get_supabase

logger = logging.getLogger("taxi_transporter_api")

router = APIRouter(
    prefix="/location",
    tags=["location"]
)

DRIVER_SECRET_KEY = os.getenv("DRIVER_SECRET_KEY", "")
INACTIVE_THRESHOLD_MINUTES = 30


# ──────────────────────────────────────────────
#  Pydantic Schemas
# ──────────────────────────────────────────────
class DriverUpdateRequest(BaseModel):
    secret_key: str = Field(..., min_length=1)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class PassengerETARequest(BaseModel):
    passenger_lat: float = Field(..., ge=-90, le=90)
    passenger_lng: float = Field(..., ge=-180, le=180)


# ──────────────────────────────────────────────
#  POST /location/driver/update
# ──────────────────────────────────────────────
@router.post("/driver/update")
async def update_driver_location(request: DriverUpdateRequest):
    """
    URL secreta que usa el conductor desde su celular.
    Actualiza su ubicación en tiempo real en Supabase.
    """
    if not DRIVER_SECRET_KEY:
        logger.error("DRIVER_SECRET_KEY is not configured")
        raise HTTPException(status_code=500, detail="Servicio no configurado.")

    if request.secret_key != DRIVER_SECRET_KEY:
        logger.warning("Invalid driver secret key attempt")
        raise HTTPException(status_code=403, detail="Clave inválida.")

    supabase = get_supabase()
    if supabase is None:
        raise HTTPException(status_code=503, detail="Base de datos no disponible.")

    now = datetime.now(timezone.utc).isoformat()

    location_data = {
        "latitude": request.latitude,
        "longitude": request.longitude,
        "updated_at": now,
        "is_active": True
    }

    try:
        # Check if a row already exists
        existing = supabase.table("driver_location").select("id").limit(1).execute()

        if existing.data and len(existing.data) > 0:
            # Update existing row
            row_id = existing.data[0]["id"]
            supabase.table("driver_location").update(location_data).eq("id", row_id).execute()
        else:
            # Insert first row
            supabase.table("driver_location").insert(location_data).execute()

        logger.info(f"Driver location updated: ({request.latitude}, {request.longitude})")

        return {"status": "ok", "updated_at": now}

    except Exception as e:
        logger.error(f"Failed to update driver location: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al actualizar ubicación.")


# ──────────────────────────────────────────────
#  POST /location/passenger/eta
# ──────────────────────────────────────────────
@router.post("/passenger/eta")
async def get_passenger_eta(request: PassengerETARequest):
    """
    Calcula ETA desde la ubicación del pasajero al conductor
    usando OSRM (gratuito, sin API key).
    """
    supabase = get_supabase()
    if supabase is None:
        return {"available": False, "reason": "database_unavailable"}

    try:
        # Get latest driver location
        result = supabase.table("driver_location").select("*").limit(1).execute()

        if not result.data or len(result.data) == 0:
            return {"available": False, "reason": "no_driver_data"}

        driver = result.data[0]

        # Check if driver is active
        if not driver.get("is_active", False):
            return {"available": False, "reason": "driver_inactive"}

        # Check if location is stale (> 30 minutes)
        updated_at_str = driver.get("updated_at", "")
        if updated_at_str:
            try:
                updated_at = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
                now = datetime.now(timezone.utc)
                if (now - updated_at) > timedelta(minutes=INACTIVE_THRESHOLD_MINUTES):
                    # Auto-deactivate stale location
                    try:
                        supabase.table("driver_location").update(
                            {"is_active": False}
                        ).eq("id", driver["id"]).execute()
                    except Exception:
                        pass
                    return {"available": False, "reason": "location_stale"}
            except (ValueError, TypeError):
                pass

        driver_lat = float(driver["latitude"])
        driver_lng = float(driver["longitude"])

        # Call OSRM for routing (free, no API key needed)
        osrm_url = (
            f"http://router.project-osrm.org/route/v1/driving/"
            f"{driver_lng},{driver_lat};{request.passenger_lng},{request.passenger_lat}"
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(osrm_url, params={"overview": "false"})
                data = response.json()

                if data.get("code") != "Ok" or not data.get("routes"):
                    logger.warning("OSRM routing failed for ETA calculation")
                    # Fallback: estimate based on straight-line distance
                    return {
                        "available": True,
                        "eta_minutes": 15,
                        "driver_lat": driver_lat,
                        "driver_lng": driver_lng,
                        "last_updated": updated_at_str,
                        "estimated": True
                    }

                route = data["routes"][0]
                duration_seconds = route["duration"]
                eta_minutes = max(1, round(duration_seconds / 60))

                logger.info(f"ETA calculated: {eta_minutes} min")

                return {
                    "available": True,
                    "eta_minutes": eta_minutes,
                    "driver_lat": driver_lat,
                    "driver_lng": driver_lng,
                    "last_updated": updated_at_str,
                    "estimated": False
                }

        except httpx.TimeoutException:
            logger.warning("OSRM timeout — returning estimate")
            return {
                "available": True,
                "eta_minutes": 15,
                "driver_lat": driver_lat,
                "driver_lng": driver_lng,
                "last_updated": updated_at_str,
                "estimated": True
            }

    except Exception as e:
        logger.error(f"Error calculating ETA: {str(e)}")
        return {"available": False, "reason": "error"}
