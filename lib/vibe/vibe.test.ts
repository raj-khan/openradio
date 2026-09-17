import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, hslToHex, luminance } from "@/lib/vibe/color";
import { vibeFor } from "@/lib/vibe/mood";
import { NEUTRAL_THEME, themeContrastIssues, themeFor, themeToCssVars } from "@/lib/vibe/theme";

describe("color utilities", () => {
  it("converts colors", () => {
    expect(hexToRgb("#ff5a2c")).toEqual({ r: 255, g: 90, b: 44 });
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hslToHex(0, 100, 50)).toBe("#ff0000");
    expect(hslToHex(120, 100, 25)).toBe("#008000");
    expect(hslToHex(-120, 100, 50)).toBe("#0000ff");
  });

  it("computes WCAG contrast", () => {
    expect(luminance("#000000")).toBe(0);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
  });
});

describe("vibeFor", () => {
  it.each([
    [["jazz", "smooth jazz"], "calm"],
    [["news", "talk"], "focused"],
    [["dance", "electronic"], "energetic"],
    [["80s", "oldies"], "nostalgic"],
    [["pop", "hits"], "joyful"],
    [["blues"], "melancholic"],
    [["ambient", "space"], "mysterious"],
    [["bossa nova"], "romantic"],
    [["généraliste"], "neutral"],
    [[], "neutral"],
  ])("%j -> %s", (tags, mood) => {
    expect(vibeFor(tags).mood).toBe(mood);
  });

  it("weights earlier tags more", () => {
    expect(vibeFor(["news", "pop"]).mood).toBe("focused");
    expect(vibeFor(["pop", "news"]).mood).toBe("joyful");
  });

  it("lets now playing nudge an untagged station", () => {
    expect(vibeFor([], "Late Night Jazz Session").mood).toBe("calm");
    expect(vibeFor(["news"], "Pop hits").mood).toBe("focused");
  });

  it("does not match words inside other words", () => {
    expect(vibeFor(["housewives"]).mood).toBe("neutral");
  });
});

describe("themes", () => {
  it("neutral theme passes AA", () => {
    expect(themeContrastIssues(NEUTRAL_THEME)).toEqual([]);
  });

  it("every mood preset passes AA for every station hue", () => {
    const moods = [
      "calm",
      "energetic",
      "nostalgic",
      "romantic",
      "focused",
      "melancholic",
      "joyful",
      "mysterious",
    ] as const;
    for (const mood of moods) {
      for (let hue = 0; hue < 360; hue += 15) {
        const theme = themeFor(mood, hue);
        expect(themeContrastIssues(theme), `${mood} @ ${hue}`).toEqual([]);
        expect(theme, `${mood} @ ${hue} should not need the fallback`).not.toBe(NEUTRAL_THEME);
      }
    }
  });

  it("keeps stations with the same mood distinct", () => {
    expect(themeFor("calm", 0).accent).not.toBe(themeFor("calm", 300).accent);
  });

  it("maps to CSS variables", () => {
    expect(themeToCssVars(NEUTRAL_THEME)["--surface-strong"]).toBe("#211c16");
  });
});
