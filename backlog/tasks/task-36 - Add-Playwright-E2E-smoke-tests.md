---
id: TASK-36
title: Add Playwright E2E smoke tests
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 18:22'
labels:
  - testing
dependencies:
  - TASK-20
  - TASK-16
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
E2E tests with mocked station API: home loads, search filters, station page, play toggles state, favorite persists after reload.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Runs locally via npm run test:e2e
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Playwright suite (8 specs, desktop plus mobile project) against a mock Radio Browser and silent audio stream started by Playwright: home, keyboard dial, URL-synced search, station page, play/pause/close, favorites persistence, discovery, 404. Added to CI.
<!-- SECTION:FINAL_SUMMARY:END -->
