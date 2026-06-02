import { type NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { searchRealHotels } from "@/lib/hotels-api";

const cachedSearch = unstable_cache(
  async (
    destination: string,
    country: string,
    checkin: string,
    checkout: string,
    adults: number,
    rooms: number,
  ) => searchRealHotels(destination, country, checkin, checkout, adults, rooms),
  ["hotel-search"],
  { revalidate: 600 },
);

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const destination = sp.get("destination") ?? "";
  const country     = sp.get("country")     ?? "";
  const checkin     = sp.get("checkin")     ?? "";
  const checkout    = sp.get("checkout")    ?? "";
  const adults      = Number(sp.get("guests") ?? "2");
  const rooms       = Number(sp.get("rooms")  ?? "1");

  if (!destination || !checkin || !checkout) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  try {
    const hotels = await cachedSearch(destination, country, checkin, checkout, adults, rooms);
    return NextResponse.json({
      hotels: hotels ?? [],
      provider: "Booking.com",
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      hotels: [],
      provider: "Booking.com",
      updatedAt: new Date().toISOString(),
    });
  }
}
