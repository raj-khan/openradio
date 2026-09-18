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

/** Tags broadcasters use for stations built around people talking. */
export const SPEECH_TAGS = new Set([
  "talk",
  "talk radio",
  "talkradio",
  "news",
  "news talk",
  "news/talk",
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
]);

/** Bitrate floors, in kbps. Speech carries fine well below what music needs. */
export const MIN_MUSIC_BITRATE = 64;
export const MIN_SPEECH_BITRATE = 32;

export function isSpeechStation(station: Station): boolean {
  return station.tags.some((tag) => SPEECH_TAGS.has(tag.toLowerCase()));
}

/**
 * The lowest bitrate worth offering for this station. Judging speech by a music
 * floor is what made talk radio disappear, so each station is judged by what it
 * actually broadcasts.
 */
export function minBitrateFor(station: Station): number {
  return isSpeechStation(station) ? MIN_SPEECH_BITRATE : MIN_MUSIC_BITRATE;
}

export function meetsQualityFloor(station: Station): boolean {
  return (station.bitrate ?? 0) >= minBitrateFor(station);
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
