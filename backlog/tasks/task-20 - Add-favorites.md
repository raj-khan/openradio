---
id: TASK-20
title: Add favorites
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:04'
labels:
  - library
dependencies:
  - TASK-15
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Favorites store persisted to localStorage (max 500), heart toggle on cards and detail page, /favorites page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Favorites persist across reloads
- [x] #2 Store is unit tested
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Favorites store (max 500, newest first) persisted to localStorage with post-mount hydration, heart toggle on tiles, player bar, now playing view and station page, /favorites page with skeleton and empty state. Unit tested and verified in Chrome including reload persistence.
<!-- SECTION:FINAL_SUMMARY:END -->
