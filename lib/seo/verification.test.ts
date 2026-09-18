import { describe, expect, it } from "vitest";
import { verificationMetadata, verificationTokens } from "@/lib/seo/verification";

const env = (over: Record<string, string>) => over as unknown as NodeJS.ProcessEnv;

describe("verificationTokens", () => {
  it("is absent until configured", () => {
    expect(verificationTokens(env({}))).toEqual({});
    expect(verificationMetadata(env({}))).toBeUndefined();
  });

  it("reads each engine's token", () => {
    expect(
      verificationTokens(
        env({
          GOOGLE_SITE_VERIFICATION: "abcdefgh12345678",
          BING_SITE_VERIFICATION: "BING-TOKEN-0001",
        }),
      ),
    ).toEqual({ google: "abcdefgh12345678", bing: "BING-TOKEN-0001" });
  });

  it("drops a malformed token instead of emitting a broken tag", () => {
    // A broken meta tag fails verification silently, which is harder to notice
    // than no tag at all.
    for (const bad of ["short", "has spaces in it", '"><script>', "x".repeat(200)]) {
      expect(
        verificationTokens(env({ GOOGLE_SITE_VERIFICATION: bad })).google,
        bad,
      ).toBeUndefined();
    }
  });

  it("trims a pasted value", () => {
    expect(verificationTokens(env({ GOOGLE_SITE_VERIFICATION: "  token12345678  " })).google).toBe(
      "token12345678",
    );
  });
});

describe("verificationMetadata", () => {
  it("puts Bing where Next expects an arbitrary meta name", () => {
    expect(verificationMetadata(env({ BING_SITE_VERIFICATION: "BING-TOKEN-0001" }))).toEqual({
      other: { "msvalidate.01": "BING-TOKEN-0001" },
    });
  });

  it("carries several engines at once", () => {
    const meta = verificationMetadata(
      env({
        GOOGLE_SITE_VERIFICATION: "google-token-1",
        BING_SITE_VERIFICATION: "bing-token-1",
        YANDEX_SITE_VERIFICATION: "yandex-token-1",
      }),
    );
    expect(meta).toMatchObject({
      google: "google-token-1",
      yandex: "yandex-token-1",
      other: { "msvalidate.01": "bing-token-1" },
    });
  });
});
