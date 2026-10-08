from fastapi.testclient import TestClient

from src.main import backend_app

client = TestClient(backend_app)
P = "/api/v1"


def test_route_estimates_sao_paulo_airport_to_paulista():
    r = client.post(
        f"{P}/route",
        json={"pickupLat": -23.4356, "pickupLng": -46.4731, "dropoffLat": -23.5614, "dropoffLng": -46.6559},
    )
    assert r.status_code == 200
    body = r.json()
    assert 15 < body["distanceKm"] < 30
    assert body["durationMinutes"] >= 15


def test_route_rejects_out_of_range_coordinates():
    r = client.post(
        f"{P}/route",
        json={"pickupLat": 123, "pickupLng": 0, "dropoffLat": 0, "dropoffLng": 0},
    )
    assert r.status_code == 422


def test_booking_confirmation_works_without_provider_keys(monkeypatch):
    for k in ("SENDGRID_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"):
        monkeypatch.delenv(k, raising=False)
    r = client.post(
        f"{P}/notifications/booking-confirmation",
        json={"reference": "PTB-ABC234", "email": "a@b.co", "phone": "+5511999990000"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["email"]["provider"] == "log"
    assert body["sms"]["provider"] == "log"


def test_quote_still_works():
    r = client.post(
        f"{P}/quote",
        json={"pickupLat": -23.4356, "pickupLng": -46.4731, "dropoffLat": -23.5614, "dropoffLng": -46.6559,
              "pickupDate": "2026-10-12", "pickupTime": "10:00"},
    )
    assert r.status_code == 200
    assert len(r.json()["vehicles"]) >= 1
