import type { MetadataRoute } from "next";
import { AI_CRAWLERS, CRAWLER_DISALLOW } from "@/lib/seo/crawlers";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: CRAWLER_DISALLOW },
      // Named so the AI crawlers that only read the site when asked are asked.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: CRAWLER_DISALLOW,
      })),
    ],
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
