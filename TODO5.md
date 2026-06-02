# BookingMole — TODO5: Adopt Shared RegionalFloatingAd + Commit TODO4

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports5.md when done.

## Pending from TODO4 (uncommitted — verify then commit)
- `src/app/layout.tsx` — imports `LanguageSelector` from `@burrowsoft/shared`
- `src/app/page.tsx` — hero strings translated
- `src/components/HotelSearchForm.tsx` — search form strings wired to i18n
- `src/messages/en.json` + `th.json` — any additions

## Replace local ThaiFloatAd with shared RegionalFloatingAd
Delete `src/components/ThaiFloatAd.tsx` (TODO4 instance used a different name).

In `src/app/layout.tsx`:
```tsx
import { RegionalFloatingAd } from "@burrowsoft/shared";
<RegionalFloatingAd />
```

## Fix amadeus.ts in packages/shared
The TODO4 instance modified `packages/shared/src/providers/flights/amadeus.ts` instead of deleting it.
Delete `packages/shared/src/providers/flights/amadeus.ts`.

## Verify end-to-end
- EN: no floating ad
- TH: Lazada ad appears, dismissible
- Language dropdown works

## Commit and push + fill Reports5.md