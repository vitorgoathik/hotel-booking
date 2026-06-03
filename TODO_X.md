# TODO_X: SEO — Google Crawlability & Structured Data

## App: hotel-booking (https://www.bookingmole.com)

## Permissions
Run with: `claude --dangerously-skip-permissions`

## Do NOT fill a Reports file for this TODO. Just commit and push when done.

## Overview
Three SEO tasks. Do all three. Do NOT change any existing functionality, API routes, or UI.

---

## Task 1 — WebSite JSON-LD in layout.tsx

Add a `<script type="application/ld+json">` tag inside the `<body>` of`src/app/layout.tsx`.

`	sx
const WEBSITE_SCHEMA = { /* see App-specific section below */ };

// Inside the layout return, inside <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
/>
`"

---

## Task 2 — hreflang alternate links

Add to the root `metadata` export in `src/app/layout.tsx`:

`	s
alternates: {
  languages: {
    "en": "https://www.bookingmole.com",
    "th": "https://www.bookingmole.com",
    "es": "https://www.bookingmole.com",
    "ru": "https://www.bookingmole.com",
    "pt-BR": "https://www.bookingmole.com",
    "fr": "https://www.bookingmole.com",
    "ja": "https://www.bookingmole.com",
    "zh": "https://www.bookingmole.com",
    "zh-TW": "https://www.bookingmole.com",
    "ar": "https://www.bookingmole.com",
    "de": "https://www.bookingmole.com",
    "id": "https://www.bookingmole.com",
    "ko": "https://www.bookingmole.com",
    "it": "https://www.bookingmole.com",
    "vi": "https://www.bookingmole.com",
    "x-default": "https://www.bookingmole.com",
  },
},
`"

---

## Task 3 — robots.ts audit

See App-specific section for exact disallow rules.

---

## App-specific: hotel-booking

### WebSite schema for Task 1

```ts
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BookingMole",
  "url": "https://www.bookingmole.com",
  "description": "Compare and book hotels worldwide. Find the best deals with no hidden fees.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.bookingmole.com/search?destination={destination}&checkin={checkin}&checkout={checkout}"
    },
    "query-input": [
      "required name=destination",
      "required name=checkin",
      "required name=checkout"
    ]
  }
};
```

### LodgingBusiness on destination pages

In `src/app/hotels/[destination]/page.tsx`, add a JSON-LD block inside the page JSX:

```ts
const destinationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": `Hotels in ${city}`,
  "description": `Compare the best hotels in ${city}. Find deals with free cancellation.`,
  "url": `https://www.bookingmole.com/hotels/${slug}`
};
```

Add as `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />`
inside the page return, before or after the main content.

### robots.ts

Disallow: `["/api/", "/_next/", "/search"]`
The `/hotels/` destination pages remain ALLOWED.

---

## Commit and push

```bash
git add -A
git commit -m "seo: JSON-LD structured data, hreflang, robots.txt"
git push origin master
vercel deploy --prod --yes --scope burrowsoft
```