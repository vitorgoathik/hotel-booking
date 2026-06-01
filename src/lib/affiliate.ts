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
const AGODA_CITY_IDS: Record<string, number> = {
  // Southeast Asia
  "Bangkok": 6,
  "Phuket": 305,
  "Chiang Mai": 295,
  "Pattaya": 1279,
  "Koh Samui": 1458,
  "Krabi": 9225,
  "Hua Hin": 3031,
  "Singapore": 332,
  "Kuala Lumpur": 955,
  "Penang": 2054,
  "Langkawi": 565,
  "Bali": 1566,
  "Jakarta": 1565,
  "Yogyakarta": 1576,
  "Lombok": 2205,
  "Ho Chi Minh City": 604,
  "Hanoi": 1159,
  "Hoi An": 2185,
  "Da Nang": 3115,
  "Nha Trang": 2272,
  "Siem Reap": 2153,
  "Phnom Penh": 2158,
  "Luang Prabang": 2187,
  "Yangon": 1990,
  "Manila": 658,
  "Cebu": 1460,
  "Boracay": 2354,
  // East Asia
  "Tokyo": 2933,
  "Osaka": 1028,
  "Kyoto": 1044,
  "Hiroshima": 1019,
  "Okinawa": 1029,
  "Seoul": 1543,
  "Busan": 3698,
  "Jeju": 2551,
  "Beijing": 2,
  "Shanghai": 3,
  "Hong Kong": 8727,
  "Taipei": 3647,
  "Macau": 1549,
  // South Asia
  "Mumbai": 1521,
  "Delhi": 1522,
  "Goa": 3093,
  "Jaipur": 5487,
  "Colombo": 1960,
  "Maldives": 1958,
  "Kathmandu": 3280,
  // Middle East
  "Dubai": 2015,
  "Abu Dhabi": 2016,
  "Doha": 2182,
  // Europe
  "London": 4583,
  "Paris": 17563,
  "Rome": 16281,
  "Barcelona": 13047,
  "Amsterdam": 13089,
  "Berlin": 11798,
  "Prague": 14273,
  "Vienna": 16030,
  "Lisbon": 8315,
  "Madrid": 13054,
  "Athens": 11737,
  "Budapest": 11890,
  "Istanbul": 2622,
  // Americas
  "New York": 1,
  "Los Angeles": 18813,
  "Miami": 18799,
  "Las Vegas": 18784,
  "Cancun": 6781,
  // Oceania
  "Sydney": 19295,
  "Melbourne": 21400,
  "Auckland": 22000,
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
