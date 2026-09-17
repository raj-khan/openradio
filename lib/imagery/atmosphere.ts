import { HERO_IMAGE, moodForTag, placeForCountry, type CatalogImage } from "@/lib/imagery/catalog";

/** Best matching atmosphere photo for a station: its mood, then its country, then the hero. */
export function atmosphereFor(station: { tags: string[]; countryCode?: string }): CatalogImage {
  for (const tag of station.tags) {
    const mood = moodForTag(tag);
    if (mood) return mood.image;
  }
  return placeForCountry(station.countryCode)?.image ?? HERO_IMAGE;
}
