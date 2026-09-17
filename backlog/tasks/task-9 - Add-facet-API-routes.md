---
id: TASK-9
title: Add facet API routes
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:54'
labels:
  - api
dependencies:
  - TASK-6
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GET /api/countries, /api/languages, /api/tags.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Cached for 24 hours
- [x] #2 Tags endpoint supports a limit
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Countries, languages and tags endpoints with 24h CDN caching and validated tag limit.
<!-- SECTION:FINAL_SUMMARY:END -->
