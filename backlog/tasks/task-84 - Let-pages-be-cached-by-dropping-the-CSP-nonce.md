---
id: TASK-84
title: Let pages be cached by dropping the CSP nonce
status: To Do
assignee: []
created_date: '2026-10-19 09:30'
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
- [ ] #1 script-src no longer uses a nonce or strict-dynamic, and gtag.js is allowed by host instead
- [ ] #2 The CSP is served from next.config.ts headers and proxy.ts is gone
- [ ] #3 app/layout.tsx no longer calls connection(), and nothing else reads x-nonce
- [ ] #4 The station, country, language, tag and combo pages declare a revalidate window
- [ ] #5 npm run build reports the content pages as prerendered or ISR rather than Dynamic
- [ ] #6 The served pages carry the CSP header and Google Analytics still loads
<!-- AC:END -->
