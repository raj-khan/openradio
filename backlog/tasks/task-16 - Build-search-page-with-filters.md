---
id: TASK-16
title: Build search page with filters
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:18'
labels:
  - ui
dependencies:
  - TASK-7
  - TASK-9
  - TASK-15
priority: high
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
/search page with text, country, language and tag filters synced to the URL, pagination via load more.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Filters persist in the URL and survive reload
- [x] #2 Empty and error states shown
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Server-rendered /search with URL-synced filters (text, country, language, tag datalist, sort), load more via API, invalid/empty/error states. Verified in Chrome including typing during a pending navigation.
<!-- SECTION:FINAL_SUMMARY:END -->
