/**
 * Optional client for the FastAPI service in `backend/`.
 * Set BACKEND_URL (e.g. http://localhost:8010/api/v1) to enable it. When unset, or when the
 * service is unreachable, every helper returns null and the site falls back to its built-in logic.
 */
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "");
const TIMEOUT_MS = 2500;

async function post<T>(path: string, body: unknown): Promise<T | null> {
  if (!BACKEND_URL) return null;
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function estimateRoute(
  pickupLat: number,
  pickupLng: number,
  dropoffLat: number,
  dropoffLng: number
): Promise<{ distanceKm: number; durationMinutes: number } | null> {
  return post("/route", { pickupLat, pickupLng, dropoffLat, dropoffLng });
}

export async function notifyBookingConfirmed(reference: string, email: string, phone?: string) {
  return post("/notifications/booking-confirmation", { reference, email, phone });
}
