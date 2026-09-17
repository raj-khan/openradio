/** Emoji flag for an ISO 3166-1 alpha-2 country code. */
export function countryFlag(code?: string): string {
  if (!code || !/^[A-Z]{2}$/i.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

/** Up to two initials for a station placeholder. */
export function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const letters = words.slice(0, 2).map((w) => [...w][0]);
  return (letters.join("") || "?").toUpperCase();
}

/** Deterministic hue (0-359) derived from a string, used for placeholders and themes. */
export function hueFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash % 360;
}

/** Short "Country · CODEC 128 kbps" style line. */
export function stationSubtitle(station: {
  country?: string;
  codec?: string;
  bitrate?: number;
}): string {
  const quality = [station.codec, station.bitrate ? `${station.bitrate} kbps` : undefined]
    .filter(Boolean)
    .join(" ");
  return [station.country, quality].filter(Boolean).join(" · ");
}
