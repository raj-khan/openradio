"use client";

import type Hls from "hls.js";
import { useEffect, useRef } from "react";
import {
  LOAD_TIMEOUT_MS,
  RETRY_DELAY_MS,
  STREAM_ERROR,
  UNSUPPORTED_ERROR,
  isAbort,
  isAutoplayBlocked,
  shouldRetry,
  sourceStrategy,
} from "@/lib/player/engine-utils";
import { useHistory } from "@/lib/library/history";
import { usePlayerStore } from "@/lib/player/store";
import type { Station } from "@/lib/stations/types";

/**
 * Owns the single <audio> element. Mounted once in the root layout so
 * playback survives client-side navigation. It reacts to store changes and
 * reports media events back into the store's state machine.
 */
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const attemptRef = useRef(0);
  const reportedRef = useRef<number>(-1);
  const timersRef = useRef<{ retry?: number; timeout?: number }>({});

  const session = usePlayerStore((s) => s.session);
  const status = usePlayerStore((s) => s.status);
  const station = usePlayerStore((s) => s.station);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const dispatch = usePlayerStore((s) => s.dispatch);

  // Volume and mute.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  // Load, resume, pause and stop.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timers = timersRef.current;

    const clearTimers = () => {
      window.clearTimeout(timers.retry);
      window.clearTimeout(timers.timeout);
    };

    const teardown = () => {
      clearTimers();
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };

    if (status === "idle" || !station) {
      teardown();
      return;
    }

    if (status === "paused") {
      clearTimers();
      audio.pause();
      return;
    }

    if (status !== "loading") return;

    let cancelled = false;
    const isCurrent = () => !cancelled && usePlayerStore.getState().session === session;

    const fail = (message = STREAM_ERROR) => {
      if (!isCurrent()) return;
      if (message === STREAM_ERROR && shouldRetry(attemptRef.current)) {
        attemptRef.current += 1;
        timers.retry = window.setTimeout(() => isCurrent() && start(station), RETRY_DELAY_MS);
        return;
      }
      teardown();
      dispatch({ type: "ERROR", message });
    };

    const tryPlay = () => {
      audio.play().catch((error: unknown) => {
        if (!isCurrent() || isAbort(error)) return;
        // Stream failures surface through the media "error" event or the load timeout.
        if (isAutoplayBlocked(error)) dispatch({ type: "PAUSE" });
      });
    };

    async function start(target: Station) {
      clearTimers();
      hlsRef.current?.destroy();
      hlsRef.current = null;
      timers.timeout = window.setTimeout(() => {
        if (usePlayerStore.getState().status === "loading") fail();
      }, LOAD_TIMEOUT_MS);

      const nativeHls = audio!.canPlayType("application/vnd.apple.mpegurl") !== "";
      let HlsClass: typeof Hls | null = null;
      if (target.isHls && !nativeHls) {
        try {
          HlsClass = (await import("hls.js")).default;
        } catch {
          HlsClass = null;
        }
        if (!isCurrent()) return;
      }

      const strategy = sourceStrategy(target, {
        nativeHls,
        hlsJs: Boolean(HlsClass?.isSupported()),
      });

      if (strategy === "unsupported") return fail(UNSUPPORTED_ERROR);

      if (strategy === "hls.js" && HlsClass) {
        const hls = new HlsClass({ lowLatencyMode: false });
        hlsRef.current = hls;
        hls.on(HlsClass.Events.ERROR, (_event, data) => {
          if (data.fatal) fail();
        });
        hls.loadSource(target.streamUrl);
        hls.attachMedia(audio!);
      } else {
        audio!.src = target.streamUrl;
        audio!.load();
      }
      tryPlay();
    }

    // A new session means a new source; otherwise resume from pause at the live edge.
    if (audio.dataset.session !== String(session)) {
      audio.dataset.session = String(session);
      attemptRef.current = 0;
      void start(station);
    } else if (hlsRef.current) {
      tryPlay();
    } else {
      audio.load();
      tryPlay();
    }

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [session, status, station, dispatch]);

  // Media element events feed the state machine.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timers = timersRef.current;

    const onPlaying = () => {
      window.clearTimeout(timers.timeout);
      attemptRef.current = 0;
      const state = usePlayerStore.getState();
      state.dispatch({ type: "PLAYING" });
      if (state.station && reportedRef.current !== state.session) {
        reportedRef.current = state.session;
        useHistory.getState().record(state.station);
        void fetch(`/api/stations/${state.station.id}/click`, {
          method: "POST",
          keepalive: true,
        }).catch(() => {});
      }
    };
    const onWaiting = () => usePlayerStore.getState().dispatch({ type: "WAITING" });
    const onError = () => {
      const state = usePlayerStore.getState();
      // Errors after teardown (empty src) or while paused are not stream failures.
      if (!audio.getAttribute("src") && !hlsRef.current) return;
      if (state.status === "paused" || state.status === "idle") return;
      if (shouldRetry(attemptRef.current)) {
        attemptRef.current += 1;
        timers.retry = window.setTimeout(() => {
          audio.load();
          audio.play().catch(() => {});
        }, RETRY_DELAY_MS);
        return;
      }
      state.dispatch({ type: "ERROR", message: STREAM_ERROR });
    };
    const onPause = () => {
      // Pauses triggered outside the app (headphones unplugged, OS controls).
      const state = usePlayerStore.getState();
      if (state.status === "playing" || state.status === "buffering") {
        state.dispatch({ type: "PAUSE" });
      }
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return <audio ref={audioRef} preload="none" className="hidden" data-testid="audio-engine" />;
}
