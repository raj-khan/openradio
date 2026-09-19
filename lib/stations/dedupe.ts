import type { Station } from "@/lib/stations/types";

/*
 * The same audio, filed twice.
 *
 * Radio Browser is community edited, so a station often arrives more than once:
 * someone adds "Jago Fm", someone else adds "Jago FM 94.4", and both rows carry
 * the identical stream address. Measured against the live directory, 50 of 480
 * popular entries (10%) duplicate another entry's stream, and in Bangladesh both
 * of Jago FM's rows point at a stream that is off the air. Asking for voices in
 * Dhaka therefore spent two of its attempts on the same silence.
 *
 * Collapsing on the stream rather than the name is what makes the alternates
 * list worth having: four fallbacks are only four chances if they are four
 * different stations.
 */

/**
 * What identifies the audio, ignoring how the row spells it. Protocol is left
 * out because the same host serving http and https is one station, not two, and
 * we already prefer the https address when playing.
 */
export function streamKey(url: string): string {
  try {
    const parsed = new URL(url);
    const port =
      parsed.port && parsed.port !== "80" && parsed.port !== "443" ? `:${parsed.port}` : "";
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${host}${port}${path}${parsed.search}`;
  } catch {
    // Not parseable: treat the raw string as its own identity rather than
    // collapsing every malformed row into one.
    return url.trim().toLowerCase();
  }
}

/**
 * Which of two rows for the same stream to keep. Tags decide first because a
 * described station can be matched to a mood or a listening mode, and an
 * untagged one is invisible to both however healthy it is.
 */
export function betterEntry(a: Station, b: Station): Station {
  if (a.lastCheckOk !== b.lastCheckOk) return a.lastCheckOk ? a : b;
  if (a.tags.length !== b.tags.length) return a.tags.length > b.tags.length ? a : b;
  const aBitrate = a.bitrate ?? 0;
  const bBitrate = b.bitrate ?? 0;
  if (aBitrate !== bBitrate) return aBitrate > bBitrate ? a : b;
  if (a.votes !== b.votes) return a.votes > b.votes ? a : b;
  return a;
}

/**
 * One entry per stream, keeping the order the caller gave us: the directory
 * hands lists back in popularity order and dropping to a better documented
 * duplicate should not move the station up or down that list.
 */
export function dedupeByStream(stations: Station[]): Station[] {
  const positions = new Map<string, number>();
  const kept: Station[] = [];
  for (const station of stations) {
    const key = streamKey(station.streamUrl);
    const seen = positions.get(key);
    if (seen === undefined) {
      positions.set(key, kept.length);
      kept.push(station);
    } else {
      kept[seen] = betterEntry(kept[seen], station);
    }
  }
  return kept;
}
