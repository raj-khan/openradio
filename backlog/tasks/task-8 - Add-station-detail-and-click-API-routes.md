---
id: TASK-8
title: Add station detail and click API routes
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:53'
labels:
  - api
dependencies:
  - TASK-6
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GET /api/stations/[id] and POST /api/stations/[id]/click.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Unknown or invalid id returns 404
- [x] #2 Click endpoint never blocks playback and swallows provider errors
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GET /api/stations/[id] with 404 for invalid or unknown ids; POST click reports to Radio Browser via after() so it never blocks and swallows errors.
<!-- SECTION:FINAL_SUMMARY:END -->
