import { describe, expect, it } from "vitest";
import { navigablePaths } from "@/lib/navigation";
import { MIN_STATIONS, sitemapPaths } from "@/lib/seo/sitemap-entries";

describe("sitemapPaths", () => {
  it("includes core pages, featured places and moods even when the directory is down", () => {
    const paths = sitemapPaths({ countries: [], languages: [], tags: [] });
    expect(paths).toEqual(
      expect.arrayContaining(["/", "/search", "/about", "/country/jp", "/tag/jazz"]),
    );
  });

  it("adds only well stocked facets and skips junk names", () => {
    const paths = sitemapPaths({
      countries: [
        { name: "Chile", code: "CL", stationCount: MIN_STATIONS },
        { name: "Tiny", code: "TV", stationCount: 2 },
      ],
      languages: [
        { name: "bengali", stationCount: 50 },
        { name: "x<y", stationCount: 99 },
      ],
      tags: [
        { name: "smooth jazz", stationCount: 80 },
        { name: "rare", stationCount: 1 },
      ],
    });
    expect(paths).toContain("/country/cl");
    expect(paths).not.toContain("/country/tv");
    expect(paths).toContain("/language/bengali");
    expect(paths.some((p) => p.includes("x%3Cy"))).toBe(false);
    expect(paths).toContain("/tag/smooth%20jazz");
    expect(paths).not.toContain("/tag/rare");
  });

  it("has no duplicates", () => {
    const paths = sitemapPaths({
      countries: [{ name: "Japan", code: "JP", stationCount: 99 }],
      languages: [],
      tags: [],
    });
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("no orphaned routes", () => {
  const facets = { countries: [], languages: [], tags: [] };
  /** Paths reached from a station page's own links rather than site chrome. */
  const REACHED_FROM_CONTENT = /^\/(country|tag|language)\//;

  it("links every fixed route it asks search engines to index", () => {
    // /discover sat in the sitemap with no link to it anywhere: crawlable but
    // undiscoverable. Anything added to the sitemap needs a way in.
    const linked = new Set(navigablePaths());
    const unlinked = sitemapPaths(facets)
      .filter((path) => !REACHED_FROM_CONTENT.test(path))
      .filter((path) => !linked.has(path));
    expect(unlinked).toEqual([]);
  });

  it("does not offer routes we mark noindex", () => {
    const paths = sitemapPaths(facets);
    expect(paths).not.toContain("/favorites");
    expect(paths).not.toContain("/history");
    expect(paths).not.toContain("/offline");
  });
});
