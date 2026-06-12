import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/rankings`, lastModified: new Date(), priority: 0.9 },
    ...categories.map((category) => ({
      url: `${baseUrl}/rankings/${category.id}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ];
}
