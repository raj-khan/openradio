/*
 * Search engine ownership verification.
 *
 * DNS TXT is the better method and needs nothing from the app: it survives
 * redeploys, host changes and a wiped project, and it verifies the whole
 * domain rather than one page. Use it if you can. These meta tags exist for
 * when you cannot reach the DNS zone.
 *
 * The tokens are not secrets (they are served in the HTML of every page) but
 * they are still environment configuration, not source, so they live in the
 * environment and never in the repository.
 */

/** Tokens are alphanumeric with dashes and underscores; anything else is a mistake. */
const TOKEN = /^[A-Za-z0-9_-]{8,128}$/;

function token(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  return value && TOKEN.test(value) ? value : undefined;
}

export interface VerificationTokens {
  google?: string;
  bing?: string;
  yandex?: string;
}

/**
 * Reads the verification tokens from the environment. A malformed value is
 * dropped rather than emitted: a broken meta tag fails verification silently
 * and is harder to spot than a missing one.
 */
export function verificationTokens(env = process.env): VerificationTokens {
  const tokens: VerificationTokens = {
    google: token(env.GOOGLE_SITE_VERIFICATION),
    bing: token(env.BING_SITE_VERIFICATION),
    yandex: token(env.YANDEX_SITE_VERIFICATION),
  };
  return Object.fromEntries(Object.entries(tokens).filter(([, v]) => v)) as VerificationTokens;
}

/** Shaped for Next's `metadata.verification`. Undefined when nothing is set. */
export function verificationMetadata(env = process.env) {
  const { google, bing, yandex } = verificationTokens(env);
  if (!google && !bing && !yandex) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    // Bing has no dedicated field in Next's metadata, so it goes in `other`.
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}
