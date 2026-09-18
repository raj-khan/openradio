import Script from "next/script";
import { headers } from "next/headers";
import { consentBootstrap, gaMeasurementId } from "@/lib/analytics/google-analytics";

/**
 * Loads gtag.js with the request's CSP nonce. Under strict-dynamic a host
 * allowlist is ignored, so the nonce is what actually lets this run, and what
 * then lets gtag.js load its own scripts.
 *
 * The consent defaults go in a plain inline script rather than next/script:
 * they must execute before gtag.js, and a raw tag in document order is the only
 * way to be certain of that. `beforeInteractive` is not supported outside the
 * pages router, and the ordering is the whole point here, because anything that
 * ran after gtag.js would be setting consent too late.
 */
export async function GoogleAnalytics() {
  const measurementId = gaMeasurementId();
  if (!measurementId) return null;

  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <script
        nonce={nonce}
        // Our own generated code from a validated id, never visitor input.
        dangerouslySetInnerHTML={{ __html: consentBootstrap(measurementId, null) }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
    </>
  );
}
