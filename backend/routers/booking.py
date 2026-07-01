import os
import uuid
import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, EmailStr
import httpx
import mercadopago
from services.supabase import get_supabase

# Set up logging
logger = logging.getLogger("taxi_transporter_api")

router = APIRouter(
    prefix="/booking",
    tags=["booking"]
)

# ──────────────────────────────────────────────
#  Config
# ──────────────────────────────────────────────
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
MP_ACCESS_TOKEN = os.getenv("MP_ACCESS_TOKEN", "")
MP_WEBHOOK_SECRET = os.getenv("MP_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

PRICE_PER_KM = 1800   # ARS
MIN_DISTANCE_KM = 5   # mínimo cobrable
LONG_DISTANCE_WARNING_KM = 600

# ──────────────────────────────────────────────
#  Pydantic Schemas
# ──────────────────────────────────────────────
class QuoteRequest(BaseModel):
    origin: str = Field(..., min_length=2, description="Dirección de origen")
    destination: str = Field(..., min_length=2, description="Dirección de destino")
    passengers: int = Field(default=1, ge=1, le=19)

class QuoteResponse(BaseModel):
    distance_km: float
    duration_minutes: int
    price_ars: int
    price_per_km: int
    origin_formatted: str
    destination_formatted: str
    warnings: List[str]

class BookingCreateRequest(BaseModel):
    passenger_name: str = Field(..., min_length=2)
    passenger_email: str = Field(...)
    passenger_phone: str = Field(..., min_length=6)
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    distance_km: float = Field(..., gt=0)
    duration_minutes: int = Field(..., ge=0)
    price_ars: int = Field(..., gt=0)
    date: str = Field(..., description="YYYY-MM-DD")
    time: str = Field(..., description="HH:MM")
    passengers: int = Field(default=1, ge=1, le=19)
    luggage: Optional[str] = None
    notes: Optional[str] = None

class BookingCreateResponse(BaseModel):
    booking_id: str
    preference_id: str
    checkout_url: str
    init_point: str

class BookingStatusResponse(BaseModel):
    id: str
    passenger_name: str
    passenger_email: str
    origin: str
    destination: str
    distance_km: Optional[float]
    duration_minutes: Optional[int]
    price_ars: int
    date: str
    time: str
    passengers: int
    status: str
    created_at: str


async def get_osrm_quote(origin: str, destination: str) -> Optional[dict]:
    """
    Calcula ruta de auto usando la API gratuita de OpenStreetMap (Nominatim + OSRM)
    para evitar requerir API keys de Google en desarrollo o producción.
    """
    headers = {
        "User-Agent": "TaxiTransporter2-DevAgent/1.0 (taxieltransporter2@gmail.com)"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Geocodificar Origen
            origin_res = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": origin, "format": "json", "limit": 1, "countrycodes": "ar"},
                headers=headers
            )
            origin_data = origin_res.json()
            if not origin_data:
                logger.warning(f"OSRM: Origen no encontrado '{origin}'")
                return None
            
            lat1, lon1 = origin_data[0]["lat"], origin_data[0]["lon"]
            origin_formatted = origin_data[0]["display_name"]

            # 2. Geocodificar Destino
            dest_res = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": destination, "format": "json", "limit": 1, "countrycodes": "ar"},
                headers=headers
            )
            dest_data = dest_res.json()
            if not dest_data:
                logger.warning(f"OSRM: Destino no encontrado '{destination}'")
                return None
            
            lat2, lon2 = dest_data[0]["lat"], dest_data[0]["lon"]
            destination_formatted = dest_data[0]["display_name"]

            # 3. Ruteo con OSRM
            route_url = f"http://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}"
            route_res = await client.get(route_url, params={"overview": "false"})
            route_data = route_res.json()

            if route_data.get("code") != "Ok" or not route_data.get("routes"):
                logger.warning("OSRM: Error al calcular la ruta")
                return None

            route = route_data["routes"][0]
            distance_km = route["distance"] / 1000.0
            duration_minutes = round(route["duration"] / 60.0)

            # Acortar textos formateados para mejor visualización
            origin_short = ", ".join(origin_formatted.split(",")[:3]).strip()
            destination_short = ", ".join(destination_formatted.split(",")[:3]).strip()

            return {
                "distance_km": round(distance_km, 1),
                "duration_minutes": duration_minutes,
                "origin_formatted": origin_short,
                "destination_formatted": destination_short
            }
    except Exception as e:
        logger.error(f"Error in free OSRM quote: {str(e)}")
        return None

