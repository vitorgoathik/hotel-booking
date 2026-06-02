# BookingMole — API Integration TODO

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `RAPIDAPI_KEY` — booking-com15 (hotels endpoint)
- `OPENAI_API_KEY` — AI summaries

## ⚠️ Vercel Env Var Discrepancy
Vercel has both `RAPIDAPI_KEY` (Production only) and `RAPID_API_KEY` (Production + Preview). The codebase uses `RAPIDAPI_KEY`. Confirm which is correct and remove the duplicate from Vercel.

## Tasks

### 1. Hotel photos
RapidAPI host: `booking-com15.p.rapidapi.com`
Endpoint: `GET /api/v1/hotels/getHotelPhotos?hotel_id=...`
- Fetch and display the first 5–10 photos per hotel in a gallery carousel on the hotel card and detail page
- Use Next.js `<Image>` with the domains already whitelisted in `next.config.ts` (add Booking.com CDN domains if missing)

### 2. Hotel reviews
Endpoint: `GET /api/v1/hotels/getHotelReviews?hotel_id=...`
- Display aggregated score, total review count, and 3 recent review snippets on the detail page
- Map score to star display (0–10 scale → 5 stars)

### 3. Hotel amenities
Endpoint: `GET /api/v1/hotels/getHotelDetails?hotel_id=...`
- Extract and display amenities list (pool, WiFi, parking, breakfast, etc.)
- Show as icon+label chips on the hotel card

### 4. Room types and real pricing
Endpoint: `GET /api/v1/hotels/getRooms?hotel_id=...`
- Show available room types with per-night prices
- Cheapest room price should appear on the search results card
- Link "Book" button to the Booking.com affiliate URL with `NEXT_PUBLIC_BOOKING_AID`

### 5. Location / map
- Extract lat/lng from hotel details response
- Embed a static map image (Google Maps Static API, no key needed for basic usage) or link to Google Maps

### 6. Add Agoda as a second provider
File: create `packages/shared/src/providers/hotels/agoda.ts`
RapidAPI has an Agoda hotels API — search RapidAPI for "agoda" to find the current endpoint.
Requires new env var: `AGODA_RAPIDAPI_KEY` (may share the same `RAPIDAPI_KEY` subscription — check)
- Implement `AgodaHotelProvider` implementing `Provider<HotelSearchParams, Hotel>`
- Register in `packages/shared/src/providers/hotels/index.ts` `createHotelRouter()`
- On results page, show Booking.com price vs Agoda price side by side per hotel

### 7. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, news-feed, rent-a-car, main-website, games, shopping.
