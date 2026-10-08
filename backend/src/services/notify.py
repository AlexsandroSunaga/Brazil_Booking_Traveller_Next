import os


def send_booking_confirmation(email: str, reference: str) -> dict:
    """SendGrid / SES hook — demo logs when API key absent."""
    if os.getenv("SENDGRID_API_KEY"):
        return {"provider": "sendgrid", "status": "queued", "to": email, "reference": reference}
    return {"provider": "log", "status": "skipped", "to": email, "reference": reference}


def send_booking_sms(phone: str, reference: str) -> dict:
    """Twilio hook - demo logs when credentials are absent."""
    if os.getenv("TWILIO_ACCOUNT_SID") and os.getenv("TWILIO_AUTH_TOKEN"):
        return {"provider": "twilio", "status": "queued", "to": phone, "reference": reference}
    return {"provider": "log", "status": "skipped", "to": phone, "reference": reference}
