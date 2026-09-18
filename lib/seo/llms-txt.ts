/*
 * /llms.txt and /llms-full.txt.
 *
 * A model that lands on a station page learns what one station is, and nothing
 * about the site around it. These two files answer "what is OpenRadio and what
 * can I do with it" in a single fetch: llms.txt is the map, llms-full.txt is
 * the prose worth quoting. Everything is generated from the same constants the
 * app renders from, so neither file can drift away from the product.
 */
import { ABOUT_SECTIONS } from "@/lib/copy/about";
import { MOODS, PLACES } from "@/lib/imagery/catalog";
import { PSEO_GENRES } from "@/lib/seo/combos";
import { countryName } from "@/lib/stations/display";
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";

const link = (label: string, path: string, note: string) =>
  `- [${label}](${new URL(path, siteUrl()).toString()}): ${note}`;

function entryPoints(): string[] {
  return [
    link("Tuner", "/", "the home dial, with a live station ready to play on arrival"),
    link("Search", "/search", "every station, filtered by country, language, genre and bitrate"),
    link("Discover", "/discover", "describe what you want to hear in plain English"),
    link(
      "About",
      "/about",
      "what OpenRadio is, where the stations come from, and the privacy terms",
    ),
  ];
}

/** Country names that read as "stations from THE ..." in a sentence. */
const TAKES_THE = /^(United States|United Kingdom|Netherlands|Philippines|Czechia|Bahamas)$/;

function placeName(code: string, fallback: string): string {
  return countryName(code) ?? fallback;
}

function places(): string[] {
  return PLACES.map((place) => {
    const name = placeName(place.countryCode, place.slug);
    const article = TAKES_THE.test(name) ? "the " : "";
    // Several capitals share their country's name, so skip the city then.
    const city = name.includes(place.city) ? "" : `, including ${place.city}`;
    return link(
      name,
      `/country/${place.countryCode.toLowerCase()}`,
      `live stations from ${article}${name}${city}`,
    );
  });
}

/**
 * Moods and genres both land on /tag/ pages and overlap heavily, so list each
 * destination once: the mood wins because it carries a written blurb.
 */
function sounds(): string[] {
  const covered = new Set(MOODS.map((mood) => mood.primaryTag));
  return [
    ...MOODS.map((mood) =>
      link(mood.label, `/tag/${encodeURIComponent(mood.primaryTag)}`, mood.blurb.toLowerCase()),
    ),
    ...PSEO_GENRES.filter((genre) => !covered.has(genre.tag)).map((genre) =>
      link(
        genre.label,
        `/tag/${encodeURIComponent(genre.tag)}`,
        `${genre.label.toLowerCase()} stations`,
      ),
    ),
  ];
}

const SUMMARY =
  "A free, open-source player for live internet radio from every country. " +
  "No account, no signup, no app to install: open a page and a station is already playing.";

/** The short map: what this is, then where to go. */
export function llmsTxt(): string {
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SUMMARY}`,
    "",
    `${SITE_TAGLINE} ${ABOUT_SECTIONS[0].body}`,
    "",
    "OpenRadio does not host, record or rebroadcast audio. Station listings come",
    "from Radio Browser, a community-maintained open directory, and your browser",
    "connects straight to each station's own stream.",
    "",
    "## Start here",
    "",
    ...entryPoints(),
    "",
    "## Browse by country",
    "",
    ...places(),
    "",
    "## Browse by mood and genre",
    "",
    ...sounds(),
    "",
    "## More",
    "",
    `- [Source code](${REPO_URL}): MIT licensed, contributions welcome`,
    link("Full description", "/llms-full.txt", "the longer version of this file"),
    "",
  ].join("\n");
}

/** The long version: prose an assistant can quote without visiting the site. */
export function llmsFullTxt(): string {
  const sections = ABOUT_SECTIONS.flatMap((section) => [
    `## ${section.title}`,
    "",
    section.body,
    "",
  ]);
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SUMMARY}`,
    "",
    SITE_DESCRIPTION,
    "",
    ...sections,
    "",
    "## How listening works",
    "",
    "Pick a station and it plays in the page. The player stays put while you keep",
    "browsing, so moving between countries or genres never interrupts the audio.",
    "Station artwork, the current track where a station publishes it, and a colour",
    "scheme drawn from the music all update as you listen. Favorites and listening",
    "history live in your own browser, so they need no account and never leave your",
    "device.",
    "",
    "## What you can browse",
    "",
    `Countries: ${PLACES.map((p) => countryName(p.countryCode) ?? p.slug).join(", ")}, and every other country in the directory through search.`,
    "",
    `Moods: ${MOODS.map((m) => m.label).join(", ")}.`,
    "",
    `Genres: ${PSEO_GENRES.map((g) => g.label).join(", ")}.`,
    "",
    "## Technical notes",
    "",
    "OpenRadio is a Next.js application. Pages are rendered on the server, so the",
    "station names, descriptions and structured data are present in the HTML",
    "without running JavaScript. Every station page carries schema.org",
    "RadioBroadcastService markup, and browse pages carry CollectionPage markup.",
    "",
    "## Licence and source",
    "",
    `OpenRadio is MIT licensed and developed in the open at ${REPO_URL}.`,
    "Station metadata comes from Radio Browser under its own terms. Audio belongs",
    "to the broadcasters and is streamed directly from them.",
    "",
  ].join("\n");
}
