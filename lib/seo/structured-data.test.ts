import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  stationJsonLd,
  stationListJsonLd,
  websiteJsonLd,
} from "@/lib/seo/structured-data";
import { makeStation } from "@/test/fixtures";

const isAbsolute = (value: unknown) => typeof value === "string" && /^https?:\/\//.test(value);

describe("structured data", () => {
  it("describes the site with a search action", () => {
    const data = websiteJsonLd();
    expect(data["@type"]).toBe("WebSite");
    expect(isAbsolute(data.url)).toBe(true);
    const action = data.potentialAction as Record<string, Record<string, string>>;
    expect(action.target.urlTemplate).toContain("{search_term_string}");
    expect(data["query-input"]).toBeUndefined();
  });

  it("describes a station", () => {
    const station = makeStation("042d3140-227c-4fac-9387-4903b692d5f2", {
      name: "Tokyo Jazz",
      countryCode: "JP",
      country: "Japan",
      languages: ["japanese"],
      tags: ["jazz", "lounge"],
      homepageUrl: "https://example.com/",
      faviconUrl: "https://example.com/i.png",
    });
    const data = stationJsonLd(station);
    expect(data["@type"]).toBe("RadioBroadcastService");
    expect(data.name).toBe("Tokyo Jazz");
    expect(isAbsolute(data.url)).toBe(true);
    expect(data.inLanguage).toEqual(["japanese"]);
    expect(data.areaServed).toEqual({ "@type": "Country", name: "Japan" });
    expect(data.sameAs).toEqual(["https://example.com/"]);
  });

  it("omits unknown station fields instead of emitting empty values", () => {
    const data = stationJsonLd(makeStation("x"));
    expect(data).not.toHaveProperty("sameAs");
    expect(data).not.toHaveProperty("image");
    expect(data).not.toHaveProperty("areaServed");
    expect(data).not.toHaveProperty("inLanguage");
  });

  it("lists stations in order and caps the list", () => {
    const stations = Array.from({ length: 40 }, (_, i) => makeStation(`s${i}`));
    const data = stationListJsonLd("Jazz in Japan", "/jazz-radio-in-japan", stations);
    const list = data.mainEntity as {
      numberOfItems: number;
      itemListElement: { position: number }[];
    };
    expect(list.numberOfItems).toBe(40);
    expect(list.itemListElement).toHaveLength(25);
    expect(list.itemListElement[0].position).toBe(1);
  });

  it("builds breadcrumbs with absolute items", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Japan", path: "/country/jp" },
    ]);
    const items = data.itemListElement as { position: number; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items.every((i) => isAbsolute(i.item))).toBe(true);
  });

  it("serializes without breaking out of a script tag", () => {
    const data = stationJsonLd(makeStation("x", { name: "</script><script>alert(1)</script>" }));
    expect(JSON.stringify(data)).toContain("</script>");
    expect(JSON.stringify(data).replace(/</g, "\\u003c")).not.toContain("</script>");
  });
});

describe("entity data", () => {
  const url = "https://openradio.space/";

  it("says who publishes the site", () => {
    const data = organizationJsonLd();
    expect(data["@type"]).toBe("Organization");
    expect(data["@id"]).toBe(`${url}#organization`);
    expect(data.sameAs).toContain("https://github.com/raj-khan/openradio");
    expect(isAbsolute((data.logo as Record<string, unknown>).url)).toBe(true);
  });

  it("describes the product as free software", () => {
    const data = softwareApplicationJsonLd();
    expect(data["@type"]).toEqual(["SoftwareApplication", "WebApplication"]);
    expect(data.license).toBe("https://opensource.org/licenses/MIT");
    expect(data.offers).toMatchObject({ price: "0" });
    expect(data.isAccessibleForFree).toBe(true);
    expect((data.featureList as string[]).length).toBeGreaterThan(3);
  });

  it("links the nodes by @id rather than repeating them", () => {
    // A graph the crawler can join up, not three unrelated blobs.
    expect(softwareApplicationJsonLd().publisher).toEqual({ "@id": `${url}#organization` });
    expect(softwareApplicationJsonLd().isPartOf).toEqual({ "@id": `${url}#website` });
    expect(websiteJsonLd().publisher).toEqual({ "@id": `${url}#organization` });
    expect(stationJsonLd(makeStation("a")).broadcastAffiliateOf).toEqual({
      "@id": `${url}#organization`,
    });
  });

  it("gives every node a distinct @id", () => {
    const ids = [organizationJsonLd(), websiteJsonLd(), softwareApplicationJsonLd()].map(
      (node) => node["@id"],
    );
    expect(new Set(ids).size).toBe(3);
  });
});
