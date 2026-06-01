import type { MetadataRoute } from "next";
import { SITE_URL, getAllDestinationSlugs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const destinations = getAllDestinationSlugs().map((slug) => ({
    url: `${SITE_URL}/hotels/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, changeFrequency: "daily" as const, priority: 1 },
    ...destinations,
  ];
}