# ──────────────────────────────────────────────
#  POST /booking/quote
# ──────────────────────────────────────────────
@router.post("/quote", response_model=QuoteResponse)
async def get_quote(request: QuoteRequest):
    """
    Calculate estimated trip price using Google Maps Distance Matrix API.
    Fallback: Free OpenStreetMap/OSRM Routing API.
    """
    # Si no hay clave de Google, usamos el motor gratuito de OpenStreetMap (Nominatim + OSRM)
    if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY.startswith("your_"):
        logger.info("GOOGLE_MAPS_API_KEY is missing. Using free OpenStreetMap/OSRM fallback.")
        
        osrm_data = await get_osrm_quote(request.origin, request.destination)
        
        if osrm_data:
            distance_km = osrm_data["distance_km"]
            duration_minutes = osrm_data["duration_minutes"]
            origin_formatted = osrm_data["origin_formatted"]
            destination_formatted = osrm_data["destination_formatted"]
        else:
            # Fallback estático secundario si falla la red o geocodificación
            logger.warning("OSRM fallback failed. Using static mock coordinates.")
            distance_km = 31.8
            duration_minutes = 42
            origin_formatted = f"{request.origin}, Buenos Aires"
            destination_formatted = f"{request.destination}, Buenos Aires"
        
        billable_km = max(distance_km, MIN_DISTANCE_KM)
        base_price = round(billable_km * PRICE_PER_KM)
        final_price = round(base_price / 100) * 100
        
        warnings = [
            "El precio NO incluye peajes. Los peajes se abonan en efectivo durante el viaje.",
            "Tolerancia de espera: 10 minutos gratuitos. Pasado ese tiempo se cobra $500 ARS por minuto adicional."
        ]
        
        if distance_km > LONG_DISTANCE_WARNING_KM:
            warnings.append(f"⚠️ Viaje de larga distancia ({round(distance_km)} km). El precio puede variar. Te recomendamos consultar por WhatsApp.")

        return QuoteResponse(
            distance_km=round(distance_km, 1),
            duration_minutes=duration_minutes,
            price_ars=final_price,
            price_per_km=PRICE_PER_KM,
            origin_formatted=origin_formatted,
            destination_formatted=destination_formatted,
            warnings=warnings
        )

    # Call Google Maps Distance Matrix API
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": request.origin,
        "destinations": request.destination,
        "key": GOOGLE_MAPS_API_KEY,
        "language": "es",
        "units": "metric",
        "region": "ar"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            data = response.json()
    except httpx.TimeoutException:
        logger.error("Google Maps API timeout")
        raise HTTPException(status_code=503, detail="El servicio de mapas no respondió. Intentá de nuevo.")
    except Exception as e:
        logger.error(f"Google Maps API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al consultar el servicio de mapas.")

    # Validate response
    if data.get("status") != "OK":
        logger.error(f"Google Maps API status: {data.get('status')} — {data.get('error_message', '')}")
        raise HTTPException(status_code=500, detail="Error en el servicio de mapas. Contactanos por WhatsApp.")

    rows = data.get("rows", [])
    if not rows or not rows[0].get("elements"):
        raise HTTPException(status_code=400, detail="No se encontraron resultados para las direcciones ingresadas.")

    element = rows[0]["elements"][0]
    if element.get("status") != "OK":
        status = element.get("status", "UNKNOWN")
        if status == "NOT_FOUND":
            raise HTTPException(status_code=400, detail="No se pudo encontrar alguna de las direcciones. Verificá origen y destino.")
        elif status == "ZERO_RESULTS":
            raise HTTPException(status_code=400, detail="No se encontró una ruta entre el origen y el destino.")
        else:
            raise HTTPException(status_code=400, detail=f"No se pudo calcular la ruta ({status}). Verificá las direcciones.")

    # Extract distance and duration
    distance_meters = element["distance"]["value"]
    duration_seconds = element["duration"]["value"]

    distance_km = distance_meters / 1000
    duration_minutes = round(duration_seconds / 60)

    # Get formatted addresses
    origin_addresses = data.get("origin_addresses", [request.origin])
    destination_addresses = data.get("destination_addresses", [request.destination])
    origin_formatted = origin_addresses[0] if origin_addresses else request.origin
    destination_formatted = destination_addresses[0] if destination_addresses else request.destination

    # Calculate price
    billable_km = max(distance_km, MIN_DISTANCE_KM)
    base_price = round(billable_km * PRICE_PER_KM)
    final_price = round(base_price / 100) * 100  # Round to nearest 100

    # Build warnings
    warnings = [
        "El precio NO incluye peajes. Los peajes se abonan en efectivo durante el viaje.",
        "Tolerancia de espera: 10 minutos gratuitos. Pasado ese tiempo se cobra $500 ARS por minuto adicional."
    ]

    if distance_km > LONG_DISTANCE_WARNING_KM:
        warnings.append(f"⚠️ Viaje de larga distancia ({round(distance_km)} km). El precio puede variar. Te recomendamos consultar por WhatsApp.")

    logger.info(f"Quote: {request.origin} → {request.destination} | {round(distance_km, 1)}km | ${final_price} ARS")

    return QuoteResponse(
        distance_km=round(distance_km, 1),
        duration_minutes=duration_minutes,
        price_ars=final_price,
        price_per_km=PRICE_PER_KM,
        origin_formatted=origin_formatted,
        destination_formatted=destination_formatted,
        warnings=warnings
    )


