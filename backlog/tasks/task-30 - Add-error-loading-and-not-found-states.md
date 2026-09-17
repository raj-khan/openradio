---
id: TASK-30
title: 'Add error, loading and not found states'
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:52'
labels:
  - ux
dependencies:
  - TASK-10
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
App-level error.tsx, not-found.tsx, loading skeletons and friendly copy.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No raw error messages reach users
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Tuner themed not-found ('Off the dial', 404.0 MHz), app error boundary using Next 16 retry prop, standalone global error page, shared skeleton loading for search and discover; loading files kept off 404-capable dynamic routes so they keep real 404 status. Verified statuses and streamed fallback.
<!-- SECTION:FINAL_SUMMARY:END -->
