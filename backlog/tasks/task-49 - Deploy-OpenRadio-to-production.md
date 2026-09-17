---
id: TASK-49
title: Deploy OpenRadio to production
status: To Do
assignee: []
created_date: '2026-09-17 18:29'
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
- [ ] #1 Live on https://openradio.space
- [ ] #2 Environment variables set, no secrets committed
- [ ] #3 Production smoke test of playback, search, discovery and offline
<!-- AC:END -->
