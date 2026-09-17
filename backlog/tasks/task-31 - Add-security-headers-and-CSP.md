---
id: TASK-31
title: Add security headers and CSP
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:56'
labels:
  - security
dependencies:
  - TASK-13
priority: high
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Security headers and a Content Security Policy that still allows external station audio and artwork.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Playback and artwork work with CSP enabled
- [x] #2 Headers verified in a production build
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Nonce-based CSP set in proxy.ts (scripts self plus nonce and strict-dynamic; media, images, connect open to http(s) for stations), root layout awaits connection() so every page gets a nonce, HSTS, nosniff, frame DENY, referrer, permissions and COOP headers, x-powered-by removed. Verified in production build: headers present, HLS and MP3 playback, images load, zero CSP violations.
<!-- SECTION:FINAL_SUMMARY:END -->
