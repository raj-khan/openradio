export const SITE_NAME = "OpenRadio";
export const SITE_TAGLINE = "Explore the world through radio.";
export const SITE_TITLE = `${SITE_NAME}: world radio, open source`;
export const SITE_DESCRIPTION =
  "OpenRadio is a free, open-source world radio player. Discover and listen to live stations from every country, language and genre, with an interface that changes with the music.";
export const SITE_DOMAIN = "openradio.space";
export const REPO_URL = "https://github.com/raj-khan/openradio";

/** Absolute site origin for metadata, sitemap and robots. */
export function siteUrl(): URL {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    `https://${SITE_DOMAIN}`;
  return new URL(raw.startsWith("http") ? raw : `https://${raw}`);
}
