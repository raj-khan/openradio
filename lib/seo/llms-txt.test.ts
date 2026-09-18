import { describe, expect, it } from "vitest";
import { ABOUT_SECTIONS } from "@/lib/copy/about";
import { MOODS, PLACES } from "@/lib/imagery/catalog";
import { PSEO_GENRES } from "@/lib/seo/combos";
import { llmsFullTxt, llmsTxt } from "@/lib/seo/llms-txt";
import { REPO_URL, SITE_NAME } from "@/lib/site";

describe("llmsTxt", () => {
  const text = llmsTxt();

  it("opens with the name and a blockquote summary, as the format expects", () => {
    const [heading, blank, summary] = text.split("\n");
    expect(heading).toBe(`# ${SITE_NAME}`);
    expect(blank).toBe("");
    expect(summary.startsWith("> ")).toBe(true);
  });

  it("links the main entry points as absolute URLs", () => {
    for (const path of ["/", "/search", "/discover", "/about"]) {
      expect(text).toContain(`(https://openradio.space${path})`);
    }
  });

  it("covers every curated country, mood and genre", () => {
    for (const place of PLACES) {
      expect(text).toContain(`/country/${place.countryCode.toLowerCase()})`);
    }
    for (const mood of MOODS) expect(text).toContain(`[${mood.label}]`);
    for (const genre of PSEO_GENRES) {
      expect(text).toContain(`/tag/${encodeURIComponent(genre.tag)})`);
    }
  });

  it("links each destination only once", () => {
    const urls = [...text.matchAll(/^- \[[^\]]+\]\(([^)]+)\)/gm)].map((match) => match[1]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("reads as English for countries that take an article", () => {
    expect(text).toContain("from the United States");
    expect(text).not.toContain("from United States");
    // A capital that shares its country's name should not be repeated.
    expect(text).not.toMatch(/from (\w+), including \1/);
  });

  it("points at the source and the long version", () => {
    expect(text).toContain(REPO_URL);
    expect(text).toContain("/llms-full.txt");
  });

  it("uses only markdown link syntax under its headings", () => {
    const bullets = text.split("\n").filter((line) => line.startsWith("- "));
    expect(bullets.length).toBeGreaterThan(20);
    for (const bullet of bullets) expect(bullet).toMatch(/^- \[[^\]]+\]\(https?:\/\/[^)]+\): .+/);
  });

  it("states that we do not host the audio", () => {
    expect(text).toMatch(/does not host, record or rebroadcast/);
  });
});

describe("llmsFullTxt", () => {
  const text = llmsFullTxt();

  it("carries every about section verbatim, so the two can never disagree", () => {
    for (const section of ABOUT_SECTIONS) {
      expect(text).toContain(`## ${section.title}`);
      expect(text).toContain(section.body);
    }
  });

  it("keeps a blank line before every heading, so the markdown parses", () => {
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      if (index > 0 && line.startsWith("## ")) expect(lines[index - 1]).toBe("");
    });
  });

  it("names the licence and the repository", () => {
    expect(text).toContain("MIT licensed");
    expect(text).toContain(REPO_URL);
  });

  it("is longer than the short version", () => {
    expect(text.length).toBeGreaterThan(llmsTxt().length / 2);
    expect(text).toContain("## Technical notes");
  });

  it("uses no em-dashes", () => {
    expect(text).not.toContain("—");
    expect(llmsTxt()).not.toContain("—");
  });
});
