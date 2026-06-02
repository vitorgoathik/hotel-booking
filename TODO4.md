# BookingMole — TODO4: Thailand/SEA Region-Specific APIs

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports4.md when done.

## Overview
Agoda is the dominant hotel booking platform in Thailand — it was founded in Bangkok and has the deepest local inventory and cheapest prices. Trip.com is critical for reaching the Chinese tourist segment visiting Thailand. Both should be added as primary providers for TH/SEA users.

---

## What the user needs to arrange first

| Platform | Registration | Notes |
|---|---|---|
| **Agoda Partner Hub** | https://partnerhub.agoda.com | Apply for Affiliate API access. Provides Affiliate Lite API v2. Commission 10–20%. |
| **Trip.com Developers** | https://developers.trip.com/ | Register as developer. Hotel search + booking API. Important for Chinese market in Thailand. |

New env vars to add to Vercel (hotel-booking project):
- `AGODA_API_KEY` + `AGODA_SITE_ID` (from Partner Hub)
- `TRIP_COM_API_KEY` (from developers.trip.com)
- `NEXT_PUBLIC_AGODA_CID` — affiliate CID for booking redirect links (user already registering for this separately)
- `NEXT_PUBLIC_TRIP_COM_AID` — affiliate ID for Trip.com redirect links

---

## Architecture
Add `AgodaHotelProvider` and `TripComHotelProvider` to shared lib, gated on country.

Country priority in `createHotelRouter(country)`:
```ts
// TH, MY, SG, ID, PH, VN, KH, LA, MM: Agoda first (best SEA inventory)
// CN, HK, TW: Trip.com first
// All: Booking.com as fallback
```

---

## Tasks

### 1. AgodaHotelProvider
File: `packages/shared/src/providers/hotels/agoda.ts`

Agoda Affiliate Lite API v2:
- Docs: https://partners.agoda.com/Content/Documents/AffiliateLiteApi/Affiliate_Lite_API_V2.0.pdf
- Base URL: `https://affiliateapi7643.agoda.com/affiliateservice/lt2/`
- Auth: `Authorization: token {AGODA_API_KEY}` header + `site_id` param
- Hotel search endpoint: `POST /api/v3/property/availability` with check-in/out dates, location, guests
- Response: property name, address, star rating, price per night, photos, reviews score
- Normalize to `Hotel` DTO
- Booking redirect URL: `https://www.agoda.com/hotel/{hotel_id}?cid={AGODA_CID}&checkIn={date}&checkOut={date}&adults={n}`

Register in `createHotelRouter()` gated on `process.env.AGODA_API_KEY`.

### 2. TripComHotelProvider
File: `packages/shared/src/providers/hotels/tripcom.ts`

Trip.com Hotel API:
- Base URL: `https://openapi.trip.com/` (verify exact path in Trip.com developer docs)
- Auth: API key in header
- Search: hotel list by city + dates
- Response: hotel name, images, price, star rating, reviews
- Normalize to `Hotel` DTO
- Booking redirect: `https://www.trip.com/hotels/{city}/?checkIn={date}&checkOut={date}&adult={n}&aid={TRIP_COM_AID}`

Register in `createHotelRouter()` gated on `process.env.TRIP_COM_API_KEY`.

### 3. Update createHotelRouter to accept country
File: `packages/shared/src/providers/hotels/index.ts`
- Accept optional `country` param
- SEA countries → Agoda first, then Booking.com
- CN/HK/TW → Trip.com first, then Booking.com
- Update `hotel-booking/src/app/api/hotels/route.ts` to pass country from `detectCountry(headers)`

### 4. Side-by-side price comparison
The `BookingModal` already supports multiple providers — ensure:
- When Agoda returns results, show "Book on Agoda ↗" alongside "Book on Booking.com ↗"
- Price comparison clearly labels which is cheaper
- Agoda CID affiliate param appended to all Agoda booking URLs

### 5. Popular Thai hotel destinations
When locale is `th`, show Thai city suggestions in the destination autocomplete:
- Bangkok, Phuket, Chiang Mai, Koh Samui, Pattaya, Krabi, Hua Hin, Koh Phangan, Pai, Chiang Rai

### 6. Sync packages/shared to all apps after changes
After editing any shared hotel provider file, copy `packages/shared/` to: flight-booking, news-feed, rent-a-car, main-website, games, shopping.
