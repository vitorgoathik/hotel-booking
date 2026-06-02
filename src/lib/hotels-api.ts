import type { Hotel } from "./types";

const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";
const BASE = `https://${RAPIDAPI_HOST}/api/v1/hotels`;

function headers(): HeadersInit {
  return {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": process.env.RAPIDAPI_KEY ?? "",
  };
}

// ── Destination lookup ────────────────────────────────────────────────────────

export interface DestResult {
  dest_id: string;
  search_type: string;
  label: string;
}

export async function searchDestination(query: string): Promise<DestResult | null> {
  try {
    const res = await fetch(
      `${BASE}/searchDestination?query=${encodeURIComponent(query)}`,
      { headers: headers(), next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.status || !Array.isArray(json.data) || json.data.length === 0) return null;
    const city = json.data.find((d: DestResult) => d.search_type === "city") ?? json.data[0];
    return { dest_id: city.dest_id, search_type: city.search_type, label: city.label ?? query };
  } catch {
    return null;
  }
}

// ── Hotel search ──────────────────────────────────────────────────────────────

function parseLabel(label: string) {
  const l = label.toLowerCase();
  const freeCancellation  = l.includes("free cancellation");
  const breakfastIncluded = l.includes("breakfast included");
  const m = label.match(/only (\d+) left/i);
  const roomsLeft = m?.[1] != null ? parseInt(m[1], 10) : 10;
  return { freeCancellation, breakfastIncluded, roomsLeft };
}

function mapHotel(
  raw: Record<string, unknown>,
  city: string,
  country: string,
  nights: number,
  destId: string,
): Hotel {
  const prop  = raw.property as Record<string, unknown>;
  const price = prop.priceBreakdown as Record<string, unknown>;
  const gross  = (price.grossPrice  as Record<string, number>).value ?? 0;
  const strike = (price.strikethroughPrice as Record<string, number> | undefined)?.value;

  const pricePerNight    = Math.round(gross / nights);
  const originalPerNight = strike != null ? Math.round(strike / nights) : undefined;

  const starRaw = (prop.accuratePropertyClass as number) || (prop.propertyClass as number) || 0;
  const stars   = Math.min(5, Math.max(1, starRaw));

  const { freeCancellation, breakfastIncluded, roomsLeft } = parseLabel(
    (raw.accessibilityLabel as string) ?? "",
  );

  const photoUrls = (prop.photoUrls as string[] | undefined) ?? [];
  const photos    = photoUrls.slice(0, 10).map((u) => u.replace("square500", "square1024"));
  const photoUrl  = photos[0];

  return {
    id:               String(raw.hotel_id),
    name:             (prop.name as string) ?? "Hotel",
    stars,
    rating:           (prop.reviewScore  as number) ?? 0,
    reviewCount:      (prop.reviewCount  as number) ?? 0,
    pricePerNight,
    originalPrice:    originalPerNight,
    city,
    country,
    address:          (prop.wishlistName as string) ?? city,
    amenities:        [],
    distanceToCenter: 0,
    freeCancellation,
    breakfastIncluded,
    roomsLeft,
    latitude:         (prop.latitude  as number | undefined),
    longitude:        (prop.longitude as number | undefined),
    bookingComId:     raw.hotel_id as number,
    bookingComDestId: destId,
    photoUrl,
    photos,
  };
}

export async function searchRealHotels(
  city: string,
  country: string,
  checkin: string,
  checkout: string,
  adults: number,
  rooms: number,
): Promise<Hotel[] | null> {
  if (!process.env.RAPIDAPI_KEY) return null;

  const nights = Math.max(
    1,
    Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000),
  );

  const dest = await searchDestination(city);
  if (!dest) return null;

  const params = new URLSearchParams({
    dest_id:        dest.dest_id,
    search_type:    dest.search_type,
    arrival_date:   checkin,
    departure_date: checkout,
    adults:         String(adults),
    room_qty:       String(rooms),
    units:          "imperial",
    page_number:    "1",
    currency_code:  "USD",
    languagecode:   "en-us",
  });

  try {
    const res = await fetch(`${BASE}/searchHotels?${params}`, {
      headers: headers(),
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.status || !Array.isArray(json.data?.hotels)) return null;

    return (json.data.hotels as Record<string, unknown>[])
      .filter((h) => {
        const prop  = h.property as Record<string, unknown>;
        const price = prop?.priceBreakdown as Record<string, unknown> | undefined;
        return price?.grossPrice != null;
      })
      .slice(0, 10)
      .map((h) => mapHotel(h, city, country, nights, dest.dest_id))
      .sort((a, b) => a.pricePerNight - b.pricePerNight);
  } catch {
    return null;
  }
}
