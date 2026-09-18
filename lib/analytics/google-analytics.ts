/*
 * Google Analytics 4, behind consent.
 *
 * Two constraints shape this. The CSP locks scripts to this origin plus a
 * per-request nonce under strict-dynamic, so allowlisting googletagmanager.com
 * would do nothing: the tag has to carry the nonce instead, and strict-dynamic
 * then lets gtag.js load what it needs. And GA4 sets cookies and collects
 * IP-derived data, so under GDPR and the ePrivacy rules it may not fire in the
 * EU or UK until the visitor says yes. Consent mode v2 handles that by starting
 * denied and only storing anything once consent is granted.
 *
 * Disabled entirely unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 */

/** GA4 measurement ids look like G-XXXXXXXXXX. */
const MEASUREMENT_ID = /^G-[A-Z0-9]{6,20}$/;

export function gaMeasurementId(raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID): string | null {
  const value = raw?.trim().toUpperCase();
  return value && MEASUREMENT_ID.test(value) ? value : null;
}

/** Where the visitor's answer is kept. Their choice, on their device only. */
export const CONSENT_STORAGE_KEY = "openradio:analytics-consent";
export type ConsentChoice = "granted" | "denied";

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "granted" || value === "denied";
}

/**
 * The bootstrap that runs before gtag.js loads. Everything starts denied, so
 * nothing is stored until the visitor chooses, wherever they are. Waiting for
 * an explicit answer is the honest reading of consent, and it keeps one code
 * path rather than guessing at someone's jurisdiction from their IP.
 */
export function consentBootstrap(measurementId: string, stored: ConsentChoice | null): string {
  const granted = stored === "granted";
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
${granted ? "gtag('consent', 'update', { analytics_storage: 'granted' });" : ""}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });
`.trim();
}
