---
id: TASK-24
title: Show now playing in the player
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:24'
labels:
  - now-playing
dependencies:
  - TASK-23
  - TASK-13
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Poll the now-playing API every 30 seconds while a non-HLS station plays and show the title in the player and media session.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Polling stops when paused or station changes
- [x] #2 Missing metadata shows nothing
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Single NowPlayingPoller polls every 30s only while a non-HLS station plays, shared store feeds player bar, now playing view and Media Session; title cleared on station change. Verified live in Chrome.
<!-- SECTION:FINAL_SUMMARY:END -->
