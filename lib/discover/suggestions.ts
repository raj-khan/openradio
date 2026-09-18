/*
 * The examples under the discover box, fitted to whoever is reading them.
 *
 * They used to be four fixed strings, so someone in Dhaka at two in the morning
 * was shown "Calm jazz from Japan" and "UK news" like everybody else.
 *
 * Two signals, both already in the browser and neither costing a permission
 * prompt, an IP lookup or a third-party request: the timezone gives the local
 * hour and a fair guess at the country, and the browser's language setting says
 * what the listener reads in. Nothing leaves the device, which matters on a site
 * that promises no tracking.
 *
 * Every phrase here is built from vocabulary lib/discover/intent.ts already
 * parses. A suggestion that returned nothing would be worse than a fixed one.
 */

/** Zones to countries, for the places people actually listen from. */
const ZONE_COUNTRY: Record<string, string> = {
  "Africa/Cairo": "EG",
  "Africa/Casablanca": "MA",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "Africa/Johannesburg": "ZA",
  "Africa/Algiers": "DZ",
  "Africa/Tunis": "TN",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Havana": "CU",
  "America/Lima": "PE",
  "America/Los_Angeles": "US",
  "America/Mexico_City": "MX",
  "America/New_York": "US",
  "America/Santiago": "CL",
  "America/Sao_Paulo": "BR",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Asia/Baghdad": "IQ",
  "Asia/Bangkok": "TH",
  "Asia/Dhaka": "BD",
  "Asia/Dubai": "AE",
  "Asia/Hong_Kong": "HK",
  "Asia/Istanbul": "TR",
  "Asia/Jakarta": "ID",
  "Asia/Jerusalem": "IL",
  "Asia/Karachi": "PK",
  "Asia/Kolkata": "IN",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Manila": "PH",
  "Asia/Riyadh": "SA",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Singapore": "SG",
  "Asia/Taipei": "TW",
  "Asia/Tehran": "IR",
  "Asia/Tokyo": "JP",
  "Australia/Melbourne": "AU",
  "Australia/Sydney": "AU",
  "Europe/Amsterdam": "NL",
  "Europe/Athens": "GR",
  "Europe/Berlin": "DE",
  "Europe/Brussels": "BE",
  "Europe/Bucharest": "RO",
  "Europe/Budapest": "HU",
  "Europe/Dublin": "IE",
  "Europe/Istanbul": "TR",
  "Europe/Kyiv": "UA",
  "Europe/Lisbon": "PT",
  "Europe/London": "GB",
  "Europe/Madrid": "ES",
  "Europe/Moscow": "RU",
  "Europe/Oslo": "NO",
  "Europe/Paris": "FR",
  "Europe/Prague": "CZ",
  "Europe/Rome": "IT",
  "Europe/Stockholm": "SE",
  "Europe/Vienna": "AT",
  "Europe/Warsaw": "PL",
  "Europe/Zurich": "CH",
  "Pacific/Auckland": "NZ",
};

/** Country names exactly as lib/discover/intent.ts knows them. */
const COUNTRY_PHRASE: Record<string, string> = {
  AE: "UAE",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  BD: "Bangladesh",
  BE: "Belgium",
  BR: "Brazil",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CU: "Cuba",
  CZ: "Czechia",
  DE: "Germany",
  DZ: "Algeria",
  EG: "Egypt",
  ES: "Spain",
  FR: "France",
  GB: "the UK",
  GR: "Greece",
  HK: "Hong Kong",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IQ: "Iraq",
  IR: "Iran",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  KR: "South Korea",
  MA: "Morocco",
  MX: "Mexico",
  MY: "Malaysia",
  NG: "Nigeria",
  NL: "the Netherlands",
  NO: "Norway",
  NZ: "New Zealand",
  PE: "Peru",
  PH: "Philippines",
  PK: "Pakistan",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  RU: "Russia",
  SA: "Saudi Arabia",
  SE: "Sweden",
  SG: "Singapore",
  TH: "Thailand",
  TN: "Tunisia",
  // The parser knows it by its own name, not the English one.
  TR: "Turkiye",
  TW: "Taiwan",
  UA: "Ukraine",
  US: "the US",
  ZA: "South Africa",
};

/** Language subtags to the names the parser knows. */
const LANGUAGE_PHRASE: Record<string, string> = {
  ar: "Arabic",
  bn: "Bengali",
  de: "German",
  el: "Greek",
  es: "Spanish",
  fa: "Persian",
  fr: "French",
  he: "Hebrew",
  hi: "Hindi",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  ms: "Malay",
  nl: "Dutch",
  pa: "Punjabi",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  sw: "Swahili",
  ta: "Tamil",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  vi: "Vietnamese",
  yo: "Yoruba",
  zh: "Chinese",
};

export type TimeOfDay = "night" | "morning" | "afternoon" | "evening";

export interface Listener {
  hour: number;
  countryCode?: string;
  /** Language subtag, e.g. "bn". English is left out: it is the site default. */
  language?: string;
}

export function timeOfDay(hour: number): TimeOfDay {
  if (hour < 5 || hour >= 23) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/** What the time of day suggests, in words the intent parser understands. */
const BY_TIME: Record<TimeOfDay, string[]> = {
  night: ["Late night lofi", "Calm ambient for the small hours", "Quiet jazz"],
  morning: ["Morning news", "Upbeat pop to wake up", "Classical for a slow start"],
  afternoon: ["Focused lofi for work", "Afternoon jazz", "Energetic dance"],
  evening: ["Relaxing jazz", "Evening news", "Nostalgic oldies"],
};

export const FALLBACK_SUGGESTIONS = [
  "Calm jazz from Japan",
  "Bengali music from Bangladesh",
  "UK news",
  "Late night lofi",
];

/**
 * Four prompts for this listener. At least one names their own country or
 * language when we can tell, and the rest follow the clock.
 */
export function suggestionsFor(listener: Listener): string[] {
  const when = timeOfDay(listener.hour);
  const country = listener.countryCode ? COUNTRY_PHRASE[listener.countryCode] : undefined;
  const language = listener.language ? LANGUAGE_PHRASE[listener.language] : undefined;

  const local: string[] = [];
  if (country) {
    local.push(
      when === "morning" || when === "evening" ? `News from ${country}` : `Radio from ${country}`,
    );
  }
  if (language) local.push(`${language} music`);
  if (country && local.length < 2) local.push(`Talk radio from ${country}`);

  const suggestions = [...local, ...BY_TIME[when]];
  const seen = new Set<string>();
  const unique = suggestions.filter((s) => !seen.has(s) && seen.add(s));
  return unique.slice(0, 4);
}

/** Read the listener from the browser. Returns null where we cannot tell. */
export function readListener(now = new Date()): Listener | null {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    const hour = Number(
      new Intl.DateTimeFormat("en", {
        timeZone: resolved.timeZone,
        hour: "numeric",
        hour12: false,
      }).format(now),
    );
    if (!Number.isFinite(hour)) return null;

    const tag = typeof navigator === "undefined" ? "" : navigator.language;
    const subtag = tag.split("-")[0]?.toLowerCase();
    return {
      hour: hour % 24,
      countryCode: ZONE_COUNTRY[resolved.timeZone],
      // English is the site's own language, so naming it says nothing useful.
      language: subtag && subtag !== "en" ? subtag : undefined,
    };
  } catch {
    return null;
  }
}
