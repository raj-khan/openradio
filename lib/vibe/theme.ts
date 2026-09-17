import { contrastRatio, hslToHex } from "@/lib/vibe/color";
import type { Mood } from "@/lib/vibe/mood";

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentAlt: string;
  accentContrast: string;
}

/** The default Atlas Tuner palette (see app/globals.css). */
export const NEUTRAL_THEME: ThemeTokens = {
  background: "#0a0908",
  surface: "#16130f",
  surfaceStrong: "#211c16",
  border: "#3a3128",
  text: "#f4ede4",
  muted: "#a89c8d",
  accent: "#ff5a2c",
  accentAlt: "#ffb347",
  accentContrast: "#0a0908",
};

interface Preset {
  /** Base hue for backgrounds. */
  hue: number;
  /** Accent hue. */
  accent: number;
  /** Accent saturation and lightness. */
  accentSat: number;
  accentLight: number;
  /** How far a station may shift the hue. */
  drift: number;
}

const PRESETS: Record<Exclude<Mood, "neutral">, Preset> = {
  calm: { hue: 205, accent: 190, accentSat: 70, accentLight: 62, drift: 15 },
  energetic: { hue: 330, accent: 330, accentSat: 95, accentLight: 62, drift: 20 },
  nostalgic: { hue: 32, accent: 36, accentSat: 90, accentLight: 60, drift: 10 },
  romantic: { hue: 345, accent: 350, accentSat: 80, accentLight: 70, drift: 10 },
  focused: { hue: 220, accent: 210, accentSat: 20, accentLight: 78, drift: 8 },
  melancholic: { hue: 250, accent: 245, accentSat: 55, accentLight: 72, drift: 12 },
  joyful: { hue: 48, accent: 45, accentSat: 95, accentLight: 58, drift: 15 },
  mysterious: { hue: 275, accent: 285, accentSat: 70, accentLight: 70, drift: 15 },
};

export const AA = 4.5;

/** Every text pairing that must reach WCAG AA. */
export function themeContrastIssues(theme: ThemeTokens): string[] {
  const checks: [string, string, string][] = [
    ["text/background", theme.text, theme.background],
    ["text/surface", theme.text, theme.surface],
    ["text/surfaceStrong", theme.text, theme.surfaceStrong],
    ["muted/background", theme.muted, theme.background],
    ["muted/surface", theme.muted, theme.surface],
    ["accent/background", theme.accent, theme.background],
    ["accentAlt/background", theme.accentAlt, theme.background],
    ["accentContrast/accent", theme.accentContrast, theme.accent],
  ];
  return checks.filter(([, a, b]) => contrastRatio(a, b) < AA).map(([name]) => name);
}

/**
 * Theme for a mood. `seedHue` (0 to 359, e.g. from the station id) shifts the
 * palette slightly so stations with the same mood still feel distinct. Falls
 * back to the neutral theme if any pairing would fail contrast.
 */
export function themeFor(mood: Mood, seedHue = 0): ThemeTokens {
  if (mood === "neutral") return NEUTRAL_THEME;
  const preset = PRESETS[mood];
  const shift = Math.round(((seedHue % 360) / 360) * preset.drift * 2 - preset.drift);
  const hue = preset.hue + shift;
  const accentHue = preset.accent + shift;

  const theme: ThemeTokens = {
    background: hslToHex(hue, 35, 5),
    surface: hslToHex(hue, 28, 9),
    surfaceStrong: hslToHex(hue, 24, 13),
    border: hslToHex(hue, 20, 24),
    text: hslToHex(hue, 30, 95),
    muted: hslToHex(hue, 14, 68),
    accent: hslToHex(accentHue, preset.accentSat, preset.accentLight),
    accentAlt: hslToHex(accentHue + 30, preset.accentSat - 10, preset.accentLight + 8),
    accentContrast: hslToHex(hue, 35, 5),
  };

  return themeContrastIssues(theme).length === 0 ? theme : NEUTRAL_THEME;
}

const CSS_VARS: Record<keyof ThemeTokens, string> = {
  background: "--background",
  surface: "--surface",
  surfaceStrong: "--surface-strong",
  border: "--border",
  text: "--text",
  muted: "--muted",
  accent: "--accent",
  accentAlt: "--accent-alt",
  accentContrast: "--accent-contrast",
};

export function themeToCssVars(theme: ThemeTokens): Record<string, string> {
  return Object.fromEntries(
    (Object.keys(CSS_VARS) as (keyof ThemeTokens)[]).map((key) => [CSS_VARS[key], theme[key]]),
  );
}
