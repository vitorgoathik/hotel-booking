export interface HotelAffiliateLink {
  id: string;
  name: string;
  description: string;
  url: string;
}

interface HotelSearchParams {
  destination: string;  // city name e.g. "Bangkok"
  checkin: string;      // YYYY-MM-DD
  checkout: string;     // YYYY-MM-DD
  guests: number;
  rooms: number;
  country: string;      // ISO-3166-1 visitor country (reserved for future geo-gating)
}

const AFFILIATES: Array<HotelAffiliateLink & {
  buildUrl: (p: HotelSearchParams) => string;
}> = [
  {
    id: "expedia",
    name: "Expedia",
    description: "Compare hotels with free cancellation options",
    url: "",
    buildUrl: ({ destination, checkin, checkout, guests, rooms }) => {
      const params = new URLSearchParams({
        destination,
        startDate: checkin,
        endDate: checkout,
        d1: checkin,
        d2: checkout,
        rooms: String(rooms),
        adults: String(guests),
        sort: "RECOMMENDED",
        useRewards: "false",
        clickref: "1101lDpu7jFI",
        affcid: "AU.DIRECT.PHG.1011l432356.1100l86802",
        ref_id: "1101lDpu7jFI",
        my_ad: "AFF.AU.DIRECT.PHG.1011l432356.1100l86802",
        afflid: "1101lDpu7jFI",
        affdtl: "PHG.1101lDpu7jFI.PZGjHMQLvC",
      });
      return `https://www.expedia.com/Hotel-Search?${params}`;
    },
  },
  // ── Future partners ───────────────────────────────────────────────────────────
  // Agoda: add once affiliate approval received (agoda.p.rapidapi.com available)
  // Trip.com: no public RapidAPI; requires internal numeric city IDs — revisit
  //   once Trip.com developer portal access is obtained.
];

export function buildHotelAffiliateLinks(params: HotelSearchParams): HotelAffiliateLink[] {
  return AFFILIATES.map(({ buildUrl, ...rest }) => ({
    ...rest,
    url: buildUrl(params),
  }));
}
