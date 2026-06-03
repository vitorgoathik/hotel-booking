import type { Hotel } from "./types";

const RAPIDAPI_HOST = "hotels-com-provider.p.rapidapi.com";
const BASE          = `https://${RAPIDAPI_HOST}/v2`;

function apiHeaders(): HeadersInit {
  const key = (process.env.RAPIDAPI_KEY ?? "").replace(/^﻿/, "");
  return {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key":  key,
  };
}

// ── Region lookup ─────────────────────────────────────────────────────────────

async function searchRegion(query: string): Promise<string | null> {
  try {
    const url = `${BASE}/regions?` + new URLSearchParams({
      query,
      locale: "en_US",
      domain: "US",
    });
    const res = await fetch(url, {
      headers: apiHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const items: Array<{ gaiaId?: string; type?: string }> = json?.data ?? [];
    // prefer city-type result; fall back to first result
    const city = items.find((d) => d.type === "CITY") ?? items[0];
    return city?.gaiaId ?? null;
  } catch {
    return null;
  }
}

// ── Hotel search ──────────────────────────────────────────────────────────────

interface RawProperty {
  id?: string;
  name?: string;
  star?: number;
  reviews?: { score?: number; total?: number; localizedAdvisory?: string };
  price?: {
    lead?: { amount?: number; currencyInfo?: { code?: string } };
    strikeOut?: { amount?: number };
  };
  propertyImage?: { image?: { url?: string } };
  gallery?: Array<{ image?: { url?: string } }>;
  coordinates?: { lat?: number; lon?: number };
  amenities?: Array<{ text?: string }>;
  availability?: { available?: boolean; minRoomsLeft?: number };
  offerBadge?: { primary?: { text?: string } };
}

function mapProperty(raw: RawProperty, city: string, country: string, nights: number): Hotel | null {
  const price = raw.price?.lead?.amount;
  if (!price) return null;

  const pricePerNight = Math.round(price / Math.max(nights, 1));
  const strikeAmount  = raw.price?.strikeOut?.amount;
  const originalPrice = strikeAmount ? Math.round(strikeAmount / Math.max(nights, 1)) : undefined;

  const stars  = Math.min(5, Math.max(1, Math.round(raw.star ?? 3)));
  const rating = raw.reviews?.score ?? 0;
  const reviewCount = raw.reviews?.total ?? 0;

  const photoUrl = raw.propertyImage?.image?.url ?? raw.gallery?.[0]?.image?.url;
  const photos   = (raw.gallery ?? []).map((g) => g.image?.url).filter(Boolean) as string[];

  const badge = (raw.offerBadge?.primary?.text ?? "").toLowerCase();
  const freeCancellation  = badge.includes("free cancellation") || badge.includes("cancel");
  const breakfastIncluded = badge.includes("breakfast");
  const roomsLeft = raw.availability?.minRoomsLeft ?? 10;

  const amenities = (raw.amenities ?? [])
    .map((a) => a.text)
    .filter((t): t is string => Boolean(t))
    .slice(0, 10);

  return {
    id:               raw.id ?? `${city}-unknown`,
    name:             raw.name ?? "Hotel",
    stars,
    rating,
    reviewCount,
    pricePerNight,
    originalPrice,
    city,
    country,
    address:          city,
    amenities,
    distanceToCenter: 0,
    freeCancellation,
    breakfastIncluded,
    roomsLeft,
    latitude:         raw.coordinates?.lat,
    longitude:        raw.coordinates?.lon,
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

  const regionId = await searchRegion(city);
  if (!regionId) return null;

  try {
    const url = `${BASE}/hotels/search?` + new URLSearchParams({
      regionId,
      checkIn:  checkin,
      checkOut: checkout,
      adults:   String(adults),
      rooms:    String(rooms),
      locale:   "en_US",
      domain:   "US",
      currency: "USD",
      sort:     "PRICE_LOW_TO_HIGH",
    });
    const res = await fetch(url, {
      headers: apiHeaders(),
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const properties: RawProperty[] =
      json?.data?.propertySearch?.properties ?? [];

    return properties
      .map((p) => mapProperty(p, city, country, nights))
      .filter((h): h is Hotel => h !== null)
      .slice(0, 10);
  } catch {
    return null;
  }
}
