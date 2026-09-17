import type { PlayerStatus } from "@/lib/player/machine";
import type { Station } from "@/lib/stations/types";

export interface MediaMetadataInit {
  title: string;
  artist: string;
  album: string;
  artwork: { src: string; sizes?: string }[];
}

/** Build lock screen metadata. Now playing text takes the title slot when known. */
export function buildMediaMetadata(
  station: Pick<Station, "name" | "country" | "faviconUrl">,
  nowPlaying?: string | null,
): MediaMetadataInit {
  return {
    title: nowPlaying?.trim() || station.name,
    artist: nowPlaying?.trim() ? station.name : (station.country ?? "Live radio"),
    album: "OpenRadio",
    artwork: station.faviconUrl ? [{ src: station.faviconUrl, sizes: "512x512" }] : [],
  };
}

export function mediaPlaybackState(status: PlayerStatus): MediaSessionPlaybackState {
  if (status === "idle") return "none";
  if (status === "paused" || status === "error") return "paused";
  return "playing";
}
