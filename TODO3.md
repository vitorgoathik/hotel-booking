# BookingMole — TODO3: Thai Localisation + Language Selector

## Permissions
Ask the user to enable bypass permissions before starting: `claude --dangerously-skip-permissions`.

## Please fill in Reports3.md when done.

## Overview
When a user visits from Thailand (`x-vercel-ip-country: TH`), the app defaults to Thai. All users get a language selector (EN / TH) in the header.

## Architecture: `next-intl` with cookie-based locale (no URL changes)
- Install `next-intl`
- Messages: `src/messages/en.json` and `src/messages/th.json`
- Locale in `NEXT_LOCALE` cookie — set by middleware on first visit, updatable by user
- Locale detection: cookie → `detectCountry()` → TH defaults to `th`, else `en`

## Tasks

### 1. Install and configure next-intl
```bash
npm install next-intl
```
- `src/i18n.ts` — reads `NEXT_LOCALE` cookie
- `src/middleware.ts` — detects country, sets cookie on first visit
- Wrap root layout with `NextIntlClientProvider`

### 2. Translation files

**`src/messages/en.json`**
```json
{
  "nav": { "home": "BookingMole", "search": "Find Hotels" },
  "hero": {
    "title": "Find & Compare Hotels. Real Prices.",
    "subtitle": "Compare hotels from Booking.com, Agoda, and more."
  },
  "search": {
    "destination": "Destination",
    "checkin": "Check-in",
    "checkout": "Check-out",
    "guests": "Guests",
    "rooms": "Rooms",
    "search": "Search Hotels"
  },
  "results": {
    "found": "{count} hotels found",
    "noneFound": "No hotels found for this search.",
    "pricesAsOf": "Prices as of {time}",
    "perNight": "per night",
    "bookOn": "Book on {provider}",
    "viewMap": "View on map",
    "loading": "Loading hotels from {provider}…",
    "unavailable": "{provider} unavailable",
    "amenities": "Amenities",
    "reviews": "Reviews",
    "roomTypes": "Room Types",
    "photos": "Photos",
    "bestPrice": "Best price",
    "freeCancellation": "Free cancellation",
    "breakfastIncluded": "Breakfast included"
  },
  "footer": { "tagline": "Digging deep. Building solutions." }
}
```

**`src/messages/th.json`**
```json
{
  "nav": { "home": "BookingMole", "search": "ค้นหาโรงแรม" },
  "hero": {
    "title": "ค้นหาและเปรียบเทียบโรงแรม ราคาจริง",
    "subtitle": "เปรียบเทียบราคาโรงแรมจาก Booking.com, Agoda และอื่นๆ"
  },
  "search": {
    "destination": "ปลายทาง",
    "checkin": "เช็คอิน",
    "checkout": "เช็คเอาท์",
    "guests": "ผู้เข้าพัก",
    "rooms": "จำนวนห้อง",
    "search": "ค้นหาโรงแรม"
  },
  "results": {
    "found": "พบ {count} โรงแรม",
    "noneFound": "ไม่พบโรงแรมสำหรับการค้นหานี้",
    "pricesAsOf": "ราคา ณ เวลา {time}",
    "perNight": "ต่อคืน",
    "bookOn": "จองที่ {provider}",
    "viewMap": "ดูบนแผนที่",
    "loading": "กำลังโหลดโรงแรมจาก {provider}…",
    "unavailable": "{provider} ไม่พร้อมใช้งาน",
    "amenities": "สิ่งอำนวยความสะดวก",
    "reviews": "รีวิว",
    "roomTypes": "ประเภทห้องพัก",
    "photos": "รูปภาพ",
    "bestPrice": "ราคาดีที่สุด",
    "freeCancellation": "ยกเลิกได้ฟรี",
    "breakfastIncluded": "รวมอาหารเช้า"
  },
  "footer": { "tagline": "ค้นหาลึก สร้างสรรค์โซลูชัน" }
}
```

### 3. Language selector component
File: `src/components/LanguageSelector.tsx` — client component, flag emoji + code (🇬🇧 EN / 🇹🇭 TH), sets `NEXT_LOCALE` cookie + `router.refresh()`. Place in header.

### 4. Replace hardcoded strings in all components
Priority: `layout.tsx`, `search/page.tsx`, `SearchPageClient.tsx`, `HotelCard.tsx`, `HotelLoadingOverlay.tsx`, `BookingModal.tsx`.

### 5. Thai font support
```tsx
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600", "700"] });
```

### 6. Currency
`getCurrencyForCountry("TH")` returns `"THB"`. Show hotel prices in THB when locale is `th` if provider returns THB prices; otherwise show original currency with a note.
