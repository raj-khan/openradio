import type { NextConfig } from "next";
import { SECURITY_HEADERS, buildCsp } from "./lib/security/csp";

/*
 * The CSP is a static header rather than something proxy.ts mints per request.
 * That is the whole point: a per-request nonce would force every page to render
 * on demand, because Next can only inject one while rendering. See lib/security/csp.ts.
 */
const CSP = {
  key: "Content-Security-Policy",
  value: buildCsp({ dev: process.env.NODE_ENV === "development" }),
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/(.*)", headers: [...SECURITY_HEADERS, CSP] },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
    ];
  },
};

export default nextConfig;
