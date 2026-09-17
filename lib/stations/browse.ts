import { countryName } from "@/lib/stations/display";

/** Validate and normalize a country route segment. Returns null when unknown. */
export function parseCountrySegment(segment: string): { code: string; name: string } | null {
  if (!/^[a-z]{2}$/i.test(segment)) return null;
  const code = segment.toUpperCase();
  const name = countryName(code);
  return name ? { code, name } : null;
}

/** Validate a language or tag route segment. Returns the normalized value or null. */
export function parseTermSegment(segment: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    return null;
  }
  const value = decoded.trim().toLowerCase().replace(/\s+/g, " ");
  if (!value || value.length > 50) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{M}\p{N} &'+./-]*$/u.test(value)) return null;
  return value;
}

export function titleCase(value: string): string {
  return value.replace(
    /(^|[\s-])(\p{L})/gu,
    (_, sep: string, ch: string) => sep + ch.toUpperCase(),
  );
}
