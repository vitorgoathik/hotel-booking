export interface BookingOption {
  label: string;
  url: string;
  primary?: boolean;
  tracked: boolean;
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
function agodaUrl(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): string {
  const cid = process.env.NEXT_PUBLIC_AGODA_CID;
  const params = new URLSearchParams({
    textToSearch: city,
    checkIn: checkin,
    checkOut: checkout,
    rooms: String(rooms),
    adults: String(guests),
    children: "0",
    ...(cid ? { cid } : {}),
  });
  return `https://www.agoda.com/en-us/search?${params}`;
}

// ── Google Hotels ──────────────────────────────────────────────────────────────
// No affiliate program — kept as free fallback
function googleHotelsUrl(city: string, checkin: string, checkout: string): string {
  const q = `hotels in ${city}`;
  const params = new URLSearchParams({ q, dates: `${checkin},${checkout}` });
  return `https://www.google.com/travel/hotels?${params}`;
}

export function getBookingOptions(
  city: string,
  checkin: string,
  checkout: string,
  guests: number,
  rooms: number
): BookingOption[] {
  return [
    {
      label: "Book on Booking.com",
      url: bookingComUrl(city, checkin, checkout, guests, rooms),
      primary: true,
      tracked: !!process.env.NEXT_PUBLIC_BOOKING_AID,
    },
    {
      label: "Search on Hotels.com",
      url: hotelsComUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_HOTELSCOM_CID,
    },
    {
      label: "Compare on Agoda",
      url: agodaUrl(city, checkin, checkout, guests, rooms),
      tracked: !!process.env.NEXT_PUBLIC_AGODA_CID,
    },
    {
      label: "Google Hotels",
      url: googleHotelsUrl(city, checkin, checkout),
      tracked: false,
    },
  ];
}
