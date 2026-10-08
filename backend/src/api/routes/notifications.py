from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.services.notify import send_booking_confirmation, send_booking_sms

router = APIRouter(prefix="/notifications", tags=["notifications"])


class BookingNotification(BaseModel):
    reference: str = Field(min_length=3, max_length=32)
    email: str = Field(min_length=3)
    phone: str | None = None


@router.post("/booking-confirmation")
def booking_confirmation(body: BookingNotification) -> dict:
    """Email + SMS confirmation. Logs instead of sending when no provider key is configured."""
    email = send_booking_confirmation(body.email, body.reference)
    sms = send_booking_sms(body.phone, body.reference) if body.phone else None
    return {"reference": body.reference, "email": email, "sms": sms}
