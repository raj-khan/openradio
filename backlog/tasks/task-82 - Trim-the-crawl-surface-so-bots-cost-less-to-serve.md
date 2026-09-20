---
id: TASK-82
title: Trim the crawl surface so bots cost less to serve
status: In Progress
assignee: []
created_date: '2026-09-20 14:16'
updated_date: '2026-09-20 14:18'
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
- [ ] #1 The station sitemap cap is well below 2000
- [ ] #2 Station entries ask for a monthly recrawl rather than weekly
- [ ] #3 The ranked selection still keeps the most wanted stations first
- [ ] #4 Unit tests, lint, typecheck, format and build all pass
<!-- AC:END -->
