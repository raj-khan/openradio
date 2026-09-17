import { z } from "zod";
import { MOODS } from "@/lib/imagery/catalog";

export const MOOD_NAMES = [
  "calm",
  "energetic",
  "nostalgic",
  "romantic",
  "focused",
  "melancholic",
  "joyful",
  "mysterious",
] as const;

export const intentSchema = z.object({
  country: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional(),
  language: z.string().min(2).max(40).optional(),
  tag: z.string().min(2).max(40).optional(),
  mood: z.enum(MOOD_NAMES).optional(),
  text: z.string().min(1).max(100).optional(),
});

export type Intent = z.infer<typeof intentSchema>;

/** Strip diacritics and punctuation, collapse spaces, lowercase. */
export function normalizeQuery(input: string): string {
  return ` ${input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}&]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

// Languages people ask for, keyed by Radio Browser language name.
const LANGUAGES: Record<string, string[]> = {
  arabic: ["arabic"],
  bengali: ["bengali", "bangla"],
  chinese: ["chinese", "mandarin", "cantonese"],
  dutch: ["dutch"],
  english: ["english"],
  french: ["french"],
  german: ["german"],
  greek: ["greek"],
  hebrew: ["hebrew"],
  hindi: ["hindi"],
  indonesian: ["indonesian", "bahasa indonesia"],
  italian: ["italian"],
  japanese: ["japanese"],
  korean: ["korean"],
  malay: ["malay", "bahasa melayu"],
  persian: ["persian", "farsi"],
  polish: ["polish"],
  portuguese: ["portuguese"],
  punjabi: ["punjabi"],
  russian: ["russian"],
  spanish: ["spanish", "espanol"],
  swahili: ["swahili"],
  tamil: ["tamil"],
  thai: ["thai"],
  turkish: ["turkish"],
  ukrainian: ["ukrainian"],
  urdu: ["urdu"],
  vietnamese: ["vietnamese"],
  yoruba: ["yoruba"],
};

// Country adjectives that are not also language names.
const DEMONYMS: Record<string, string> = {
  american: "US",
  argentinian: "AR",
  argentine: "AR",
  australian: "AU",
  austrian: "AT",
  bangladeshi: "BD",
  belgian: "BE",
  brazilian: "BR",
  british: "GB",
  canadian: "CA",
  chilean: "CL",
  colombian: "CO",
  cuban: "CU",
  egyptian: "EG",
  ghanaian: "GH",
  indian: "IN",
  irish: "IE",
  jamaican: "JM",
  kenyan: "KE",
  lebanese: "LB",
  malaysian: "MY",
  mexican: "MX",
  moroccan: "MA",
  nigerian: "NG",
  pakistani: "PK",
  peruvian: "PE",
  filipino: "PH",
  scottish: "GB",
  senegalese: "SN",
  "south african": "ZA",
  swiss: "CH",
  venezuelan: "VE",
};

const COUNTRY_ALIASES: Record<string, string> = {
  usa: "US",
  "u s a": "US",
  america: "US",
  "united states of america": "US",
  uk: "GB",
  britain: "GB",
  "great britain": "GB",
  england: "GB",
  scotland: "GB",
  wales: "GB",
  korea: "KR",
  uae: "AE",
  emirates: "AE",
  holland: "NL",
  russia: "RU",
  turkiye: "TR",
  "ivory coast": "CI",
  "czech republic": "CZ",
  vietnam: "VN",
  iran: "IR",
  syria: "SY",
  bolivia: "BO",
  venezuela: "VE",
  tanzania: "TZ",
  taiwan: "TW",
};

// Genres map to Radio Browser tags. Faith tags are only used when named explicitly.
const GENRES: Record<string, string[]> = {
  jazz: ["jazz"],
  "smooth jazz": ["smooth jazz"],
  blues: ["blues"],
  rock: ["rock"],
  "classic rock": ["classic rock"],
  metal: ["metal", "heavy metal"],
  pop: ["pop"],
  classical: ["classical", "orchestra", "symphony", "opera"],
  news: ["news", "headlines"],
  talk: ["talk", "talk radio", "podcast"],
  sports: ["sports", "sport", "football", "soccer", "cricket"],
  hiphop: ["hip hop", "hiphop", "hip-hop", "rap"],
  "r&b": ["r&b", "rnb", "r and b"],
  electronic: ["electronic", "electronica"],
  dance: ["dance", "edm", "club"],
  house: ["house"],
  techno: ["techno"],
  lofi: ["lofi", "lo fi"],
  reggae: ["reggae"],
  latin: ["latin"],
  salsa: ["salsa"],
  reggaeton: ["reggaeton"],
  country: ["country music", "country and western"],
  folk: ["folk", "traditional"],
  ambient: ["ambient"],
  lounge: ["lounge"],
  oldies: ["oldies"],
  "80s": ["80s", "eighties"],
  "90s": ["90s", "nineties"],
  soul: ["soul"],
  funk: ["funk"],
  afrobeats: ["afrobeats", "afrobeat"],
  bollywood: ["bollywood"],
  "k-pop": ["kpop", "k pop"],
  anime: ["anime"],
  children: ["kids", "children"],
  religious: ["religious", "faith", "spiritual"],
  christian: ["christian"],
  gospel: ["gospel"],
  islamic: ["islamic"],
  quran: ["quran", "koran"],
  nasheed: ["nasheed", "nasheeds"],
};

const MOOD_WORDS: Record<(typeof MOOD_NAMES)[number], string[]> = {
  calm: [
    "calm",
    "relaxing",
    "relax",
    "chill",
    "chilled",
    "peaceful",
    "soft",
    "sleep",
    "mellow",
    "quiet",
  ],
  energetic: ["energetic", "upbeat", "party", "workout", "hype", "pump"],
  nostalgic: ["nostalgic", "retro", "old school", "throwback", "classic hits"],
  romantic: ["romantic", "love songs", "love"],
  focused: ["focus", "focused", "study", "studying", "work", "concentrate"],
  melancholic: ["sad", "melancholic", "melancholy", "rainy"],
  joyful: ["happy", "joyful", "fun", "sunny", "feel good"],
  mysterious: ["dark", "mysterious", "late night", "night"],
};

// Tag to search when the mood is the only signal.
const MOOD_TAG: Record<(typeof MOOD_NAMES)[number], string> = {
  calm: MOODS.find((m) => m.slug === "chill")?.primaryTag ?? "lounge",
  energetic: "dance",
  nostalgic: "oldies",
  romantic: "romantic",
  focused: "lofi",
  melancholic: "ambient",
  joyful: "pop",
  mysterious: "ambient",
};

const FILLER = new Set(
  "a an and any around best from give i in into just like listen listening me music of on or play please radio some something songs station stations stuff that the to tune want with good nice from".split(
    " ",
  ),
);

let countryIndex: Map<string, string> | null = null;

function buildCountryIndex() {
  const index = new Map<string, string>();
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null;
  }
  if (names) {
    for (let a = 65; a <= 90; a++) {
      for (let b = 65; b <= 90; b++) {
        const code = String.fromCharCode(a, b);
        let name: string | undefined;
        try {
          name = names.of(code);
        } catch {
          name = undefined;
        }
        if (!name || name === code || name === "Unknown Region") continue;
        const key = normalizeQuery(name).trim();
        if (key.length > 3 && !index.has(key)) index.set(key, code);
      }
    }
  }
  for (const [alias, code] of Object.entries({ ...COUNTRY_ALIASES, ...DEMONYMS })) {
    index.set(normalizeQuery(alias).trim(), code);
  }
  return index;
}

/** Find the longest dictionary phrase in the query and remove it. */
function take<T>(query: { value: string }, entries: [phrase: string, result: T][]): T | undefined {
  const sorted = [...entries].sort((a, b) => b[0].length - a[0].length);
  for (const [phrase, result] of sorted) {
    const needle = ` ${phrase} `;
    const at = query.value.indexOf(needle);
    if (at !== -1) {
      query.value = `${query.value.slice(0, at)} ${query.value.slice(at + needle.length - 1)}`;
      return result;
    }
  }
  return undefined;
}

/**
 * Deterministic natural language to search intent. Only explicit words are
 * used: countries and languages never imply a religion or culture tag.
 */
export function parseIntent(input: string): Intent {
  countryIndex ??= buildCountryIndex();
  const query = { value: normalizeQuery(input.slice(0, 200)) };
  const intent: Intent = {};

  const genre = take(
    query,
    Object.entries(GENRES).flatMap(([tag, words]) =>
      words.map((w) => [normalizeQuery(w).trim(), tag] as [string, string]),
    ),
  );
  if (genre) intent.tag = genre;

  const language = take(
    query,
    Object.entries(LANGUAGES).flatMap(([lang, words]) =>
      words.map((w) => [w, lang] as [string, string]),
    ),
  );
  if (language) intent.language = language;

  const country = take(query, [...countryIndex.entries()]);
  if (country) intent.country = country;

  const mood = take(
    query,
    Object.entries(MOOD_WORDS).flatMap(([m, words]) =>
      words.map((w) => [w, m] as [string, (typeof MOOD_NAMES)[number]]),
    ),
  );
  if (mood) {
    intent.mood = mood;
    intent.tag ??= MOOD_TAG[mood];
  }

  const leftover = query.value
    .split(" ")
    .filter((word) => word && !FILLER.has(word))
    .join(" ")
    .trim();
  if (leftover && !intent.tag && !intent.country && !intent.language) {
    intent.text = leftover.slice(0, 100);
  }

  return intentSchema.parse(intent);
}

/** Human readable summary, e.g. "Calm · Jazz · Japanese · Japan". */
export function describeIntent(intent: Intent, countryName?: (code: string) => string | undefined) {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return [
    intent.mood && cap(intent.mood),
    intent.tag && cap(intent.tag),
    intent.language && cap(intent.language),
    intent.country && (countryName?.(intent.country) ?? intent.country),
    intent.text && `"${intent.text}"`,
  ]
    .filter(Boolean)
    .join(" · ");
}
