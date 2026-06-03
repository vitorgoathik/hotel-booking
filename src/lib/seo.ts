import type { Metadata } from "next";
import { POPULAR_DESTINATIONS } from "./data";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bookingmole.com";
export const SITE_NAME = "BookingMole";
export const SITE_DESCRIPTION =
  "Compare and book hotels worldwide. Find the best deals on hotels, resorts, and vacation rentals. No hidden fees.";

export function buildDestinationMetadata(city: string, country: string, minPrice?: number): Metadata {
  const title = `Hotels in ${city}${minPrice ? ` from $${minPrice}/night` : ""} | ${SITE_NAME}`;
  const description = `Find and book the best hotels in ${city}, ${country}. Compare prices across hundreds of hotels${minPrice ? ` starting at $${minPrice}/night` : ""}. Free cancellation available. Book now and save!`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `${SITE_URL}/hotels/${city.toLowerCase().replace(/\s+/g, "-")}`,
    },
  };
}

export function buildSearchMetadata(destination: string, checkin: string, checkout: string): Metadata {
  const title = `Hotels in ${destination} — ${checkin} to ${checkout} | ${SITE_NAME}`;
  const description = `Find available hotels in ${destination} from ${checkin} to ${checkout}. Compare prices and book instantly.`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?destination={destination}&checkin={checkin}&checkout={checkout}`,
      },
      "query-input": [
        "required name=destination",
        "required name=checkin",
        "required name=checkout",
      ],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function hotelDestinationJsonLd(city: string, country: string, minPrice: number) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Hotels in ${city}`,
    description: `Best hotels in ${city}, ${country}`,
    url: `${SITE_URL}/hotels/${city.toLowerCase().replace(/\s+/g, "-")}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Offer",
          name: `Hotel in ${city}`,
          description: `Book hotels in ${city}, ${country}`,
          price: minPrice,
          priceCurrency: "USD",
          url: `${SITE_URL}/hotels/${city.toLowerCase().replace(/\s+/g, "-")}`,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: SITE_NAME },
        },
      },
    ],
  };
}

export function getAllDestinationSlugs(): string[] {
  return POPULAR_DESTINATIONS.map((d) => d.slug);
}
