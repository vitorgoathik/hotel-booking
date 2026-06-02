# BookingMole — Thailand / SEA API Integration

> Work on this AFTER localisation (TODO4) is complete.

## What the user needs to arrange

| Platform | Registration | Notes |
|---|---|---|
| **Agoda Partner Hub** | https://partnerhub.agoda.com | Affiliate Lite API v2. 10–20% commission. Best Thailand hotel inventory. |
| **Trip.com Developers** | https://developers.trip.com/ | Hotel + flight API. Critical for Chinese tourist segment visiting Thailand. |

New env vars: `AGODA_API_KEY` + `AGODA_SITE_ID`, `TRIP_COM_API_KEY`, `NEXT_PUBLIC_AGODA_CID`, `NEXT_PUBLIC_TRIP_COM_AID`.

## Tasks

### 1. AgodaHotelProvider
File: `packages/shared/src/providers/hotels/agoda.ts`
- Base URL: `https://affiliateapi7643.agoda.com/affiliateservice/lt2/`
- Auth: `Authorization: token {AGODA_API_KEY}` + `site_id` param
- Search: `POST /api/v3/property/availability`
- Normalize to `Hotel` DTO
- Booking redirect: `https://www.agoda.com/hotel/{hotel_id}?cid={AGODA_CID}&checkIn={date}&checkOut={date}&adults={n}`
- Gate: `process.env.AGODA_API_KEY` + country in SEA list

### 2. TripComHotelProvider
File: `packages/shared/src/providers/hotels/tripcom.ts`
- Base URL: `https://openapi.trip.com/`
- Auth: API key header
- Gate: `process.env.TRIP_COM_API_KEY` + country in `["TH","CN","HK","TW","SG","MY"]`

### 3. Country priority in createHotelRouter
```
TH, MY, SG, ID, PH, VN, KH → Agoda first, then Booking.com
CN, HK, TW → Trip.com first, then Booking.com
All others → Booking.com only
```

### 4. Popular Thai hotel destinations
When locale is `th`, add to city autocomplete: Bangkok, Phuket, Chiang Mai, Koh Samui, Pattaya, Krabi, Hua Hin, Koh Phangan, Pai, Chiang Rai.

### 5. Sync packages/shared after changes
Copy to: flight-booking, news-feed, rent-a-car, main-website, games, shopping.
