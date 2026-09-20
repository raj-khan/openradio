---
id: TASK-82
title: Trim the crawl surface so bots cost less to serve
status: Done
assignee: []
created_date: '2026-09-20 14:16'
updated_date: '2026-09-20 14:20'
labels: []
dependencies: []
ordinal: 82000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Station pages cannot be CDN cached while the CSP nonce forces per-request rendering, so every crawler visit to a station page is a full render. The sitemap advertises 1615 of them and names every AI crawler as welcome, which multiplies that by the number of bots making a pass. The selection is already ranked by clicks and votes, so a smaller cap keeps the stations people actually search for and drops the long tail that was earning little. Asking for a monthly rather than weekly recrawl slows the revisit rate on pages that rarely change.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The station sitemap cap is well below 2000
- [x] #2 Station entries ask for a monthly recrawl rather than weekly
- [x] #3 The ranked selection still keeps the most wanted stations first
- [x] #4 Unit tests, lint, typecheck, format and build all pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Cap 2000 to 600 and station changeFrequency weekly to monthly. Deliberately sheds indexed long tail, which is the only lever available while the CSP nonce keeps station pages from being cached at all.

The bigger finding sits behind this one: connection() in the root layout makes every route dynamic, so the home page's existing revalidate = 600 has never done anything and no page in the app can be CDN cached. Removing that means dropping the per-request nonce and strict-dynamic for script-src 'self' 'unsafe-inline', because Next's App Router emits per-page inline flight scripts that cannot practically be hashed. Owner chose to keep the strict CSP for now, so ISR stays off the table and this task cuts load instead.
<!-- SECTION:NOTES:END -->
