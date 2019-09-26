import type { PlaceResult } from "@/lib/google-maps";
import { resolvePlaceFromText } from "@/lib/google-maps";

type BookingUrlOptions = {
  date?: string;
  time?: string;
  isReturn?: boolean;
};

export function buildBookingUrl(
  pickup: PlaceResult,
  dropoff: PlaceResult,
  options: BookingUrlOptions = {}
): string {
  const today = new Date().toISOString().split("T")[0];
  const params = new URLSearchParams({
    pickup: pickup.address,
    pickupLat: String(pickup.lat),
    pickupLng: String(pickup.lng),
    dropoff: dropoff.address,
    dropoffLat: String(dropoff.lat),
    dropoffLng: String(dropoff.lng),
    date: options.date ?? today,
    time: options.time ?? "12:00",
    return: options.isReturn ? "1" : "0",
  });

  return `/book?${params.toString()}`;
}

export function buildBookingUrlFromLabels(
  pickupLabel: string,
  dropoffLabel: string,
  options: BookingUrlOptions = {}
): string | null {
  const pickup = resolvePlaceFromText(pickupLabel);
  const dropoff = resolvePlaceFromText(dropoffLabel);
  if (!pickup || !dropoff) return null;
  return buildBookingUrl(pickup, dropoff, options);
}

export const DEFAULT_BOOKING_URL =
  buildBookingUrlFromLabels("Guarulhos Airport", "Centro de São Paulo") ?? "/book";

export const QUICK_BOOK_ROUTES = [
  { label: "Guarulhos → Centro de São Paulo", pickup: "Guarulhos Airport", dropoff: "Centro de São Paulo" },
  { label: "Congonhas → Avenida Paulista", pickup: "Congonhas Airport", dropoff: "Avenida Paulista" },
  { label: "Galeão → Copacabana", pickup: "Galeão Airport", dropoff: "Copacabana" },
  { label: "Santos Dumont → Ipanema", pickup: "Santos Dumont Airport", dropoff: "Ipanema" },
  { label: "Guarulhos → Campinas", pickup: "Guarulhos Airport", dropoff: "Campinas" },
  { label: "Galeão → Barra da Tijuca", pickup: "Galeão Airport", dropoff: "Barra da Tijuca" },
] as const;

export function navigateToQuote(
  pickup: PlaceResult,
  dropoff: PlaceResult,
  options: BookingUrlOptions = {}
): string {
  return buildBookingUrl(pickup, dropoff, options);
}
