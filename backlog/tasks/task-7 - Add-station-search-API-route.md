---
id: TASK-7
title: Add station search API route
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:51'
labels:
  - api
dependencies:
  - TASK-6
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GET /api/stations validates query params with Zod and returns normalized stations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Invalid params return 400 with a friendly message
- [x] #2 Provider failures return 502 with a friendly message
- [x] #3 Responses have sensible cache headers
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GET /api/stations validates params with Zod, returns friendly 400/502 errors and CDN cache headers. Verified live against Radio Browser.
<!-- SECTION:FINAL_SUMMARY:END -->
