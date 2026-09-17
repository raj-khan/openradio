import type { MetadataRoute } from "next";
import { sitemapPaths } from "@/lib/seo/sitemap-entries";
import { siteUrl } from "@/lib/site";
import { loadFacets } from "@/lib/stations/server-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [countries, languages, tags] = await Promise.all([
    loadFacets("countries"),
    loadFacets("languages"),
    loadFacets("tags"),
  ]);
  const base = siteUrl();
  return sitemapPaths({ countries, languages, tags }).map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
