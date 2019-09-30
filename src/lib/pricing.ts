import { prisma } from "./prisma";

export type QuoteInput = {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  pickupDate: string;
  pickupTime: string;
  isReturn?: boolean;
};

export type VehicleQuote = {
  vehicleTypeId: string;
  slug: string;
  name: string;
  example: string;
  passengers: number;
  luggage: number;
  handLuggage: number;
  basePrice: number;
  vehiclePrice: number;
  surgeMultiplier: number;
  totalPrice: number;
  isReturn: boolean;
};

export type QuoteResult = {
  distanceMiles: number;
  durationMinutes: number;
  isNightRate: boolean;
  surgeMultiplier: number;
  vehicles: VehicleQuote[];
};

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateDurationMinutes(km: number): number {
  const avgSpeed = km > 60 ? 70 : 35;
  return Math.max(15, Math.round((km / avgSpeed) * 60 + 10));
}

function isNightTime(hour: number, start: number, end: number): boolean {
  if (start > end) return hour >= start || hour < end;
  return hour >= start && hour < end;
}

function getDaySurgeMultiplier(date: Date): number {
  const day = date.getDay();
  const hour = date.getHours();
  if (day === 5 && hour >= 16) return 1.05;
  if (day === 0 || day === 6) return 1.02;
  return 1.0;
}

export async function calculateQuote(input: QuoteInput): Promise<QuoteResult> {
  const pricing = await prisma.pricingRule.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const activeSurge = await prisma.surgeRule.findFirst({
    where: { isActive: true },
  });

  const vehicles = await prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const rules = pricing ?? {
    baseFare: 65,
    perMileRate: 3.5,
    perMinuteRate: 0.8,
    minimumFare: 89,
    airportFee: 15,
    nightMultiplier: 1.15,
    nightStartHour: 22,
    nightEndHour: 6,
  };

  const distanceKm =
    Math.round(
      haversineKm(
        input.pickupLat,
        input.pickupLng,
        input.dropoffLat,
        input.dropoffLng
      ) * 10
    ) / 10;

  const durationMinutes = estimateDurationMinutes(distanceKm);

  const pickupDateTime = new Date(`${input.pickupDate}T${input.pickupTime}`);
  const hour = pickupDateTime.getHours();
  const nightRate = isNightTime(hour, rules.nightStartHour, rules.nightEndHour);

  const daySurge = getDaySurgeMultiplier(pickupDateTime);
  const configuredSurge = activeSurge?.multiplier ?? 1.0;
  const surgeMultiplier =
    Math.round(Math.max(daySurge, configuredSurge) * 100) / 100;

  let basePrice =
    rules.baseFare +
    distanceKm * rules.perMileRate +
    durationMinutes * rules.perMinuteRate +
    rules.airportFee;

  if (nightRate) basePrice *= rules.nightMultiplier;
  basePrice = Math.max(basePrice, rules.minimumFare);
  basePrice = Math.round(basePrice * surgeMultiplier * 100) / 100;

  const vehicleQuotes: VehicleQuote[] = vehicles.map((v) => {
    let vehiclePrice = Math.round(basePrice * v.multiplier * 100) / 100;
    if (input.isReturn) vehiclePrice = Math.round(vehiclePrice * 1.85 * 100) / 100;

    return {
      vehicleTypeId: v.id,
      slug: v.slug,
      name: v.name,
      example: v.example,
      passengers: v.passengers,
      luggage: v.luggage,
      handLuggage: v.handLuggage,
      basePrice,
      vehiclePrice,
      surgeMultiplier,
      totalPrice: vehiclePrice,
      isReturn: !!input.isReturn,
    };
  });

  return {
    distanceMiles: distanceKm,
    durationMinutes,
    isNightRate: nightRate,
    surgeMultiplier,
    vehicles: vehicleQuotes,
  };
}

export function generateBookingReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "PTB-";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}
