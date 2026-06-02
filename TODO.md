# BookingMole — API Integration TODO

IMPORTANT: PLEASE KEEP UPDATING YOUR SECTION IN ../Reports.md with
- status
- pending decisions
- pending actions
- concerns
- suggestions

## Permissions
Before starting work, ask the user to enable bypass permissions so you don't get approval prompts on every file operation. They can do this by opening Claude Code settings and setting permission mode to "bypass", or by launching with `claude --dangerously-skip-permissions`.

## Available API Keys (already set on Vercel)
- `RAPIDAPI_KEY` — booking-com15 (hotels endpoint)
- `OPENAI_API_KEY` — AI summaries

## ⚠️ Vercel Env Var Discrepancy
Vercel has both `RAPIDAPI_KEY` (Production only) and `RAPID_API_KEY` (Production + Preview). The codebase uses `RAPIDAPI_KEY`. Confirm which is correct and remove the duplicate from Vercel.

## Architecture: Client-Driven Fetching
All search calls must go through a Next.js API route (`/api/hotels`) rather than directly in server components. This enables the client to drive the loading overlay and show per-provider progress in real time.

Pattern:
1. User submits search → client calls `/api/hotels?...`
2. API route fans out to all providers concurrently via `ProviderRouter`
3. Client shows the loading overlay while awaiting the response
4. Results return as JSON; client renders them and dismisses the overlay

Wrap every provider call inside the API route with `unstable_cache` from `next/cache` (TTL: 10 min / `revalidate: 600`). Cache key = all search params stringified. Repeated identical searches within 10 minutes return cached data without burning RapidAPI quota.

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

### 7. Loading overlay — show while APIs are fetching
The search results page must show a loading overlay while provider calls are in flight. Requirements:
- Each active provider fetches concurrently; the overlay displays one animated line per provider, e.g. "Loading hotels from Booking.com…" / "Loading hotels from Agoda…"
- As each provider resolves, its line gets a checkmark and results stream in below
- If a provider fails, its line shows "Agoda unavailable" in muted text — no hard error
- Implement as a client component (`<HotelLoadingOverlay providers={string[]} />`)
- Overlay fades out once all providers have settled

### 8. Provider redirect buttons
Every hotel result card must have a labelled booking button per provider. Requirements:
- Button label: "Book on [Provider]" (e.g. "Book on Booking.com", "Book on Agoda")
- Each provider class must expose a `bookingUrl(hotel: Hotel, checkIn: string, checkOut: string, guests: number): string` method returning the deep-link with dates and guest count pre-filled
- Show all available provider buttons per hotel; highlight the cheapest
- Buttons open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Append affiliate params: `NEXT_PUBLIC_BOOKING_AID` for Booking.com, `NEXT_PUBLIC_AGODA_CID` for Agoda

### 9. Price staleness — auto-refresh after 5 minutes
Hotel prices and availability change regularly. Requirements:
- Client tracks the timestamp when results were last loaded
- After 5 minutes on the results page, silently re-call `/api/hotels` with the same params
- While refreshing, show the loading overlay with "Fetching up-to-date prices…" (same overlay component, reused)
- When fresh results arrive, update the list in place — no hard refresh, no scroll reset
- If the refresh fails, show a small toast: "Prices could not be refreshed — last updated at HH:MM"
- Always show a "Prices as of HH:MM" timestamp below the results header

### 10. Themed mascot — BookingMole
Create `public/mascot.svg` — the base BurrowSoft Mole with a fancy cocktail glass held in one paw and a beach parasol in the other (both paws visible above the ledge). Same black line-art stroke style. SVG groups: `<g id="mole-base">` and `<g id="prop">`. ViewBox: `0 0 200 200`.

### 11. App thumbnail / OG image
- `public/og-image.png` — 1200×630px, BookingMole mascot centred on brand background, "BookingMole" wordmark below
- `public/favicon.ico` — mole head only, 32×32 and 16×16
- `public/apple-touch-icon.png` — 180×180px, mole head on brand background
- Wire all into `src/app/layout.tsx` metadata

### 12. Footer — BurrowSoft branding
Add to the existing footer:
- Small BurrowSoft logo (mole + wordmark) linking to burrowsoft.com
- Links to sibling products: FlyMole, InsightMole, RentACarMole, GamesMole, ShoppingMole
- Copyright: "© 2025 BurrowSoft. All rights reserved."
Logo assets: copy `burrowsoft-logo.svg` from the main-website repo into `public/`.

### 13. Sync shared to all apps after any provider changes
After editing any file in `packages/shared/src/`, copy the entire `packages/shared/` folder to the same path in: flight-booking, news-feed, rent-a-car, main-website, games, shopping.
