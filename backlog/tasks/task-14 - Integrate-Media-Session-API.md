---
id: TASK-14
title: Integrate Media Session API
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:08'
labels:
  - player
dependencies:
  - TASK-12
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set media session metadata and play, pause and stop handlers when a station plays.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Metadata updates when station or now playing changes
- [x] #2 Gracefully no-ops when unsupported
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
MediaSession component syncs metadata (station or now playing, artwork) and playback state, registers play/pause/stop handlers, no-ops when unsupported.
<!-- SECTION:FINAL_SUMMARY:END -->
