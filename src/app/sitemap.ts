import type { MetadataRoute } from "next";
import { getAllDestinationSlugs } from "@/lib/seo";
import { routing } from "@/i18n/routing";

const BASE = "https://www.bookingmole.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static routes per locale
  for (const locale of routing.locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    entries.push(
      { url: `${BASE}${prefix}/`,       changeFrequency: "daily",  priority: 1.0,  lastModified: new Date() },
      { url: `${BASE}${prefix}/search`, changeFrequency: "weekly", priority: 0.5,  lastModified: new Date() },
    );
  }

  // Destination pages per locale
  for (const slug of getAllDestinationSlugs()) {
    for (const locale of routing.locales) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      entries.push({
        url: `${BASE}${prefix}/hotels/${slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
