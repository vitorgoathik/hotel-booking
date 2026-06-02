import { type NextRequest, NextResponse } from "next/server";

const BASE = "https://booking-com15.p.rapidapi.com/api/v1/hotels";

function apiHeaders(): HeadersInit {
  return {
    "x-rapidapi-host": "booking-com15.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPIDAPI_KEY ?? "",
  };
}

// ── Photos ────────────────────────────────────────────────────────────────────

async function fetchPhotos(hotelId: string): Promise<string[]> {
  const res = await fetch(`${BASE}/getHotelPhotos?hotel_id=${hotelId}`, {
    headers: apiHeaders(),
    next: { revalidate: 86400 }, // photos don't change often
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.status) return [];
  const photos = (json.data ?? []) as Array<Record<string, string>>;
  return photos
    .slice(0, 10)
    .map((p) => p.url_1440 ?? p.url_original ?? p.url_max300 ?? "")
    .filter(Boolean);
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ReviewSnippet {
  text: string;
  score: number;
}

export interface ReviewData {
  score: number;
  count: number;
  snippets: ReviewSnippet[];
}

async function fetchReviews(hotelId: string): Promise<ReviewData | null> {
  const params = new URLSearchParams({
    hotel_id:     hotelId,
    languagecode: "en-us",
    sort_type:    "SORT_MOST_RELEVANT",
    page_number:  "0",
  });
  const res = await fetch(`${BASE}/getHotelReviews?${params}`, {
    headers: apiHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.status) return null;
  const data   = (json.data ?? {}) as Record<string, unknown>;
  const result = (data.result ?? []) as Array<Record<string, unknown>>;
  const score  = Number(data.average_score ?? 0);
  const count  = Number(data.total_count_with_description ?? 0);
  const snippets = result
    .slice(0, 3)
    .map((r) => ({
      text:  String(r.pros ?? r.title ?? r.cons ?? ""),
      score: Number(r.average_score ?? 0),
    }))
    .filter((s) => s.text.trim().length > 0);
  return { score, count, snippets };
}

// ── Amenities (from getHotelDetails) ─────────────────────────────────────────

async function fetchAmenities(
  hotelId: string,
  checkin: string,
  checkout: string,
): Promise<string[]> {
  const params = new URLSearchParams({
    hotel_id:       hotelId,
    arrival_date:   checkin,
    departure_date: checkout,
    adults:         "2",
    room_qty:       "1",
    units:          "metric",
    languagecode:   "en-us",
    currency_code:  "USD",
  });
  const res = await fetch(`${BASE}/getHotelDetails?${params}`, {
    headers: apiHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.status) return [];
  const data = (json.data ?? {}) as Record<string, unknown>;

  // Try nested facilities_block first
  const block     = data.facilities_block as Record<string, unknown> | undefined;
  const topGroups = (block?.facilities ?? []) as Array<Record<string, unknown>>;
  if (topGroups.length > 0) {
    const names = topGroups
      .flatMap((g) =>
        ((g.facilities as Array<Record<string, unknown>>) ?? []).map(
          (f) => String(f.name ?? ""),
        ),
      )
      .filter(Boolean);
    return [...new Set(names)].slice(0, 20);
  }

  // Flat fallback
  const flat = (data.facilities ?? data.hotel_facilities ?? []) as Array<Record<string, unknown>>;
  return flat
    .map((f) => String(f.name ?? f.facility_name ?? ""))
    .filter(Boolean)
    .slice(0, 20);
}

// ── Rooms ─────────────────────────────────────────────────────────────────────

export interface RoomType {
  name:             string;
  pricePerNight:    number;
  currency:         string;
  maxOccupancy:     number;
  freeCancellation: boolean;
  breakfast:        boolean;
}

async function fetchRooms(
  hotelId: string,
  checkin: string,
  checkout: string,
  adults: number,
  rooms: number,
): Promise<RoomType[]> {
  const params = new URLSearchParams({
    hotel_id:       hotelId,
    arrival_date:   checkin,
    departure_date: checkout,
    adults:         String(adults),
    room_qty:       String(rooms),
    units:          "metric",
    languagecode:   "en-us",
    currency_code:  "USD",
  });
  const res = await fetch(`${BASE}/getRooms?${params}`, {
    headers: apiHeaders(),
    next: { revalidate: 900 }, // 15 min — prices change
  });
  if (!res.ok) return [];
  const json = await res.json();
  if (!json.status) return [];
  const list = (json.data ?? []) as Array<Record<string, unknown>>;
  return list
    .slice(0, 8)
    .map((r) => {
      const minPrice = r.min_price as Record<string, unknown> | undefined;
      return {
        name:             String(r.name ?? r.room_name ?? "Room"),
        pricePerNight:    Number(minPrice?.price ?? minPrice?.value ?? 0),
        currency:         String(minPrice?.currency ?? "USD"),
        maxOccupancy:     Number(r.nr_adults ?? r.max_occupancy ?? 2),
        freeCancellation: Boolean(r.is_free_cancellable),
        breakfast:        Boolean(r.breakfast_included ?? r.is_breakfast_included),
      };
    })
    .filter((r) => r.pricePerNight > 0)
    .sort((a, b) => a.pricePerNight - b.pricePerNight);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const sp       = req.nextUrl.searchParams;
  const hotelId  = sp.get("hotel_id") ?? "";
  const checkin  = sp.get("checkin")  ?? "";
  const checkout = sp.get("checkout") ?? "";
  const adults   = Number(sp.get("adults") ?? "2");
  const rooms    = Number(sp.get("rooms")  ?? "1");

  if (!hotelId || !checkin || !checkout) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const [photos, reviews, amenities, roomList] = await Promise.allSettled([
    fetchPhotos(hotelId),
    fetchReviews(hotelId),
    fetchAmenities(hotelId, checkin, checkout),
    fetchRooms(hotelId, checkin, checkout, adults, rooms),
  ]);

  return NextResponse.json({
    photos:    photos.status    === "fulfilled" ? photos.value    : [],
    reviews:   reviews.status   === "fulfilled" ? reviews.value   : null,
    amenities: amenities.status === "fulfilled" ? amenities.value : [],
    rooms:     roomList.status  === "fulfilled" ? roomList.value  : [],
  });
}
