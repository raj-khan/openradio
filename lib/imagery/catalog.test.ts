import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MOODS,
  PLACES,
  allImages,
  moodBySlug,
  moodForTag,
  placeForCountry,
} from "@/lib/imagery/catalog";

describe("imagery catalog", () => {
  it("has a local, small file and a full credit for every image", () => {
    for (const image of allImages()) {
      const file = join(process.cwd(), "public", image.src);
      expect(existsSync(file), image.src).toBe(true);
      expect(statSync(file).size, image.src).toBeLessThan(200_000);
      expect(image.credit.photographer).not.toBe("");
      expect(image.credit.photoUrl).toMatch(/^https:\/\/unsplash\.com\/photos\//);
      expect(image.credit.profileUrl).toMatch(/^https:\/\/unsplash\.com\/@/);
    }
  });

  it("uses unique slugs and valid country codes", () => {
    expect(new Set(PLACES.map((p) => p.slug)).size).toBe(PLACES.length);
    expect(new Set(MOODS.map((m) => m.slug)).size).toBe(MOODS.length);
    for (const place of PLACES) expect(place.countryCode).toMatch(/^[A-Z]{2}$/);
  });

  it("looks up places and moods", () => {
    expect(placeForCountry("jp")?.city).toBe("Tokyo");
    expect(placeForCountry("ZZ")).toBeUndefined();
    expect(moodForTag("Smooth Jazz")?.slug).toBe("jazz");
    expect(moodBySlug("faith")?.primaryTag).toBe("religious");
  });

  it("keeps mood tags lowercase and includes the primary tag", () => {
    for (const mood of MOODS) {
      expect(mood.tags).toContain(mood.primaryTag);
      for (const tag of mood.tags) expect(tag).toBe(tag.toLowerCase());
    }
  });
});
