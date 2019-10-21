import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/google-maps";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const places = await searchPlaces(q);
  return NextResponse.json({ places });
}
