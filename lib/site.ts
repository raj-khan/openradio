export const SITE_NAME = "Radio Atlas";
export const SITE_TAGLINE = "Explore the world through radio.";
export const SITE_DESCRIPTION =
  "Open-source world radio: discover and listen to live stations from every country, language and genre, with an interface that changes with the music.";
export const REPO_URL = "https://github.com/raj-khan/radio-atlas";

/** Absolute site origin for metadata, sitemap and robots. */
export function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!raw) return new URL("http://localhost:3000");
  return new URL(raw.startsWith("http") ? raw : `https://${raw}`);
}
