/**
 * Content Security Policy for OpenRadio pages.
 *
 * Station streams, HLS segments and artwork live on arbitrary third-party
 * hosts, so media, connect and image sources must allow any http(s) origin.
 *
 * Scripts were locked to this origin plus a per-request nonce, which is the
 * stronger policy and was the right default. It was given up for a mechanical
 * reason: a nonce has to be minted per request and injected while rendering,
 * so Next cannot apply one to a page it prerendered. Keeping it meant every
 * page in the app rendered on demand, forever, which is what exhausted the
 * hosting quota. Cacheable pages are worth more here than this particular
 * defence, because there are no accounts and no sessions: everything the site
 * knows is already public.
 *
 * What still stands against injection is that React escapes everything it
 * renders, and the two places that bypass that are both ours rather than a
 * visitor's: a constant consent snippet, and JSON-LD built with
 * JSON.stringify and its angle brackets escaped. Those are the two places to
 * be careful in now.
 */
export function buildCsp({ dev = false } = {}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-inline' is what the nonce used to cover. Next streams a page by
    // pushing inline script chunks whose contents differ per page, so they can
    // neither be hashed ahead of time nor allowed any other way.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      // Named explicitly now. Under strict-dynamic the nonce was what let
      // gtag.js load its own scripts, and a host allowlist was ignored.
      "https://www.googletagmanager.com",
      ...(dev ? ["'unsafe-eval'"] : []),
    ],
    // React style attributes (station hues, photo placeholders) need inline styles.
    "style-src": ["'self'", "'unsafe-inline'"],
    // No http: here. One station logo served insecurely puts a warning on the
    // whole site, so an address we could not upgrade is blocked and the station
    // falls back to its generated artwork.
    "img-src": ["'self'", "data:", "blob:", "https:"],
    // http: stays, deliberately. The player tries https for every station and
    // falls back to the address the directory gave, and a minority of stations
    // answer only on http. Blocking those to tidy a console warning would break
    // playback outright, which is the worse trade.
    "media-src": ["'self'", "blob:", "https:", "http:"],
    "connect-src": ["'self'", "https:", "http:", ...(dev ? ["ws:"] : [])],
    "font-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

export const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
