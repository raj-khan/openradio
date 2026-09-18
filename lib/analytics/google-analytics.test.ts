import { describe, expect, it } from "vitest";
import {
  consentBootstrap,
  gaMeasurementId,
  isConsentChoice,
} from "@/lib/analytics/google-analytics";

describe("gaMeasurementId", () => {
  it("is disabled unless configured", () => {
    expect(gaMeasurementId(undefined)).toBeNull();
    expect(gaMeasurementId("  ")).toBeNull();
  });

  it("accepts a real measurement id", () => {
    expect(gaMeasurementId("G-17NXJ0LPEC")).toBe("G-17NXJ0LPEC");
    expect(gaMeasurementId(" g-17nxj0lpec ")).toBe("G-17NXJ0LPEC");
  });

  it("rejects anything that is not one", () => {
    // A stray value should disable analytics, not inject itself into a script.
    for (const bad of ["UA-12345-1", "G-", "GTM-ABCDEF", "not an id", "G-abc';alert(1)//"]) {
      expect(gaMeasurementId(bad), bad).toBeNull();
    }
  });
});

describe("consentBootstrap", () => {
  const id = "G-17NXJ0LPEC";

  it("denies every storage type before gtag.js loads", () => {
    const code = consentBootstrap(id, null);
    for (const key of ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"]) {
      expect(code, key).toMatch(new RegExp(`${key}: 'denied'`));
    }
    expect(code).toContain("'consent', 'default'");
  });

  it("sets the default before configuring the tag, so nothing slips through", () => {
    const code = consentBootstrap(id, null);
    expect(code.indexOf("'consent', 'default'")).toBeLessThan(code.indexOf("'config'"));
  });

  it("does not grant anything when no answer is stored", () => {
    expect(consentBootstrap(id, null)).not.toContain("'granted'");
    expect(consentBootstrap(id, "denied")).not.toContain("'granted'");
  });

  it("restores a previous yes without asking again", () => {
    const code = consentBootstrap(id, "granted");
    expect(code).toContain("'consent', 'update'");
    expect(code).toContain("analytics_storage: 'granted'");
    // Still only analytics: agreeing to a visit count is not agreeing to ads.
    expect(code).not.toMatch(/ad_storage: 'granted'/);
  });

  it("carries the configured id and anonymises the address", () => {
    expect(consentBootstrap(id, null)).toContain(`'config', '${id}'`);
    expect(consentBootstrap(id, null)).toContain("anonymize_ip: true");
  });
});

describe("isConsentChoice", () => {
  it("accepts only the two real answers", () => {
    expect(isConsentChoice("granted")).toBe(true);
    expect(isConsentChoice("denied")).toBe(true);
    expect(isConsentChoice("maybe")).toBe(false);
    expect(isConsentChoice(null)).toBe(false);
  });
});
