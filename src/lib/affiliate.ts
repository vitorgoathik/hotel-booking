export interface BookingOption {
  label: string;
  url: string;
  tracked: boolean;
  isBookingCom?: boolean;
}

// ── Booking.com ───────────────────────────────────────────────────────────────
function bookingComUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number,
  hotelId?: number,
  destId?: string,
): string {
  const aid = process.env.NEXT_PUBLIC_BOOKING_AID;
  const params = new URLSearchParams({
    ss: city,
    checkin,
    checkout,
    group_adults: String(guests),
    no_rooms: String(rooms),
    lang: "en-us",
    ...(hotelId  ? { highlighted_hotels: String(hotelId) } : {}),
    ...(destId   ? { dest_id: destId, dest_type: "city" } : {}),
    ...(aid      ? { aid } : {}),
  });
  return `https://www.booking.com/searchresults.en.html?${params}`;
}

// ── Hotels.com ────────────────────────────────────────────────────────────────
function hotelsComUrl(city: string, checkin: string, checkout: string, guests: number, rooms: number): string {
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
const AGODA_CITY_IDS: Record<string, number> = {
  "Bangkok": 6,
  "Singapore": 332,
};

function agodaUrl(city: string, checkin: string, checkout: string, guests: number, rooms: number): string {
  const cid = process.env.NEXT_PUBLIC_AGODA_CID;
  const cityId = AGODA_CITY_IDS[city];
  const params = new URLSearchParams({
    ...(cityId ? { city: String(cityId), searchType: "city" } : { textToSearch: city }),
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
function expediaUrl(city: string, checkin: string, checkout: string, guests: number, rooms: number): string {
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
function kayakUrl(city: string, checkin: string, checkout: string, guests: number): string {
  const slug = encodeURIComponent(city.toLowerCase().replace(/\s+/g, "-"));
  return `https://www.kayak.com/hotels/${slug}/${checkin}/${checkout}/${guests}adults`;
}

// ── Google Hotels ──────────────────────────────────────────────────────────────
function googleHotelsUrl(city: string, checkin: string, checkout: string): string {
  const params = new URLSearchParams({ q: `hotels in ${city}`, checkin, checkout });
  return `https://www.google.com/travel/hotels?${params}`;
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function getBookingOptions(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number,
  hotelId?: number,
  destId?: string,
): BookingOption[] {
  return [
    {
      label: "Booking.com",
      url: bookingComUrl(city, checkin, checkout, guests, rooms, hotelId, destId),
      tracked: !!process.env.NEXT_PUBLIC_BOOKING_AID,
      isBookingCom: true,
    },
    {
      label: "Agoda",
      url: agodaUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_AGODA_CID,
    },
    {
      label: "Hotels.com",
      url: hotelsComUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_HOTELSCOM_CID,
    },
    {
      label: "Expedia",
      url: expediaUrl(city, checkin, checkout, guests, rooms),
      tracked: false,
    },
    {
      label: "Kayak",
      url: kayakUrl(city, checkin, checkout, guests),
      tracked: false,
    },
    {
      label: "Google Hotels",
      url: googleHotelsUrl(city, checkin, checkout),
      tracked: false,
    },
  ];
}
