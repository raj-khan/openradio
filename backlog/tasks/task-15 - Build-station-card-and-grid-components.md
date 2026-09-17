---
id: TASK-15
title: Build station card and grid components
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:11'
labels:
  - ui
dependencies:
  - TASK-10
  - TASK-11
priority: high
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Station card with artwork fallback, name, country flag, tags, codec and bitrate, play button, favorite slot.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Broken favicons fall back to a generated placeholder
- [x] #2 Play button reflects current playback state
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
StationCard (artwork, flag, short country name, codec/bitrate, tag links, actions slot), PlayButton bound to the global player, StationGrid with empty state and skeleton. Verified in Chrome at 390px and 1280px; clicking play starts the station and updates Media Session metadata.
<!-- SECTION:FINAL_SUMMARY:END -->
