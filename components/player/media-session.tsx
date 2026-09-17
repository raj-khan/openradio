"use client";

import { useEffect } from "react";
import { buildMediaMetadata, mediaPlaybackState } from "@/lib/player/media-session";
import { useNowPlayingTitle } from "@/lib/now-playing/store";
import { usePlayerStore } from "@/lib/player/store";

/** Keeps the OS media controls (lock screen, media keys) in sync with the player. */
export function MediaSession() {
  const station = usePlayerStore((s) => s.station);
  const nowPlaying = useNowPlayingTitle(station?.id);
  const status = usePlayerStore((s) => s.status);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const { dispatch, pause, stop } = usePlayerStore.getState();

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => dispatch({ type: "RESUME" })],
      ["pause", () => pause()],
      ["stop", () => stop()],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Action not supported by this browser.
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          session.setActionHandler(action, null);
        } catch {
          // Ignore.
        }
      }
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.playbackState = mediaPlaybackState(status);
    if (!station || typeof MediaMetadata === "undefined") {
      session.metadata = null;
      return;
    }
    session.metadata = new MediaMetadata(buildMediaMetadata(station, nowPlaying));
  }, [station, status, nowPlaying]);

  return null;
}
