import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS, buildCsp } from "@/lib/security/csp";

const directive = (csp: string, name: string) =>
  csp
    .split("; ")
    .find((d) => d.startsWith(`${name} `))
    ?.split(" ")
    .slice(1);

describe("buildCsp", () => {
  const csp = buildCsp();

  it("carries no nonce, so the policy can be a static header", () => {
    // A nonce has to be minted per request and injected while rendering, which
    // would mean no page in the app could ever be prerendered or cached.
    expect(csp).not.toContain("nonce-");
    expect(csp).not.toContain("strict-dynamic");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("allows inline scripts, which is what the nonce used to cover", () => {
    expect(directive(csp, "script-src")).toContain("'unsafe-inline'");
  });

  it("names the analytics host, now that strict-dynamic is not there to allow it", () => {
    expect(directive(csp, "script-src")).toContain("https://www.googletagmanager.com");
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
    const dev = buildCsp({ dev: true });
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
