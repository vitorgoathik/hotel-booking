# TODO10: Hotel card — Details button + hotel photo thumbnail

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports10.md (root burrowsoft-web-apps/Reports10.md) when done.

## Two small changes to HotelCard.tsx only. Do not touch anything else.

---

## Change 1 — Replace "Book at Booking.com" button with "Details"

File: `src/components/HotelCard.tsx`

**Current:** large orange `<a href={bookUrl}>จองที่ Booking.com ↗</a>` button as primary CTA.

**Required:** replace it with a "Details" button that opens the modal (same behaviour
as the old "Compare all prices" button used to do — calls `onSelect(hotel)`).

The `onSelect` prop is already on the component. Use it.

```tsx
<button
  onClick={() => onSelect(hotel)}
  className="block w-full rounded-xl bg-amber-600 px-4 py-2.5 text-center
             text-sm font-semibold text-white hover:bg-amber-700
             active:bg-amber-800 transition-colors"
>
  {t("details")}
</button>
```

Add translation key `"details"` to all locale message files under `src/messages/`:
- `en.json`: `"details": "Details"`
- `th.json`: `"details": "รายละเอียด"`
- All other locales: translate accordingly

The Expedia ↗ and Trip.com ↗ buttons added in TODO9 stay exactly as-is below this button.

The old `bookUrl` variable and `getBookingOptions` import can be removed from
HotelCard.tsx if they are no longer used anywhere else in the file.

---

## Change 2 — Add hotel photo thumbnail to the card

File: `src/components/HotelCard.tsx`

`hotel.photoUrl` is already available on the `Hotel` type. Add a thumbnail image
on the left side of the card (before the hotel name/stars content).

Add at the very start of the card's inner content area:

```tsx
{hotel.photoUrl && (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={hotel.photoUrl}
    alt={hotel.name}
    className="h-32 w-full rounded-xl object-cover sm:h-full sm:w-36 sm:rounded-l-xl sm:rounded-r-none shrink-0"
  />
)}
```

The card's outer container likely uses `flex flex-col sm:flex-row`. The image should
be the first child so it appears on the left on desktop, top on mobile.

If the card already has a flex layout, just prepend the image. If it doesn't, wrap
the existing content in a `<div className="flex-1 p-4">` and add the image beside it:

```tsx
<article className="... flex flex-col sm:flex-row overflow-hidden">
  {hotel.photoUrl && (
    <img src={hotel.photoUrl} alt={hotel.name}
      className="h-48 w-full object-cover sm:h-auto sm:w-40 shrink-0" />
  )}
  <div className="flex-1 p-4 sm:p-5">
    {/* existing card content */}
  </div>
</article>
```

If `hotel.photoUrl` is null/undefined, the card renders as before (no layout shift).

---

## Do NOT change

- BookingModal.tsx — the popup is already correct
- HotelAffiliateLinks component
- Any API routes
- The Expedia / Trip.com buttons

---

## Commit and push

```bash
git add -A
git commit -m "feat: hotel card — Details button + photo thumbnail"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```
