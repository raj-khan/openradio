import { expect, test, type APIRequestContext } from "@playwright/test";

/*
 * What a crawler sees.
 *
 * Most AI crawlers, and some search crawlers, do not run JavaScript. If a
 * refactor ever moved station content behind hydration the site would still
 * look perfect in a browser while going blank for every one of them, and
 * nothing else we have would notice. These requests execute no JavaScript: they
 * are the raw HTML off the wire, exactly what GPTBot or ClaudeBot receives.
 */

const CRAWLER =
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot";

const TOKYO = "11111111-1111-4111-8111-111111111111";

const PAGES = [
  { path: "/", mustContain: ["Tune the"] },
  { path: "/search", mustContain: [] },
  { path: `/station/${TOKYO}`, mustContain: ["Tokyo Jazz Test FM"] },
  { path: "/country/jp", mustContain: ["Tokyo Jazz Test FM"] },
  { path: "/tag/jazz", mustContain: ["Tokyo Jazz Test FM"] },
  { path: "/jazz-radio-in-japan", mustContain: ["Tokyo Jazz Test FM"] },
  { path: "/faq", mustContain: ["Is OpenRadio free?"] },
  { path: "/about", mustContain: ["Radio Browser"] },
];

async function fetchAsCrawler(request: APIRequestContext, path: string) {
  const response = await request.get(path, { headers: { "User-Agent": CRAWLER } });
  expect(response.status(), path).toBe(200);
  return response.text();
}

const jsonLdTypes = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap((match) => {
      const parsed: unknown = JSON.parse(match[1].replace(/\\u003c/g, "<"));
      return Array.isArray(parsed) ? parsed : [parsed];
    })
    .flatMap((node) => {
      const type = (node as { "@type"?: string | string[] })["@type"];
      return Array.isArray(type) ? type : [type ?? ""];
    });

for (const { path, mustContain } of PAGES) {
  test(`${path} is readable without JavaScript`, async ({ request }) => {
    const html = await fetchAsCrawler(request, path);

    expect(html, "title").toMatch(/<title>[^<]+<\/title>/);
    expect(html, "meta description").toMatch(/<meta name="description" content="[^"]+"/);
    expect(html, "canonical").toMatch(/<link rel="canonical" href="[^"]+"/);

    for (const text of mustContain) {
      // Real content in the markup, not an empty shell waiting to hydrate.
      expect(html, `"${text}" missing from raw HTML`).toContain(text);
    }
  });
}

test("every page describes itself to a crawler in structured data", async ({ request }) => {
  const home = jsonLdTypes(await fetchAsCrawler(request, "/"));
  expect(home).toContain("Organization");
  expect(home).toContain("WebSite");
  expect(home).toContain("SoftwareApplication");

  const station = jsonLdTypes(await fetchAsCrawler(request, `/station/${TOKYO}`));
  expect(station).toContain("RadioBroadcastService");
  expect(station).toContain("BreadcrumbList");

  expect(jsonLdTypes(await fetchAsCrawler(request, "/faq"))).toContain("FAQPage");
  expect(jsonLdTypes(await fetchAsCrawler(request, "/tag/jazz"))).toContain("CollectionPage");
});

test("the machine-readable files are served", async ({ request }) => {
  const robots = await fetchAsCrawler(request, "/robots.txt");
  expect(robots).toContain("User-Agent: GPTBot");
  expect(robots).toContain("User-Agent: ClaudeBot");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);

  const llms = await fetchAsCrawler(request, "/llms.txt");
  expect(llms.startsWith("# OpenRadio")).toBe(true);
  expect(llms).toContain("/llms-full.txt");
  expect(await fetchAsCrawler(request, "/llms-full.txt")).toContain("MIT licensed");

  const sitemap = await fetchAsCrawler(request, "/sitemap.xml");
  expect(sitemap).toContain("<urlset");
  expect(sitemap).toContain("/station/");
});

test("pages we do not want indexed say so", async ({ request }) => {
  for (const path of ["/favorites", "/history"]) {
    const html = await fetchAsCrawler(request, path);
    expect(html, path).toMatch(/<meta name="robots" content="[^"]*noindex/);
  }
});

/*
 * Link previews. These tags are invisible in a browser and are the only thing a
 * chat app reads, so a page can look perfect and still share as something else
 * entirely. That is exactly what happened: og:title and og:url were inherited
 * from the root layout, so every page previewed as the home page.
 */
const SHAREABLE = [
  { path: "/", title: "OpenRadio: world radio, open source" },
  { path: "/faq", title: "Questions and answers" },
  { path: "/about", title: "About" },
  { path: "/country/jp", title: "Radio from Japan" },
  { path: "/tag/jazz", title: "Jazz radio" },
  { path: `/station/${TOKYO}`, title: "Tokyo Jazz Test FM" },
  { path: "/jazz-radio-in-japan", title: "Jazz radio in Japan" },
];

const meta = (html: string, key: string) =>
  html.match(new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`, "i"))?.[1];

for (const { path, title } of SHAREABLE) {
  test(`${path} previews as itself when shared`, async ({ request }) => {
    const html = await fetchAsCrawler(request, path);

    expect(meta(html, "og:title"), "og:title").toContain(title);
    expect(meta(html, "og:description"), "og:description").toBeTruthy();

    // og:url must be this page, not the home page.
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    expect(meta(html, "og:url"), "og:url should match the canonical").toBe(canonical);

    // The same link must not preview differently on X than on WhatsApp.
    expect(meta(html, "twitter:title"), "twitter:title").toBe(meta(html, "og:title"));
    expect(meta(html, "twitter:description")).toBe(meta(html, "og:description"));

    expect(meta(html, "og:image"), "og:image").toMatch(/^https?:\/\//);
  });
}