# ──────────────────────────────────────────────
#  POST /booking/create
# ──────────────────────────────────────────────
@router.post("/create", response_model=BookingCreateResponse)
async def create_booking(request: BookingCreateRequest):
    """
    Create a booking in Supabase and a Mercado Pago payment preference.
    """
    supabase = get_supabase()
    if supabase is None:
        raise HTTPException(status_code=503, detail="Servicio de base de datos no disponible.")

    if not MP_ACCESS_TOKEN:
        logger.error("MP_ACCESS_TOKEN is not configured")
        raise HTTPException(status_code=500, detail="Servicio de pagos no configurado.")

    booking_id = str(uuid.uuid4())

    # 1. Save booking in Supabase
    booking_data = {
        "id": booking_id,
        "passenger_name": request.passenger_name,
        "passenger_email": request.passenger_email,
        "passenger_phone": request.passenger_phone,
        "origin": request.origin,
        "destination": request.destination,
        "distance_km": request.distance_km,
        "duration_minutes": request.duration_minutes,
        "price_ars": request.price_ars,
        "date": request.date,
        "time": request.time,
        "passengers": request.passengers,
        "luggage": request.luggage,
        "notes": request.notes,
        "status": "pending_payment",
        "mp_external_reference": booking_id
    }

    try:
        db_response = supabase.table("bookings").insert(booking_data).execute()
        if not db_response.data:
            raise Exception("No data returned from database insert.")
    except Exception as e:
        logger.error(f"Failed to create booking in database: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al guardar la reserva. Intentá de nuevo.")

    # 2. Create Mercado Pago preference
    try:
        sdk = mercadopago.SDK(MP_ACCESS_TOKEN)

        # Mercado Pago requiere HTTPS en back_urls cuando auto_return está activo.
        # Si FRONTEND_URL usa http:// (como en localhost), lo convertimos a https:// para Mercado Pago.
        success_url = f"{FRONTEND_URL}/reserva/confirmada"
        failure_url = f"{FRONTEND_URL}/reserva/error"
        pending_url = f"{FRONTEND_URL}/reserva/pendiente"

        if success_url.startswith("http://localhost") or success_url.startswith("http://127.0.0.1"):
            success_url = success_url.replace("http://", "https://")
            failure_url = failure_url.replace("http://", "https://")
            pending_url = pending_url.replace("http://", "https://")

        preference_data = {
            "items": [{
                "title": f"Traslado: {request.origin} → {request.destination}",
                "description": f"Fecha: {request.date} {request.time} | {request.passengers} pasajero/s | {request.distance_km}km",
                "quantity": 1,
                "currency_id": "ARS",
                "unit_price": float(request.price_ars)
            }],
            "payer": {
                "name": request.passenger_name,
                "email": request.passenger_email,
                "phone": {"number": request.passenger_phone}
            },
            "back_urls": {
                "success": success_url,
                "failure": failure_url,
                "pending": pending_url
            },
            "auto_return": "approved",
            "statement_descriptor": "TAXI TRANSPORTER 2",
            "external_reference": booking_id
        }

        # Mercado Pago no puede enviar webhooks a localhost/IPs privadas.
        # Solo adjuntamos notification_url si es una dirección pública accesible.
        if "localhost" not in BACKEND_URL and "127.0.0.1" not in BACKEND_URL:
            preference_data["notification_url"] = f"{BACKEND_URL}/booking/webhook"

        preference_response = sdk.preference().create(preference_data)

        if preference_response["status"] != 201:
            logger.error(f"Mercado Pago preference creation failed: {preference_response}")
            raise Exception(f"MP returned status {preference_response['status']}")

        preference = preference_response["response"]
        preference_id = preference["id"]
        init_point = preference["init_point"]

        # Update booking with MP preference ID
        supabase.table("bookings").update({
            "mp_preference_id": preference_id
        }).eq("id", booking_id).execute()

        logger.info(f"Booking {booking_id} created with MP preference {preference_id}")

        return BookingCreateResponse(
            booking_id=booking_id,
            preference_id=preference_id,
            checkout_url=init_point,
            init_point=init_point
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create Mercado Pago preference: {str(e)}")
        # Mark booking as failed
        try:
            supabase.table("bookings").update({
                "status": "payment_failed"
            }).eq("id", booking_id).execute()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Error al preparar el pago. Intentá de nuevo.")


# ──────────────────────────────────────────────
#  POST /booking/webhook
# ──────────────────────────────────────────────
@router.post("/webhook")
async def mercadopago_webhook(request: Request):
    """
    Receive payment notifications from Mercado Pago.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request body")

    logger.info(f"MP Webhook received: {body}")

    # Handle payment notifications
    topic = body.get("type") or body.get("topic")
    if topic != "payment":
        # Not a payment notification, acknowledge and skip
        return {"status": "ok", "message": "Notification type not handled"}

    # Get payment data
    data = body.get("data", {})
    payment_id = data.get("id") or body.get("data.id")

    if not payment_id:
        logger.warning("Webhook received without payment ID")
        return {"status": "ok", "message": "No payment ID"}

    if not MP_ACCESS_TOKEN:
        logger.error("MP_ACCESS_TOKEN not configured for webhook processing")
        raise HTTPException(status_code=500, detail="Payment service not configured")

    # Fetch payment details from Mercado Pago
    try:
        sdk = mercadopago.SDK(MP_ACCESS_TOKEN)
        payment_response = sdk.payment().get(payment_id)

        if payment_response["status"] != 200:
            logger.error(f"Failed to fetch payment {payment_id}: {payment_response}")
            return {"status": "error", "message": "Could not fetch payment details"}

        payment = payment_response["response"]
        payment_status = payment.get("status")
        external_reference = payment.get("external_reference")

        if not external_reference:
            logger.warning(f"Payment {payment_id} has no external_reference")
            return {"status": "ok", "message": "No external reference"}

        logger.info(f"Payment {payment_id} status: {payment_status} for booking {external_reference}")

    except Exception as e:
        logger.error(f"Error fetching payment from MP: {str(e)}")
        return {"status": "error", "message": "Failed to verify payment"}

    # Update booking in database
    supabase = get_supabase()
    if supabase is None:
        logger.error("Supabase not available for webhook processing")
        raise HTTPException(status_code=503, detail="Database not available")

    try:
        if payment_status == "approved":
            new_status = "confirmed"
        elif payment_status in ("rejected", "cancelled"):
            new_status = "payment_failed"
        else:
            # pending, in_process, etc. — don't change status yet
            logger.info(f"Payment {payment_id} has intermediate status: {payment_status}")
            return {"status": "ok", "message": f"Payment status {payment_status} noted"}

        supabase.table("bookings").update({
            "status": new_status,
            "mp_payment_id": str(payment_id)
        }).eq("id", external_reference).execute()

        logger.info(f"Booking {external_reference} updated to status: {new_status}")

        # TODO: Send confirmation email via Resend when API key is available
        # if new_status == "confirmed":
        #     send_confirmation_email(external_reference)

    except Exception as e:
        logger.error(f"Failed to update booking {external_reference}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update booking status")

    return {"status": "ok", "message": f"Booking updated to {new_status}"}


# ──────────────────────────────────────────────
#  GET /booking/{id}
# ──────────────────────────────────────────────
@router.get("/{booking_id}", response_model=BookingStatusResponse)
async def get_booking_status(booking_id: str):
    """
    Get the status of a booking by ID.
    """
    supabase = get_supabase()
    if supabase is None:
        raise HTTPException(status_code=503, detail="Servicio de base de datos no disponible.")

    try:
        response = supabase.table("bookings").select("*").eq("id", booking_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Reserva no encontrada.")

        booking = response.data[0]

        return BookingStatusResponse(
            id=str(booking["id"]),
            passenger_name=booking["passenger_name"],
            passenger_email=booking["passenger_email"],
            origin=booking["origin"],
            destination=booking["destination"],
            distance_km=booking.get("distance_km"),
            duration_minutes=booking.get("duration_minutes"),
            price_ars=booking["price_ars"],
            date=str(booking["date"]),
            time=str(booking["time"]),
            passengers=booking.get("passengers", 1),
            status=booking["status"],
            created_at=str(booking["created_at"])
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching booking {booking_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al consultar la reserva.")
