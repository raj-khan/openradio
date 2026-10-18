/*
 * Which crawlers that read the web for AI are worth serving.
 *
 * The earlier policy allowed all of them, on the grounds that OpenRadio is
 * free and open source, so there is nothing to protect by refusing. That
 * reasoning still holds for content. It ignored the serving cost. A station
 * page renders per request (the CSP nonce rules out caching it), the sitemap
 * offers 600 of them, and twenty-one named crawlers passing over that on their
 * own schedules is tens of thousands of renders a month, each one fanning out
 * to the upstream directory. That is what exhausted the hosting quota.
 *
 * So the split is now by what comes back. A crawler that answers someone's
 * question and cites the site sends a reader, which is the same bargain a
 * search engine offers. One that collects pages in bulk to train on sends
 * nothing, and is the bulk of the traffic. The first group is named and
 * allowed; the second is named and refused.
 */

/** Read a page to answer someone's question, and cite it back. */
export const ANSWER_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "DuckAssistBot",
] as const;

/*
 * Collect pages in bulk, with no referral traffic in return.
 *
 * These need naming rather than simply leaving out: the wildcard rule allows
 * everything it does not exclude, so an omitted crawler is still invited.
 *
 * Google-Extended and Applebot-Extended are the exceptions that cost nothing
 * either way. They fetch no pages at all, they only say whether what Googlebot
 * and Applebot already took may be trained on. Refusing them saves no requests
 * and is listed here for consistency with the rest.
 */
export const BLOCKED_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Amazonbot",
  "cohere-ai",
  "YouBot",
  "CCBot",
  "Bytespider",
  "Diffbot",
  "omgili",
  "meta-externalagent",
  "FacebookBot",
  "Google-Extended",
  "Applebot-Extended",
] as const;

/** Every crawler the policy names, allowed or refused. */
export const AI_CRAWLERS = [...ANSWER_CRAWLERS, ...BLOCKED_CRAWLERS];

/** Paths no crawler should spend its budget on. */
export const CRAWLER_DISALLOW = ["/api/"];
