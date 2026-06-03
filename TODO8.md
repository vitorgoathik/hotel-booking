# TODO8: Hotel Search — Affiliate Deep Links Section

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Fill in Reports8.md when done.

## Overview

Add an "Also search on" affiliate section to the hotel search results page.
Keep all existing hotel results (RapidAPI / booking-com15) exactly as-is.
Below the results, show branded deep-link cards to Expedia and Trip.com,
pre-filled with the user's destination, dates, guests, and rooms.

No widget. No toggle. Just a clean set of cards at the bottom.

---

## 1. New component: `HotelAffiliateLinks`

Create `src/components/HotelAffiliateLinks.tsx` (client component).

Props:
```ts
interface Props {
  destination: string;  // city name e.g. "Bangkok"
  checkin: string;      // YYYY-MM-DD
  checkout: string;     // YYYY-MM-DD
  guests: number;
  rooms: number;
  country: string;      // ISO-3166-1 from detectCountry() — for future country-gated partners
}
```

Implementation:
```tsx
"use client";

import { buildHotelAffiliateLinks } from "@burrowsoft/shared";

export function HotelAffiliateLinks({ destination, checkin, checkout, guests, rooms, country }: Props) {
  const links = buildHotelAffiliateLinks({ destination, checkin, checkout, guests, rooms, country });
  if (links.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Also search on</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200
                       bg-white px-5 py-4 shadow-sm hover:shadow-md hover:border-blue-300
                       transition-all group"
          >
            <div>
              <div className="font-semibold text-slate-900">{link.name}</div>
              <div className="text-sm text-slate-500 mt-0.5">{link.description}</div>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm
                            group-hover:gap-2.5 transition-all">
              Search
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

---

## 2. Wire into `/search` page

In `src/app/search/page.tsx`, import and add `<HotelAffiliateLinks>` after the existing results.

The page already has `destination`, `checkin`, `checkout`, `guests`, `rooms`, and `country`
parsed from search params — pass them straight through.

```tsx
import { HotelAffiliateLinks } from "@/components/HotelAffiliateLinks";

// After the existing <SearchPageClient> / results section:
<HotelAffiliateLinks
  destination={destination}
  checkin={checkin}
  checkout={checkout}
  guests={guests}
  rooms={rooms}
  country={country}
/>
```

Note: `country` is already detected in the search page via `detectCountry()`.
If it's not currently in scope, add:
```ts
import { detectCountry } from "@burrowsoft/shared";
import { headers } from "next/headers";
const country = detectCountry(Object.fromEntries((await headers()).entries()));
```

---

## 3. Shared utility (already prepared — just import)

`@burrowsoft/shared` exports `buildHotelAffiliateLinks`.

Function signature:
```ts
buildHotelAffiliateLinks(params: {
  destination: string;
  checkin: string;
  checkout: string;
  guests: number;
  rooms: number;
  country: string;
}): HotelAffiliateLink[]
```

Currently returns Expedia + Trip.com for all countries.
Future partners (Agoda once approved, Milhas hotels for BR, etc.) just need adding
to the shared affiliates config — no component changes needed.

---

## 4. Affiliate credentials (hardcoded in shared utility, DO NOT change)

**Expedia Hotels:**
- clickref: `1101lDpu7jFI`
- affcid: `AU.DIRECT.PHG.1011l432356.1100l86802`
- afflid: `1101lDpu7jFI`
- affdtl: `PHG.1101lDpu7jFI.PZGjHMQLvC`

**Trip.com Hotels:**
- Allianceid: `8495775`
- SID: `316966000`
- trip_sub3: `D17566096`

---

## 5. What NOT to build

- Do NOT remove or modify the existing hotel results from RapidAPI
- Do NOT add any widgets
- Do NOT add a toggle or radio buttons — the affiliate section is always visible
- Do NOT add loading states for the cards — they are plain links, instant

---

## 6. Commit and push

```bash
git add -A
git commit -m "feat: hotel search — affiliate deep links (Expedia + Trip.com)"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```
