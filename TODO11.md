# TODO11: Hotel — 2 fixes

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports11.md (root burrowsoft-web-apps/Reports11.md) when done.

---

## Fix 1 — Remove Booking.com button from BookingModal right panel

File: `src/components/BookingModal.tsx`

The right panel currently has:
1. A dark Booking.com CTA block (shows price + "Book at Booking.com" button)
2. An "Other platforms" section with Expedia + Trip.com

**Required:** Remove the Booking.com CTA block entirely. Keep only the
Expedia + Trip.com section (already built with `buildHotelAffiliateLinks`).

Find the block that looks like this (around line 419–439):
```tsx
{/* Primary CTA — Booking.com */}
{options.filter((o) => o.isBookingCom).map((opt) => (
  <a key={opt.label} href={opt.url} ... >
    ...Booking.com...
  </a>
))}
```
Delete it entirely.

Keep the price display block above it (subtotal, taxes, total) — that information
is still useful. Just remove the Booking.com booking button/link.

After this change `getBookingOptions` and the `options` variable are no longer used
in BookingModal. Remove the import and variable to keep the file clean.

The right panel should then show:
- Price summary (subtotal, taxes, total) — KEEP
- Room types (if loaded) — KEEP  
- "Also search on" section with Expedia + Trip.com — KEEP
- The footer note — KEEP

---

## Fix 2 — Trip.com appearing for non-Asian destinations (e.g. Paris)

**Already fixed in shared.** `packages/shared/src/affiliates/hotels.ts` has been
updated to use `isAsianDestination()` — destination-based filtering using a city
name lookup, replacing the old visitor-country filter.

Paris → **Expedia only**.
Bangkok → **Expedia + Trip.com**.

No code change needed in the app. Just commit the updated shared file and deploy.

---

## Commit and push

```bash
git add -A
git commit -m "fix: remove Booking.com modal button, Trip.com Asian destination filter"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```
