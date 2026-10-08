import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateQuote } from "@/lib/pricing";
import { getDistanceMatrix } from "@/lib/google-maps";
import { estimateRoute } from "@/lib/backend";

const quoteSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  pickupDate: z.string(),
  pickupTime: z.string(),
  isReturn: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = quoteSchema.parse(body);

    const matrix = await getDistanceMatrix(
      input.pickupLat,
      input.pickupLng,
      input.dropoffLat,
      input.dropoffLng
    );

    const quote = await calculateQuote(input);

    if (matrix) {
      quote.distanceMiles = matrix.miles;
      quote.durationMinutes = matrix.minutes;
    } else {
      // No Google Maps key: let the FastAPI service estimate the route when it is configured.
      const route = await estimateRoute(input.pickupLat, input.pickupLng, input.dropoffLat, input.dropoffLng);
      if (route) {
        quote.distanceMiles = route.distanceKm;
        quote.durationMinutes = route.durationMinutes;
      }
    }

    return NextResponse.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Quote error:", error);
    return NextResponse.json({ error: "Failed to calculate quote" }, { status: 500 });
  }
}
