import Script from "next/script";
import { consentBootstrap, gaMeasurementId } from "@/lib/analytics/google-analytics";

/**
 * Loads gtag.js. The CSP allows it by host: there is no nonce to read any
 * more, because reading a request header here would opt every page in the app
 * back into rendering on demand. See lib/security/csp.ts.
 *
 * The consent defaults go in a plain inline script rather than next/script:
 * they must execute before gtag.js, and a raw tag in document order is the only
 * way to be certain of that. `beforeInteractive` is not supported outside the
 * pages router, and the ordering is the whole point here, because anything that
 * ran after gtag.js would be setting consent too late.
 */
export function GoogleAnalytics() {
  const measurementId = gaMeasurementId();
  if (!measurementId) return null;

  return (
    <>
      <script
        // Our own generated code from a validated id, never visitor input.
        dangerouslySetInnerHTML={{ __html: consentBootstrap(measurementId, null) }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
