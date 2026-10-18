import { describe, expect, it } from "vitest";
import robots from "./robots";
import { AI_CRAWLERS, ANSWER_CRAWLERS, BLOCKED_CRAWLERS } from "@/lib/seo/crawlers";

const rules = () => {
  const { rules: value } = robots();
  return Array.isArray(value) ? value : [value];
};

const agents = (rule: { userAgent?: string | string[] }) =>
  Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent];

describe("robots", () => {
  it("names every crawler the policy has an opinion about", () => {
    const named = rules().flatMap(agents);
    for (const crawler of AI_CRAWLERS) expect(named).toContain(crawler);
  });

  it("allows the crawlers that cite the site and send a reader back", () => {
    const allowed = new Set(
      rules()
        .filter((rule) => rule.allow === "/")
        .flatMap(agents),
    );
    for (const crawler of ANSWER_CRAWLERS) expect(allowed.has(crawler)).toBe(true);
  });

  it("refuses the bulk collectors outright", () => {
    // Dropping them from the list would not be enough: the wildcard rule
    // allows everything it does not name, so each one needs its own refusal.
    for (const crawler of BLOCKED_CRAWLERS) {
      const rule = rules().find((entry) => agents(entry).includes(crawler));
      expect(rule?.disallow).toBe("/");
      expect(rule?.allow).toBeUndefined();
    }
  });

  it("keeps the API out of reach for every user agent it welcomes", () => {
    for (const rule of rules()) {
      if (rule.allow !== "/") continue;
      expect(rule.disallow).toContain("/api/");
    }
  });

  it("still carries a wildcard rule, so search engines stay welcome", () => {
    const wildcard = rules().find((rule) => rule.userAgent === "*");
    expect(wildcard?.allow).toBe("/");
  });

  it("points at the sitemap", () => {
    expect(robots().sitemap).toMatch(/^https:\/\/.+\/sitemap\.xml$/);
  });

  it("names no crawler twice", () => {
    expect(new Set(AI_CRAWLERS).size).toBe(AI_CRAWLERS.length);
  });
});
