import { describe, expect, it } from "vitest";
import {
  comboSlug,
  countrySlug,
  featuredCombos,
  parseComboSlug,
  PSEO_GENRES,
} from "@/lib/seo/combos";

describe("combo slugs", () => {
  it("builds readable slugs", () => {
    expect(comboSlug("jazz", "Japan")).toBe("jazz-radio-in-japan");
    expect(comboSlug("news", "United Kingdom")).toBe("news-radio-in-united-kingdom");
    expect(countrySlug("Côte d’Ivoire")).toBe("cote-d-ivoire");
  });

  it("parses valid combos", () => {
    expect(parseComboSlug("jazz-radio-in-japan")).toMatchObject({
      countryCode: "JP",
      countryName: "Japan",
      genre: { tag: "jazz" },
    });
    expect(parseComboSlug("news-radio-in-united-kingdom")?.countryCode).toBe("GB");
    expect(parseComboSlug("hiphop-radio-in-brazil")?.countryCode).toBe("BR");
  });

  it.each([
    "jazz-radio-in-atlantis",
    "polka-radio-in-japan",
    "jazz-radio-japan",
    "search",
    "jazz-radio-in-",
    "JAZZ-radio-in-japan",
    "../etc-radio-in-japan",
  ])("rejects %s", (slug) => {
    expect(parseComboSlug(slug)).toBeNull();
  });

  it("round trips every featured combo", () => {
    const combos = featuredCombos();
    expect(combos.length).toBe(16 * PSEO_GENRES.length);
    for (const combo of combos) {
      expect(parseComboSlug(combo.slug), combo.slug).toMatchObject({
        countryCode: combo.countryCode,
        genre: { slug: combo.genre.slug },
      });
    }
  });
});

describe("country names with alternates", () => {
  it("slugs and parses the plain name", () => {
    expect(comboSlug("jazz", "Myanmar (Burma)")).toBe("jazz-radio-in-myanmar");
    expect(parseComboSlug("jazz-radio-in-myanmar")?.countryCode).toBe("MM");
    expect(parseComboSlug("jazz-radio-in-germany")?.countryCode).toBe("DE");
    expect(parseComboSlug("jazz-radio-in-france")?.countryCode).toBe("FR");
  });
});
