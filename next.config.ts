import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "./lib/security/csp";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
