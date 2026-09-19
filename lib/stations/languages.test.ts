import { describe, expect, it } from "vitest";
import { dominantLanguage } from "@/lib/stations/languages";
import { makeStation } from "@/test/fixtures";

const inLanguage = (id: string, ...languages: string[]) => makeStation(id, { languages });

describe("dominantLanguage", () => {
  it("names the language most of a country's stations broadcast in", () => {
    const syria = [
      ...Array.from({ length: 20 }, (_, i) => inLanguage(`a${i}`, "arabic")),
      ...Array.from({ length: 8 }, (_, i) => inLanguage(`k${i}`, "kurdish")),
    ];
    expect(dominantLanguage(syria)).toBe("arabic");
  });

  it("refuses when one stray relay is the only thing declaring a language", () => {
    // Tiny territories carry a relayed Quran channel, so reading the most
    // common language naively makes Arabic speak for Tuvalu, Nauru and a dozen
    // others. Offering Arabic talk radio to someone who asked for Tuvalu is
    // worse than telling them there is none.
    const tuvalu = [inLanguage("one", "arabic"), inLanguage("two"), inLanguage("three")];
    expect(dominantLanguage(tuvalu)).toBeUndefined();
  });

  it("refuses when the leader carries too small a share", () => {
    const spread = [
      inLanguage("a", "english"),
      inLanguage("b", "english"),
      inLanguage("c", "english"),
      ...Array.from({ length: 20 }, (_, i) => inLanguage(`x${i}`)),
    ];
    expect(dominantLanguage(spread)).toBeUndefined();
  });

  it("counts a station that declares several languages under each", () => {
    const bilingual = Array.from({ length: 4 }, (_, i) => inLanguage(`b${i}`, "welsh", "english"));
    expect(dominantLanguage(bilingual)).toBe("english");
  });

  it("handles an empty list and stations with no language at all", () => {
    expect(dominantLanguage([])).toBeUndefined();
    expect(dominantLanguage([inLanguage("a"), inLanguage("b")])).toBeUndefined();
  });
});
