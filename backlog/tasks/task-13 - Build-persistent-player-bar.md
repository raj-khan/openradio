---
id: TASK-13
title: Build persistent player bar
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:06'
labels:
  - player
dependencies:
  - TASK-12
  - TASK-10
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Bottom player bar with artwork, station name, now playing slot, play/pause, volume, mute, error message with retry.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Keyboard operable with ARIA labels
- [x] #2 Status changes announced via a live region
- [x] #3 Hidden when idle
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed bottom player bar with artwork, flag, status or error, play/pause/retry, mute, volume and close; live region announcements; hidden when idle. Verified in headless Chrome: MP3 and HLS playback, pause/resume, survives client navigation, broken stream shows friendly error after one retry.
<!-- SECTION:FINAL_SUMMARY:END -->
