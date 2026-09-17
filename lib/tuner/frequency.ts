import { clamp } from "@/lib/utils";

export const FM_MIN = 87.5;
export const FM_MAX = 108.0;
const STEPS = Math.round((FM_MAX - FM_MIN) * 10); // 0.1 MHz steps

/** Stable pseudo FM frequency for a station id, e.g. "94.3". Purely decorative. */
export function stationFrequency(id: string): string {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  const step = hash % (STEPS + 1);
  return (FM_MIN + step / 10).toFixed(1);
}

/** Index of the dial entry nearest to the needle for a given scroll offset. */
export function nearestDialIndex(scrollLeft: number, segmentWidth: number, count: number): number {
  if (count <= 0 || segmentWidth <= 0) return 0;
  return clamp(Math.round(scrollLeft / segmentWidth), 0, count - 1);
}
