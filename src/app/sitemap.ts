import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/rankings`, lastModified: new Date(), priority: 0.9 },
    ...categories.map((category) => ({
      url: `${siteUrl}/rankings/${category.id}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ];
}
