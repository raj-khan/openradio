import { describe, expect, it } from "vitest";
import { comboSitemapPaths, type CountrySample } from "@/lib/seo/combo-sitemap";
import { MIN_COMBO_STATIONS } from "@/lib/seo/combos";
import { makeStation } from "@/test/fixtures";

const sample = (countryName: string, tag: string, count: number): CountrySample => ({
  countryCode: "JP",
  countryName,
  stations: Array.from({ length: count }, (_, i) =>
    makeStation(`${tag}${i}`, { countryCode: "JP", tags: [tag] }),
  ),
});

describe("comboSitemapPaths", () => {
  it("lists a combo once the genre clears the threshold", () => {
    expect(comboSitemapPaths([sample("Japan", "jazz", MIN_COMBO_STATIONS)])).toEqual([
      "/jazz-radio-in-japan",
    ]);
  });

  it("leaves out a combo whose page would set noindex", () => {
    // Submitting a URL we also tell Google to ignore is a Search Console error.
    expect(comboSitemapPaths([sample("Japan", "jazz", MIN_COMBO_STATIONS - 1)])).toEqual([]);
  });

  it("ignores stations the directory knows are off the air", () => {
    const dead: CountrySample = {
      countryCode: "JP",
      countryName: "Japan",
      stations: Array.from({ length: 20 }, (_, i) =>
        makeStation(`d${i}`, { countryCode: "JP", tags: ["jazz"], lastCheckOk: false }),
      ),
    };
    expect(comboSitemapPaths([dead])).toEqual([]);
  });

  it("counts a station once even if it repeats a tag", () => {
    const repeated: CountrySample = {
      countryCode: "JP",
      countryName: "Japan",
      stations: [makeStation("a", { countryCode: "JP", tags: ["jazz", "Jazz", "JAZZ"] })],
    };
    expect(comboSitemapPaths([repeated])).toEqual([]);
  });

  it("matches tags regardless of case", () => {
    const upper: CountrySample = {
      countryCode: "JP",
      countryName: "Japan",
      stations: Array.from({ length: MIN_COMBO_STATIONS }, (_, i) =>
        makeStation(`u${i}`, { countryCode: "JP", tags: ["JAZZ"] }),
      ),
    };
    expect(comboSitemapPaths([upper])).toEqual(["/jazz-radio-in-japan"]);
  });

  it("handles several countries and genres without duplicating", () => {
    const paths = comboSitemapPaths([
      sample("Japan", "jazz", 10),
      sample("Japan", "jazz", 10),
      sample("France", "pop", 10),
    ]);
    expect(paths.sort()).toEqual(["/jazz-radio-in-japan", "/pop-radio-in-france"]);
  });

  it("returns nothing for an empty sample rather than guessing", () => {
    expect(comboSitemapPaths([])).toEqual([]);
    expect(comboSitemapPaths([{ countryCode: "JP", countryName: "Japan", stations: [] }])).toEqual(
      [],
    );
  });
});
