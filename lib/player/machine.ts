import type { Station } from "@/lib/stations/types";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "buffering" | "error";

export interface PlaybackState {
  status: PlayerStatus;
  station: Station | null;
  /** Friendly message shown when status is "error". */
  error: string | null;
  /** Increments whenever the audio source must be (re)loaded. */
  session: number;
}

export type PlayerEvent =
  | { type: "LOAD"; station: Station }
  | { type: "RESUME" }
  | { type: "PAUSE" }
  | { type: "PLAYING" }
  | { type: "WAITING" }
  | { type: "ERROR"; message: string }
  | { type: "STOP" };

export const initialPlaybackState: PlaybackState = {
  status: "idle",
  station: null,
  error: null,
  session: 0,
};

const ACTIVE: PlayerStatus[] = ["loading", "playing", "buffering"];

/** Pure player state machine. Invalid events for the current state are ignored. */
export function transition(state: PlaybackState, event: PlayerEvent): PlaybackState {
  switch (event.type) {
    case "LOAD":
      return {
        status: "loading",
        station: event.station,
        error: null,
        session: state.session + 1,
      };

    case "RESUME":
      if (!state.station) return state;
      if (state.status === "paused") return { ...state, status: "loading" };
      if (state.status === "error") {
        return { ...state, status: "loading", error: null, session: state.session + 1 };
      }
      return state;

    case "PAUSE":
      return ACTIVE.includes(state.status) ? { ...state, status: "paused" } : state;

    case "PLAYING":
      return state.status === "loading" || state.status === "buffering"
        ? { ...state, status: "playing" }
        : state;

    case "WAITING":
      return state.status === "playing" ? { ...state, status: "buffering" } : state;

    case "ERROR":
      return ACTIVE.includes(state.status)
        ? { ...state, status: "error", error: event.message }
        : state;

    case "STOP":
      return { ...initialPlaybackState, session: state.session + 1 };
  }
}

export function isActive(status: PlayerStatus) {
  return ACTIVE.includes(status);
}
