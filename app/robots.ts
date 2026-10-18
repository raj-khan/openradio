import type { MetadataRoute } from "next";
import { ANSWER_CRAWLERS, BLOCKED_CRAWLERS, CRAWLER_DISALLOW } from "@/lib/seo/crawlers";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines are not named: the wildcard already welcomes them.
      { userAgent: "*", allow: "/", disallow: CRAWLER_DISALLOW },
      // Named so the crawlers that only read the site when asked are asked.
      ...ANSWER_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: CRAWLER_DISALLOW,
      })),
      // Named because the wildcard above would otherwise let them in.
      ...BLOCKED_CRAWLERS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
