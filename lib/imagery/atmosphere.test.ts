import { describe, expect, it } from "vitest";
import { atmosphereFor } from "@/lib/imagery/atmosphere";
import { HERO_IMAGE } from "@/lib/imagery/catalog";

describe("atmosphereFor", () => {
  it("prefers a mood matching the station tags", () => {
    expect(atmosphereFor({ tags: ["talk", "jazz"], countryCode: "JP" }).src).toContain("news-talk");
  });

  it("falls back to the country photo", () => {
    expect(atmosphereFor({ tags: ["unknown"], countryCode: "JP" }).src).toContain("japan");
  });

  it("falls back to the hero photo", () => {
    expect(atmosphereFor({ tags: [] })).toBe(HERO_IMAGE);
  });
});
