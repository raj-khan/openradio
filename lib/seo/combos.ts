import { MOODS, PLACES } from "@/lib/imagery/catalog";
import { countryName } from "@/lib/stations/display";
import { regionAliases, regionIndex, type Region } from "@/lib/stations/regions";

/** Genres that make sense as landing pages, with the Radio Browser tag behind each. */
export const PSEO_GENRES: { slug: string; label: string; tag: string }[] = [
  { slug: "jazz", label: "Jazz", tag: "jazz" },
  { slug: "pop", label: "Pop", tag: "pop" },
  { slug: "rock", label: "Rock", tag: "rock" },
  { slug: "classical", label: "Classical", tag: "classical" },
  { slug: "news", label: "News", tag: "news" },
  { slug: "talk", label: "Talk", tag: "talk" },
  { slug: "dance", label: "Dance", tag: "dance" },
  { slug: "electronic", label: "Electronic", tag: "electronic" },
  { slug: "oldies", label: "Oldies", tag: "oldies" },
  { slug: "folk", label: "Folk", tag: "folk" },
  { slug: "hiphop", label: "Hip hop", tag: "hiphop" },
  { slug: "lounge", label: "Chill", tag: "lounge" },
];

/** Pages with fewer stations than this are not indexed. */
export const MIN_COMBO_STATIONS = 5;

export interface Combo {
  genre: (typeof PSEO_GENRES)[number];
  countryCode: string;
  countryName: string;
  slug: string;
}

export function countrySlug(name: string): string {
  return (regionAliases(name)[1] ?? name)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function comboSlug(genreSlug: string, country: string): string {
  return `${genreSlug}-radio-in-${countrySlug(country)}`;
}

let countryIndex: Map<string, Region> | null = null;

/** Parse a slug such as "jazz-radio-in-japan". Returns null when it is not a combo. */
export function parseComboSlug(slug: string): Combo | null {
  const match = /^([a-z0-9]+)-radio-in-([a-z0-9-]+)$/.exec(slug);
  if (!match) return null;
  const genre = PSEO_GENRES.find((g) => g.slug === match[1]);
  if (!genre) return null;
  countryIndex ??= regionIndex(countrySlug);
  const country = countryIndex.get(match[2]);
  if (!country) return null;
  return { genre, countryCode: country.code, countryName: country.name, slug };
}

/** Combos linked from the site and listed in the sitemap: featured places by genre. */
export function featuredCombos(): Combo[] {
  return PLACES.flatMap((place) => {
    const name = countryName(place.countryCode) ?? place.city;
    return PSEO_GENRES.map((genre) => ({
      genre,
      countryCode: place.countryCode,
      countryName: name,
      slug: comboSlug(genre.slug, name),
    }));
  });
}

/** Genres to suggest alongside a combo, excluding the current one. */
export function relatedGenres(current: string) {
  return PSEO_GENRES.filter((genre) => genre.slug !== current);
}

/** Moods share tags with genres; used to pick a photo for the page. */
export function moodSlugForGenre(tag: string) {
  return MOODS.find((mood) => mood.tags.includes(tag))?.slug;
}
