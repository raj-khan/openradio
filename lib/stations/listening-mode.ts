import type { Station } from "@/lib/stations/types";

/*
 * Whether someone wants voices or music.
 *
 * A listener reported never once hearing a presenter. The stations were there
 * all along (17% of the popular pool is tagged for speech) but nothing let you
 * ask for them, and the quality floor quietly worked against them: speech is
 * broadcast at lower bitrates because it does not need the bandwidth, so a
 * floor chosen to keep music sounding good was dropping talk stations. The BBC
 * World Service streams at 56 kbps and was being excluded outright.
 */

export const LISTENING_MODES = ["any", "music", "talk"] as const;
export type ListeningMode = (typeof LISTENING_MODES)[number];

export function isListeningMode(value: unknown): value is ListeningMode {
  return LISTENING_MODES.includes(value as ListeningMode);
}

/*
 * Tags broadcasters use for stations built around people talking.
 *
 * In the languages they actually use, not just English. An English-only list
 * found one voice station or none in six of the sixteen featured countries,
 * because Cuba tags news as "noticias", Turkey as "haber", Morocco as
 * "actualites" and Egypt's Quran stations as "اسلامي" and "قران كريم".
 */
export const SPEECH_TAGS = new Set([
  // English
  "talk",
  "talk radio",
  "talkradio",
  "news",
  "news talk",
  "news/talk",
  "newstalk",
  "public radio",
  "information",
  "current affairs",
  "politics",
  "debate",
  "documentary",
  "education",
  "culture",
  "spoken",
  "spoken word",
  "comedy",
  "podcast",
  "sports",
  "sport",
  "religious",
  "christian",
  "gospel",
  "islamic",
  "quran",
  "preaching",
  "spiritual",
  "radio drama",
  "radiodrama",
  // Spanish and Portuguese
  "noticias",
  "noticia",
  "notícias",
  "informativo",
  "actualidad",
  "deportes",
  "esportes",
  "jornalismo",
  "notiziario",
  "hablado",
  "religioso",
  "cristiana",
  "católica",
  // French
  "actualites",
  "actualités",
  "info",
  "infos",
  "parole",
  "religieuse",
  // German and Dutch
  "nachrichten",
  "wort",
  "wissen",
  "bildung",
  "nieuws",
  "sprechfunk",
  // Turkish
  "haber",
  "haberler",
  "sohbet",
  "dini",
  // Italian
  "notizie",
  "informazione",
  "parlato",
  // Arabic
  "اخبار",
  "أخبار",
  "اسلامي",
  "إسلامي",
  "دين",
  "ديني",
  "قران",
  "قران كريم",
  "قرآن",
  "القرآن الكريم",
  "حديث",
  "ثقافة",
  // Bengali, Hindi and Urdu
  "সংবাদ",
  "খবর",
  "समाचार",
  "خبریں",
  // Indonesian, Malay and Filipino
  "berita",
  "dakwah",
  "balita",
  // Russian and Ukrainian
  "новости",
  "новини",
  "разговорное",
  // East Asian
  "ニュース",
  "뉴스",
  "新闻",
]);

/*
 * Some speech stations carry no useful tag at all, and the name is the only
 * signal there is: Mexico's "88.9 Noticias" is tagged with frequencies and
 * network names, Turkey's "a HABER" and "Habertürk Radyo" carry nothing, and
 * Egypt's Quran stations are tagged "classical" or left bare.
 *
 * This is a weaker signal than a tag, so it stays deliberately narrow: words
 * that name a format rather than describe a sound. It will not catch everything
 * (Cuba's "Radio Reloj" announces itself as a clock, not as news) and it is not
 * meant to.
 */
const SPEECH_NAME_WORDS = [
  "news",
  "newstalk",
  "talk",
  "noticias",
  "noticia",
  "notícias",
  "informativo",
  "actualites",
  "actualités",
  "haber",
  "habertürk",
  "nachrichten",
  "notizie",
  "nieuws",
  "berita",
  "quran",
  "coran",
  "qur'an",
  "gospel",
  "bible",
  "sermon",
  "gebet",
];

/** Words that only make sense as whole tokens in a Latin-script name. */
const NAME_PATTERN = new RegExp(
  `(?:^|[^\\p{L}])(${SPEECH_NAME_WORDS.join("|")})(?:[^\\p{L}]|$)`,
  "iu",
);

/** Keywords in scripts without spaces between words, matched as substrings. */
const SPEECH_NAME_SUBSTRINGS = [
  "القرآن",
  "قرآن",
  "قران",
  "اخبار",
  "أخبار",
  "নিউজ",
  "খবর",
  "뉴스",
  "ニュース",
];

export function nameSuggestsSpeech(name: string): boolean {
  const value = name.toLowerCase();
  if (NAME_PATTERN.test(value)) return true;
  return SPEECH_NAME_SUBSTRINGS.some((word) => value.includes(word));
}

/** Bitrate floors, in kbps. Speech carries fine well below what music needs. */
export const MIN_MUSIC_BITRATE = 64;
export const MIN_SPEECH_BITRATE = 32;

export function isSpeechStation(station: Station): boolean {
  if (station.tags.some((tag) => SPEECH_TAGS.has(tag.toLowerCase()))) return true;
  return nameSuggestsSpeech(station.name);
}

/**
 * The lowest bitrate worth offering for this station. Judging speech by a music
 * floor is what made talk radio disappear, so each station is judged by what it
 * actually broadcasts.
 */
export function minBitrateFor(station: Station): number {
  return isSpeechStation(station) ? MIN_SPEECH_BITRATE : MIN_MUSIC_BITRATE;
}

/*
 * An unrecorded bitrate is not a bad one.
 *
 * The directory writes 0 when it has no bitrate on file, which normalizing
 * turns into undefined. Reading that as 0 kbps failed the floor and dropped the
 * station outright, and the gap is not small: of the live stations measured,
 * 43% in Bangladesh, 45% in Egypt, 49% in India and 50% in Nigeria carry no
 * bitrate at all. It fell hardest on exactly the stations this mode exists to
 * find. Bangladesh has six speech stations and offered three, all because
 * Radio Vivid Voice and Spice FM, both tagged talk, had nothing on file.
 * Nigeria lost thirteen of eighteen the same way.
 *
 * So unknown passes, and the stream probe decides: it already rejects anything
 * that does not answer, which is the thing a listener actually cares about. A
 * bitrate that is on file and genuinely below the floor is still refused.
 */
export function meetsQualityFloor(station: Station): boolean {
  if (station.bitrate === undefined) return true;
  return station.bitrate >= minBitrateFor(station);
}

/** Does this station suit what the listener asked for? */
export function matchesMode(station: Station, mode: ListeningMode): boolean {
  if (mode === "any") return true;
  const speech = isSpeechStation(station);
  return mode === "talk" ? speech : !speech;
}

export const MODE_LABELS: Record<ListeningMode, string> = {
  any: "Anything",
  music: "Music",
  talk: "Voices",
};
