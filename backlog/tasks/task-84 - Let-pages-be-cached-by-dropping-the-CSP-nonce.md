---
id: TASK-84
title: Let pages be cached by dropping the CSP nonce
status: Done
assignee: []
created_date: '2026-10-19 09:30'
updated_date: '2026-10-19 09:46'
labels: []
dependencies: []
ordinal: 84000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Every route renders on demand because app/layout.tsx awaits connection(), which exists so proxy.ts can inject a per-request CSP nonce. Next cannot apply a nonce to a prerendered page, so the nonce and caching are mutually exclusive. The site has no accounts and no private data, so trade the nonce for cacheable pages.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 script-src no longer uses a nonce or strict-dynamic, and gtag.js is allowed by host instead
- [x] #2 The CSP is served from next.config.ts headers and proxy.ts is gone
- [x] #3 app/layout.tsx no longer calls connection(), and nothing else reads x-nonce
- [x] #4 The station, country, language, tag and combo pages declare a revalidate window
- [x] #5 npm run build reports the content pages as prerendered or ISR rather than Dynamic
- [x] #6 The served pages carry the CSP header and Google Analytics still loads
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Merged as #91.

script-src is now 'self' 'unsafe-inline' https://www.googletagmanager.com. The CSP comes from next.config.ts headers and proxy.ts is deleted, so there is no middleware in the build at all.

Two things the plan missed, both found by checking the real responses rather than the build table:

1. revalidate is inert on a dynamic segment with no generateStaticParams. All five now declare one returning an empty list: nothing prerendered at build, each page cached on first visit.
2. resolveMirrors() fetched with cache: no-store, and an uncached fetch opts its caller into dynamic rendering. Every page that loads a station calls it first, so it would have kept them all uncacheable on its own.

Result: / is Static at 10m, the five content routes are SSG with ISR, /about /faq /favorites /history /offline are Static, and only /search and /discover stay dynamic because they read searchParams. Verified x-nextjs-cache MISS then HIT behind s-maxage=600.

The effective window is 600s, not the 3600s the pages declare: the directory fetches ask for 600 and the shortest wins. Raising both is available if 10 minutes proves too fresh to matter.

Still unverified: which hosting meter actually tripped. Vercel bumped the Hobby limits by hand for a month, so there is runway to measure it with the Vercel plugin rather than keep inferring from the code.
<!-- SECTION:NOTES:END -->
