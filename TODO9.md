# TODO9: Hotel — Replace affiliate buttons with Expedia + Trip.com only

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports9.md (root burrowsoft-web-apps/Reports9.md) when done.

## Overview

Two targeted fixes. Do not touch anything else.

---

## Fix 1: BookingModal.tsx — "Other platforms" section

File: `src/components/BookingModal.tsx`

**Current behaviour:** Lines ~441–462 render "other platforms" from `getBookingOptions()`
which returns Agoda, Hotels.com, Expedia, Kayak, Google Hotels.

**Required behaviour:** Show only **Expedia** and **Trip.com**, built from `buildHotelAffiliateLinks`.

### Steps

1. Add import at top:
```ts
import { buildHotelAffiliateLinks } from "@burrowsoft/shared";
```

2. Replace the `options` variable (currently from `getBookingOptions`) with:
```ts
const affiliateLinks = buildHotelAffiliateLinks({
  destination: hotel.city,
  checkin,
  checkout,
  guests,
  rooms,
  country: "", // country not needed here — all links are worldwide
});
```

3. Replace the entire "Other platforms" `<div>` block (lines ~441–462) with:
```tsx
{affiliateLinks.length > 0 && (
  <div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {t("otherPlatforms")}
    </p>
    <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">
      {affiliateLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        >
          <span className="text-sm font-semibold text-slate-800">{link.name}</span>
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
            {t("searchLink")}
          </span>
        </a>
      ))}
    </div>
  </div>
)}
```

4. Remove the old `getBookingOptions` import from `@/lib/affiliate` if it is no longer used elsewhere in this file.

5. Keep the Booking.com primary CTA block (lines ~419–439) exactly as-is.

---

## Fix 2: HotelCard.tsx — list view buttons

File: `src/components/HotelCard.tsx`

**Current behaviour:** Two buttons — "Book at Booking.com" + "Compare all prices" (opens modal).

**Required behaviour:** "Book at Booking.com" stays. Replace the "Compare all prices"
button with two small side-by-side buttons: **Expedia** and **Trip.com**.

### Steps

1. Add import at top:
```ts
import { buildHotelAffiliateLinks } from "@burrowsoft/shared";
```

2. Inside the component, derive affiliate links from the hotel's search context.
   The card already has access to `hotel.city`, `checkin`, `checkout`, `guests`, `rooms`
   (check the props — if `checkin`/`checkout`/`guests`/`rooms` are not props, read them
   from `useSearchParams()` or pass them down from `SearchPageClient`).

3. Replace the "Compare all prices" `<button>` with:
```tsx
{(() => {
  const links = buildHotelAffiliateLinks({
    destination: hotel.city,
    checkin,
    checkout,
    guests,
    rooms,
    country: "",
  });
  return (
    <div className="flex gap-1.5">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-2 py-2
                     text-center text-xs font-medium text-slate-600
                     hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          {link.name} ↗
        </a>
      ))}
    </div>
  );
})()}
```

4. Keep the Booking.com `<a>` button exactly as-is above these new buttons.

5. If `onSelect` / modal is no longer triggered from the card, the prop can remain
   but just not be used — do not remove it from the interface as `SearchPageClient`
   may still pass it.

---

## What NOT to change

- The Booking.com primary booking flow (modal, price, CTA) — leave completely intact
- `HotelAffiliateLinks` component added by TODO8 — leave as-is
- Any other component, page, or API route
- Do NOT add "highlight cheapest" logic — we only have Booking.com price from the API,
  no Expedia/Trip.com prices to compare against. Skip this entirely.

---

## Commit and push

```bash
git add -A
git commit -m "fix: hotel affiliate buttons — Expedia + Trip.com only (modal + card)"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```
