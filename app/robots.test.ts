import { describe, expect, it } from "vitest";
import robots from "./robots";
import { AI_CRAWLERS, ANSWER_CRAWLERS, TRAINING_CRAWLERS } from "@/lib/seo/crawlers";

const rules = () => {
  const { rules: value } = robots();
  return Array.isArray(value) ? value : [value];
};

describe("robots", () => {
  it("allows every AI crawler by name", () => {
    const named = rules().map((rule) => rule.userAgent);
    for (const crawler of AI_CRAWLERS) expect(named).toContain(crawler);
  });

  it("allows answer engines and training crawlers alike", () => {
    // Allowing both is a deliberate choice for a free, open source product.
    const allowed = new Set(
      rules()
        .filter((rule) => rule.allow === "/")
        .flatMap((rule) => (Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent])),
    );
    for (const crawler of [...ANSWER_CRAWLERS, ...TRAINING_CRAWLERS]) {
      expect(allowed.has(crawler)).toBe(true);
    }
  });

  it("keeps the API out of reach for every user agent", () => {
    for (const rule of rules()) expect(rule.disallow).toContain("/api/");
  });

  it("still carries a wildcard rule for everything else", () => {
    expect(rules().some((rule) => rule.userAgent === "*")).toBe(true);
  });

  it("points at the sitemap", () => {
    expect(robots().sitemap).toMatch(/^https:\/\/.+\/sitemap\.xml$/);
  });

  it("names no crawler twice", () => {
    expect(new Set(AI_CRAWLERS).size).toBe(AI_CRAWLERS.length);
  });
});
