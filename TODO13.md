# TODO13: Hotel — Photos & affiliate debugging

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports13.md (root burrowsoft-web-apps/Reports13.md) when done.

---

## Issue 1 — Hotel photos not visible (root cause: API returning 0 results)

**Problem:** Hotel cards show no photos because the Booking.com API (`/api/hotels`) is returning 0 results.
When zero hotels are returned, the app falls back to `generateHotels()` mock data, which has no `photoUrl`.

**Debug first:**

1. Check the hotel API endpoint in production:
```bash
curl "https://www.bookingmole.com/api/hotels?destination=Phuket&country=TH&checkin=2026-06-20&checkout=2026-06-23&guests=2&rooms=1"
```
Does it return hotels with `photoUrl` fields? If not, the Booking.com RapidAPI key or rate limits may be hit.

2. Check `src/app/api/hotels/route.ts` — is it catching errors silently and falling through?
Look for try/catch blocks that might be hiding API failures.

3. If the API is working but returns empty for specific destinations (Phuket, Paris, Bangkok), 
the Booking.com API free tier may have limited inventory. Switch the test date to a closer future date
(e.g., 2026-06-10 instead of 2026-06-20).

**If API is working:** photos should appear once real results come through — no code change needed.

**If API is broken:** You may need to:
- Verify `RAPIDAPI_KEY` is set correctly in Vercel env vars
- Check RapidAPI console for rate limit/billing issues
- Consider switching to a different hotel provider (check shared providers list)

---

## Issue 2 — Trip.com flights return empty (JFK→BKK)

**Problem:** `https://www.trip.com/flights/JFK-BKK/tickets-JFK-BKK?...` shows 0 results when navigating from the affiliate link.

**Root cause:** Trip.com's URL format may have changed, or the params are missing/wrong.

**Debug:**

1. Test the URL structure manually. Does Trip.com accept `/flights/{from}-{to}/tickets-{from}-{to}?` format?
   Try `https://www.trip.com/flights/` directly and search for JFK→BKK to see the resulting URL.

2. Check the params in `packages/shared/src/affiliates/flights.ts`:
   - `flighttype: "D"` (roundtrip) — is it being set correctly?
   - `dcity` and `acity` — are they uppercase IATA codes?
   - `ddate` and `rdate` — are they in YYYY-MM-DD format?

3. If the URL structure is correct, Trip.com may simply not have inventory for JFK→BKK on those dates.
   Try a different route (e.g., Bangkok to Phuket, both Asian airports) to isolate whether it's a
   URL issue or an inventory issue.

**If URL is wrong:** Update the `buildUrl()` function to match Trip.com's current expected format.

**If inventory issue:** This is expected — Trip.com is thin on some routes. The affiliate link should
gracefully handle the "no results" page, or you should only show Trip.com for routes you've verified
have inventory.

---

## Issue 3 — Trip.com hotels show Bangkok, not Phuket

**Problem:** Navigate to Phuket, the search box shows "Phuket", but the results page shows Bangkok hotels.

**Root cause:** Trip.com's destination matching may be fuzzy or case-sensitive. The `display`, `optionType`, 
`optionName` params in `packages/shared/src/affiliates/hotels.ts` may need adjustment.

**Debug:**

1. Manually test Trip.com's hotel search:
   - Go to `https://www.trip.com/hotels/`
   - Search for "Phuket" in the search box
   - Check what URL is generated — does it contain a city code (e.g., `cid=1234`) instead of a name?

2. If Trip.com uses city IDs instead of names, you'll need a mapping:
```ts
const TRIP_COM_CITY_ID: Record<string, string> = {
  "Phuket": "cid_12345",
  "Bangkok": "cid_67890",
  ...
};
```
Then use `cid` param instead of `display`/`optionName`.

3. Check the actual redirect URL that gets generated when the user clicks the Trip.com affiliate link.
   Does it match what a manual Trip.com search produces?

**If URL format is wrong:** Update `buildUrl()` in `packages/shared/src/affiliates/hotels.ts` to use the correct params.

**If it's a Trip.com bug:** Trip.com may have poor affiliate URL support — consider removing it
entirely or limiting it to a curated list of destinations you've verified work.

---

## Commit and push

Once you've identified the root causes, create fixes or a summary of what needs to be done externally
(e.g., "Trip.com needs city IDs instead of names" or "Booking.com API is rate-limited").

```bash
git add -A
git commit -m "debug: hotel photo API, Trip.com affiliate issues"
git push origin master
```
