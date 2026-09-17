---
id: TASK-34
title: Add service worker offline support
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 18:09'
labels:
  - pwa
dependencies:
  - TASK-33
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Hand-written service worker: precache shell and offline page, stale-while-revalidate for station API GETs, network-first pages with offline fallback, never intercept audio. Offline notice in UI.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 App shell and favorites load offline
- [x] #2 Audio requests are not intercepted
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Hand-written service worker (production only): precached offline page and icons, cache-first static assets and images, stale-while-revalidate station metadata APIs, network-first pages with cached and offline fallbacks, never intercepts cross-origin, range or media requests; offline banner; /offline page; sw.js served no-cache. Verified offline in Chrome.
<!-- SECTION:FINAL_SUMMARY:END -->
