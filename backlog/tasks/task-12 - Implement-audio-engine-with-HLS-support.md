---
id: TASK-12
title: Implement audio engine with HLS support
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:02'
labels:
  - player
dependencies:
  - TASK-11
priority: high
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Client provider owning a single audio element mounted in the root layout. Lazy loads hls.js for HLS streams, maps media events to store states, retries once then surfaces a friendly error.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Playback survives client navigation
- [x] #2 HLS stations play in Chromium
- [x] #3 Never retries more than once automatically
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
AudioEngine client component owns one audio element in the root layout, lazy loads hls.js for HLS when native HLS is missing, maps media events to the state machine, retries once, 15s load timeout, reports clicks once per session. Real-browser playback verified together with the player bar in TASK-13.
<!-- SECTION:FINAL_SUMMARY:END -->
