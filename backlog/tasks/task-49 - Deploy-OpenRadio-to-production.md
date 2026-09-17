---
id: TASK-49
title: Deploy OpenRadio to production
status: Done
assignee: []
created_date: '2026-09-17 18:29'
updated_date: '2026-09-18 03:20'
labels:
  - ops
dependencies:
  - TASK-43
priority: high
ordinal: 49000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deploy to a host (Vercel by default), connect openradio.space, set environment variables, verify headers, sitemap, robots, PWA install and playback on the live domain.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Live on https://openradio.space
- [x] #2 Environment variables set, no secrets committed
- [x] #3 Production smoke test of playback, search, discovery and offline
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Deployed on Vercel with openradio.space as the domain (www primary,
apex 308-redirects) and NEXT_PUBLIC_APP_URL set, so canonical, robots and
sitemap all emit https://www.openradio.space. Production smoke tested:
search/facet/station/click/surprise/discover APIs return 200 with data,
HLS and MP3 streams play (valid m3u8 playlist, real MPEG audio),
now-playing reads live ICY metadata, discovery falls back to rules with
no AI key, offline page, service worker, manifest and icons all serve,
and CSP/HSTS/X-Frame-Options/Referrer-Policy headers are present.
No secrets in git history. The visit counter (TASK-50) is inert until
NEXT_PUBLIC_GOATCOUNTER_URL is set in the Vercel project; the next
deploy picks up that code.
<!-- SECTION:FINAL_SUMMARY:END -->
