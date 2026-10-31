import type { MetadataRoute } from "next";
import { STATES } from "@/data/states";
import { SITE } from "@/data/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/states`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...STATES.map((s) => ({ url: `${SITE.url}/states/${s.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
