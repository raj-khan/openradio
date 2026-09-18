import { describe, expect, it, vi } from "vitest";
import { parseIntent } from "@/lib/discover/intent";
import {
  FALLBACK_SUGGESTIONS,
  readListener,
  suggestionsFor,
  timeOfDay,
} from "@/lib/discover/suggestions";

const everyListener = () => {
  const out: { hour: number; countryCode?: string; language?: string }[] = [];
  for (const countryCode of [undefined, "BD", "CU", "GB", "JP", "MX", "EG", "TR", "IN", "DE"]) {
    for (const language of [undefined, "bn", "es", "ja", "ar", "tr", "hi", "de"]) {
      for (let hour = 0; hour < 24; hour++) out.push({ hour, countryCode, language });
    }
  }
  return out;
};

describe("timeOfDay", () => {
  it("splits the day where the listening actually changes", () => {
    expect(timeOfDay(2)).toBe("night");
    expect(timeOfDay(23)).toBe("night");
    expect(timeOfDay(8)).toBe("morning");
    expect(timeOfDay(14)).toBe("afternoon");
    expect(timeOfDay(20)).toBe("evening");
  });
});

describe("suggestionsFor", () => {
  it("names the listener's own country when we can tell", () => {
    const dhaka = suggestionsFor({ hour: 2, countryCode: "BD", language: "bn" });
    expect(dhaka.some((s) => s.includes("Bangladesh"))).toBe(true);
    expect(dhaka.some((s) => s.includes("Bengali"))).toBe(true);
  });

  it("follows the clock", () => {
    const night = suggestionsFor({ hour: 2 });
    const morning = suggestionsFor({ hour: 8 });
    expect(night).toContain("Late night lofi");
    expect(morning).toContain("Morning news");
    expect(night).not.toEqual(morning);
  });

  it("still gives four usable prompts when it knows nothing", () => {
    const blind = suggestionsFor({ hour: 14 });
    expect(blind).toHaveLength(4 - 1); // three time-based, no country or language
    expect(blind.every((s) => s.length > 0)).toBe(true);
  });

  it("never repeats itself", () => {
    for (const listener of everyListener()) {
      const s = suggestionsFor(listener);
      expect(new Set(s).size, JSON.stringify(listener)).toBe(s.length);
    }
  });

  it("offers at most four", () => {
    for (const listener of everyListener()) {
      expect(suggestionsFor(listener).length).toBeLessThanOrEqual(4);
    }
  });

  it("only ever suggests something the intent parser understands", () => {
    // A prompt that parsed to nothing would send someone to an empty page,
    // which is worse than the fixed examples it replaced.
    const prompts = new Set(FALLBACK_SUGGESTIONS);
    for (const listener of everyListener()) suggestionsFor(listener).forEach((s) => prompts.add(s));
    expect(prompts.size).toBeGreaterThan(20);
    for (const prompt of prompts) {
      const intent = parseIntent(prompt);
      const understood =
        Boolean(intent.tag) ||
        Boolean(intent.country) ||
        Boolean(intent.language) ||
        Boolean(intent.mood);
      expect(understood, `"${prompt}" parsed to nothing`).toBe(true);
    }
  });
});

describe("readListener", () => {
  it("gives up quietly rather than guessing", () => {
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(() => {
      throw new Error("no Intl here");
    });
    expect(readListener()).toBeNull();
    vi.restoreAllMocks();
  });

  it("does not name English, which is the site's own language", () => {
    vi.stubGlobal("navigator", { language: "en-GB" });
    expect(readListener()?.language).toBeUndefined();
    vi.stubGlobal("navigator", { language: "bn-BD" });
    expect(readListener()?.language).toBe("bn");
    vi.unstubAllGlobals();
  });
});
