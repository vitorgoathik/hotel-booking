# TODO12: Hotel — 2 fixes

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports12.md (root burrowsoft-web-apps/Reports12.md) when done.

---

## Fix 1 — Hotel list doesn't refresh when changing destination

**Problem:** When the user searches Paris, then changes to Phuket and hits search,
the hotel list stays on Paris results. The `SearchPageClient` component has no `key`
prop, so React keeps the same component instance and internal state when the URL
changes, even though the `destination` prop changes.

**File:** `src/app/search/page.tsx`

Add a `key` prop to `<SearchPageClient>` that changes whenever the search params change:

```tsx
<SearchPageClient
  key={`${destination}-${checkin}-${checkout}-${guests}-${rooms}`}
  destination={destination}
  country={country}
  checkin={checkin}
  checkout={checkout}
  guests={guests}
  rooms={rooms}
  nights={nights}
/>
```

This forces React to fully unmount and remount `SearchPageClient` on each new search,
triggering a fresh API fetch. Without `key`, React reuses the component instance and
the `useEffect` may not re-fire cleanly due to stale closures.

Also add the same `key` to `<HotelAffiliateLinks>` just below it:
```tsx
<HotelAffiliateLinks
  key={`aff-${destination}-${checkin}-${checkout}`}
  destination={destination}
  ...
/>
```

---

## Fix 2 — Hotel photos not visible

**Problem:** The photo `<img>` has `className="hidden sm:block ..."` which hides it
on screens narrower than 640px (mobile). The user is likely viewing at a width where
the image is hidden.

**File:** `src/components/HotelCard.tsx`

Change the image className to always show, but sized appropriately:

```tsx
<img
  src={hotel.photoUrl}
  alt={hotel.name}
  className="w-full h-40 object-cover sm:w-32 sm:h-full sm:rounded-l-xl rounded-t-xl shrink-0"
/>
```

- Mobile: full-width image on top of the card (like a hotel card on Booking.com mobile)
- Desktop: left-side thumbnail

Also verify the outer `<article>` has `flex-col sm:flex-row` so the image stacks
vertically on mobile and sits beside the content on desktop:

```tsx
<article className="flex flex-col sm:flex-row overflow-hidden rounded-xl border ...">
```

---

## Commit and push

```bash
git add -A
git commit -m "fix: hotel search refresh on new destination, photos visible on mobile"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```
