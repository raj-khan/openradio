/**
 * Content Security Policy for OpenRadio pages.
 *
 * Station streams, HLS segments and artwork live on arbitrary third-party
 * hosts, so media, connect and image sources must allow any http(s) origin.
 * Scripts are locked to this origin plus a per-request nonce.
 */
export function buildCsp(nonce: string, { dev = false } = {}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
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
