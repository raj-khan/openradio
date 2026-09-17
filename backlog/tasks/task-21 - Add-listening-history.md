---
id: TASK-21
title: Add listening history
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:08'
labels:
  - library
dependencies:
  - TASK-12
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Record plays (last 50, deduped) when playback starts, /history page with clear action.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 History persists across reloads
- [x] #2 Store is unit tested
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
History store (last 50, deduped, newest first) recorded once per playback session, /history logbook with relative times, favorite and play controls, clear action. Unit tested and verified in Chrome including reload persistence.
<!-- SECTION:FINAL_SUMMARY:END -->
