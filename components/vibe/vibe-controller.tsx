"use client";

import { useEffect, useRef } from "react";
import { useNowPlayingTitle } from "@/lib/now-playing/store";
import { usePlayerStore } from "@/lib/player/store";
import { hueFromString } from "@/lib/stations/display";
import { vibeFor } from "@/lib/vibe/mood";
import { shouldApplyVibe } from "@/lib/vibe/schedule";
import { NEUTRAL_THEME, themeFor, themeToCssVars } from "@/lib/vibe/theme";

/**
 * Applies the current station's vibe to the whole app by overriding the theme
 * CSS variables on <html>. Visual only: it never touches playback.
 */
export function VibeController() {
  const station = usePlayerStore((s) => s.station);
  const status = usePlayerStore((s) => s.status);
  const nowPlaying = useNowPlayingTitle(station?.id);
  const last = useRef({ stationId: null as string | null, mood: "neutral", appliedAt: 0 });

  const active = Boolean(station) && status !== "idle";
  const stationId = active && station ? station.id : null;
  const vibe = active && station ? vibeFor(station.tags, nowPlaying) : null;
  const mood = vibe?.mood ?? "neutral";
  const animation = vibe?.animation ?? "subtle";

  useEffect(() => {
    const root = document.documentElement;
    const now = Date.now();
    if (!shouldApplyVibe(last.current, { stationId, mood }, now)) return;

    const theme = stationId ? themeFor(mood, hueFromString(stationId)) : NEUTRAL_THEME;
    for (const [name, value] of Object.entries(themeToCssVars(theme))) {
      if (theme === NEUTRAL_THEME) root.style.removeProperty(name);
      else root.style.setProperty(name, value);
    }
    root.dataset.mood = mood;
    root.dataset.animation = stationId ? animation : "subtle";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.background);
    last.current = { stationId, mood, appliedAt: now };
  }, [stationId, mood, animation]);

  // Only animate the ambience while audio is actually playing.
  useEffect(() => {
    document.documentElement.dataset.playing = String(status === "playing");
  }, [status]);

  return null;
}
