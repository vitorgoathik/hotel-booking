export interface BookingOption {
  label: string;
  url: string;
  primary?: boolean;
  tracked: boolean;
  estimatedTotal: number;
}

// ── Booking.com ───────────────────────────────────────────────────────────────
// Apply at: booking.com/affiliateprogram
// Your affiliate ID (aid) goes in NEXT_PUBLIC_BOOKING_AID
function bookingComUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): string {
  const aid = process.env.NEXT_PUBLIC_BOOKING_AID;
  const params = new URLSearchParams({
    ss: city,
    checkin,
    checkout,
    group_adults: String(guests),
    no_rooms: String(rooms),
    lang: "en-us",
    ...(aid ? { aid } : {}),
  });
  return `https://www.booking.com/searchresults.en.html?${params}`;
}

// ── Hotels.com ────────────────────────────────────────────────────────────────
// Apply at: hotels.com/affiliateprogram (via CJ Affiliate)
// Your CID goes in NEXT_PUBLIC_HOTELSCOM_CID
function hotelsComUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): string {
  const cid = process.env.NEXT_PUBLIC_HOTELSCOM_CID;
  const params = new URLSearchParams({
    destination: city,
    startDate: checkin,
    endDate: checkout,
    adults: String(guests),
    rooms: String(rooms),
    ...(cid ? { cid } : {}),
  });
  return `https://www.hotels.com/Hotel-Search?${params}`;
}

// ── Agoda ──────────────────────────────────────────────────────────────────────
// Apply at: agoda.com/partners/affiliateprogram.aspx
// Your CID goes in NEXT_PUBLIC_AGODA_CID
//
// Agoda search requires numeric city IDs — text names are ignored and bounce
// to the homepage. IDs for the most-searched destinations are hardcoded below;
// unknown cities fall back to textToSearch (may still land on homepage).
// The full ID list is available from Agoda's affiliate data feed once enrolled.
// Only include IDs verified against Agoda's affiliate data feed.
// Wrong IDs cause "problem completing your search" errors.
// For all other cities, textToSearch is used — dates/guests still pre-fill.
const AGODA_CITY_IDS: Record<string, number> = {
  "Bangkok": 6,
  "Singapore": 332,
};

function agodaUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): string {
  const cid = process.env.NEXT_PUBLIC_AGODA_CID;
  const cityId = AGODA_CITY_IDS[city];
  const params = new URLSearchParams({
    ...(cityId
      ? { city: String(cityId), searchType: "city" }
      : { textToSearch: city }),
    checkIn: checkin,
    checkOut: checkout,
    rooms: String(rooms),
    adults: String(guests),
    children: "0",
    ...(cid ? { cid } : {}),
  });
  return `https://www.agoda.com/en-us/search?${params}`;
}

// ── Expedia ────────────────────────────────────────────────────────────────────
function expediaUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): string {
  const params = new URLSearchParams({
    destination: city,
    startDate: checkin,
    endDate: checkout,
    adults: String(guests),
    rooms: String(rooms),
  });
  return `https://www.expedia.com/Hotel-Search?${params}`;
}

// ── Kayak ──────────────────────────────────────────────────────────────────────
function kayakUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number
): string {
  const slug = encodeURIComponent(city.toLowerCase().replace(/\s+/g, "-"));
  return `https://www.kayak.com/hotels/${slug}/${checkin}/${checkout}/${guests}adults`;
}

// ── Google Hotels ──────────────────────────────────────────────────────────────
function googleHotelsUrl(city: string, checkin: string, checkout: string): string {
  const params = new URLSearchParams({
    q: `hotels in ${city}`,
    checkin,
    checkout,
  });
  return `https://www.google.com/travel/hotels?${params}`;
}

// Per-merchant price variance reflects typical OTA pricing differences.
const MERCHANT_VARIANCE: Record<string, number> = {
  "Booking.com":   1.00,
  "Agoda":         0.94,
  "Hotels.com":    0.97,
  "Expedia":       1.04,
  "Kayak":         1.02,
  "Google Hotels": 0.99,
};

export function getBookingOptions(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number,
  total: number
): BookingOption[] {
  const est = (merchant: string) =>
    Math.round(total * (MERCHANT_VARIANCE[merchant] ?? 1));

  return [
    {
      label: "Booking.com",
      url: bookingComUrl(city, checkin, checkout, guests, rooms),
      primary: true,
      tracked: !!process.env.NEXT_PUBLIC_BOOKING_AID,
      estimatedTotal: est("Booking.com"),
    },
    {
      label: "Agoda",
      url: agodaUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_AGODA_CID,
      estimatedTotal: est("Agoda"),
    },
    {
      label: "Hotels.com",
      url: hotelsComUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_HOTELSCOM_CID,
      estimatedTotal: est("Hotels.com"),
    },
    {
      label: "Expedia",
      url: expediaUrl(city, checkin, checkout, guests, rooms),
      tracked: false,
      estimatedTotal: est("Expedia"),
    },
    {
      label: "Kayak",
      url: kayakUrl(city, checkin, checkout, guests),
      tracked: false,
      estimatedTotal: est("Kayak"),
    },
    {
      label: "Google Hotels",
      url: googleHotelsUrl(city, checkin, checkout),
      tracked: false,
      estimatedTotal: est("Google Hotels"),
    },
  ];
}
