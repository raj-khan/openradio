/*
 * Crawlers that read the web to answer questions or to train models.
 *
 * We allow all of them. OpenRadio is free and open source, so there is no
 * content to protect and no ad revenue to lose by being quoted: an assistant
 * that can recommend the site is worth the same as a search engine that ranks
 * it. Naming them one by one matters because several default to "allowed only
 * if the site says so", and a bare wildcard rule leaves that unanswered.
 */

/** Read a page to answer someone's question, and usually cite it back. */
export const ANSWER_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "Applebot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
] as const;

/** Collect pages in bulk to train models. No referral traffic, wider reach. */
export const TRAINING_CRAWLERS = [
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "FacebookBot",
  "Bytespider",
  "Diffbot",
  "omgili",
] as const;

export const AI_CRAWLERS = [...ANSWER_CRAWLERS, ...TRAINING_CRAWLERS];

/** Paths no crawler should spend its budget on. */
export const CRAWLER_DISALLOW = ["/api/"];
