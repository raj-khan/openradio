import { describe, expect, it } from "vitest";
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
