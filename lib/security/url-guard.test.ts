import type { LookupAddress } from "node:dns";
import { describe, expect, it } from "vitest";
import { UnsafeUrlError, createSafeLookup, parseExternalUrl } from "@/lib/security/url-guard";

describe("parseExternalUrl", () => {
  it("accepts public http(s) URLs", () => {
    expect(parseExternalUrl("https://stream.example.com:8443/live").host).toBe(
      "stream.example.com:8443",
    );
    expect(parseExternalUrl("http://8.8.8.8/stream").hostname).toBe("8.8.8.8");
  });

  it.each([
    "ftp://example.com/a",
    "file:///etc/passwd",
    "javascript:alert(1)",
    "https://user:pass@example.com/",
    "http://localhost:8000/",
    "http://radio.localhost/",
    "http://printer.local/",
    "http://intranet/",
    "http://127.0.0.1/",
    "http://2130706433/",
    "http://0x7f.0.0.1/",
    "http://[::1]/",
    "http://[::ffff:127.0.0.1]/",
    "http://169.254.169.254/latest/meta-data",
    "not a url",
  ])("rejects %s", (raw) => {
    expect(() => parseExternalUrl(raw)).toThrow(UnsafeUrlError);
  });
});

describe("createSafeLookup", () => {
  const run = (addresses: LookupAddress[], options: object = {}) =>
    new Promise<{ err: Error | null; address: unknown }>((resolve) => {
      const lookup = createSafeLookup((_host, _opts, cb) => cb(null, addresses));
      lookup("stream.example.com", options as never, (err, address) => resolve({ err, address }));
    });

  it("returns a public address", async () => {
    const result = await run([{ address: "93.184.216.34", family: 4 }]);
    expect(result).toEqual({ err: null, address: "93.184.216.34" });
  });

  it("refuses when any resolved address is private (rebinding style)", async () => {
    const result = await run([
      { address: "93.184.216.34", family: 4 },
      { address: "10.0.0.5", family: 4 },
    ]);
    expect(result.err).toBeInstanceOf(UnsafeUrlError);
  });

  it("refuses loopback and metadata addresses", async () => {
    expect((await run([{ address: "127.0.0.1", family: 4 }])).err).toBeInstanceOf(UnsafeUrlError);
    expect((await run([{ address: "::ffff:169.254.169.254", family: 6 }])).err).toBeInstanceOf(
      UnsafeUrlError,
    );
  });

  it("honours the requested family and all option", async () => {
    const addresses = [
      { address: "93.184.216.34", family: 4 },
      { address: "2606:2800:220:1:248:1893:25c8:1946", family: 6 },
    ];
    expect((await run(addresses, { family: 6 })).address).toBe(
      "2606:2800:220:1:248:1893:25c8:1946",
    );
    expect((await run(addresses, { all: true })).address).toEqual(addresses);
  });

  it("passes through DNS errors", async () => {
    const lookup = createSafeLookup((_h, _o, cb) =>
      cb(Object.assign(new Error("ENOTFOUND"), { code: "ENOTFOUND" }), []),
    );
    const err = await new Promise<Error | null>((resolve) =>
      lookup("nope.example", {}, (e) => resolve(e)),
    );
    expect(err?.message).toBe("ENOTFOUND");
  });
});
