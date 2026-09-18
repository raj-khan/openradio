import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS, buildCsp } from "@/lib/security/csp";

const directive = (csp: string, name: string) =>
  csp
    .split("; ")
    .find((d) => d.startsWith(`${name} `))
    ?.split(" ")
    .slice(1);

describe("buildCsp", () => {
  const csp = buildCsp("abc123");

  it("locks scripts to self and the nonce", () => {
    expect(directive(csp, "script-src")).toEqual(["'self'", "'nonce-abc123'", "'strict-dynamic'"]);
    expect(csp).not.toContain("unsafe-eval");
  });

  it("allows external station media and HLS segments", () => {
    expect(directive(csp, "media-src")).toEqual(
      expect.arrayContaining(["https:", "http:", "blob:"]),
    );
    expect(directive(csp, "connect-src")).toEqual(expect.arrayContaining(["https:"]));
  });

  it("refuses insecure images, which put a warning on the whole site", () => {
    // One station logo served over http made Chrome report the site as not
    // fully secure. Logos are upgraded to https when normalized; one that
    // cannot be is blocked here and falls back to the generated artwork.
    expect(directive(csp, "img-src")).toEqual(expect.arrayContaining(["https:", "data:", "blob:"]));
    expect(directive(csp, "img-src")).not.toContain("http:");
  });

  it("blocks plugins, framing and base tag hijacking", () => {
    expect(directive(csp, "object-src")).toEqual(["'none'"]);
    expect(directive(csp, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(csp, "base-uri")).toEqual(["'self'"]);
  });

  it("adds dev-only allowances", () => {
    const dev = buildCsp("x", { dev: true });
    expect(directive(dev, "script-src")).toContain("'unsafe-eval'");
    expect(directive(dev, "connect-src")).toContain("ws:");
  });
});

describe("SECURITY_HEADERS", () => {
  it("includes the essentials", () => {
    const keys = SECURITY_HEADERS.map((h) => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "Permissions-Policy",
      ]),
    );
  });
});
