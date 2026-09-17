---
id: TASK-3
title: Define station domain types and schemas
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:45'
labels:
  - stations
dependencies:
  - TASK-1
priority: high
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Station, StationQuery, Facet types and Zod schemas plus the StationProvider interface (docs/architecture.md section 6).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Types inferred from Zod schemas where they validate input
- [x] #2 StationQuery schema validates limits, order and offsets
- [x] #3 Unit tests cover valid and invalid queries
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Zod StationQuery schema, station id schema, Station/Facet types and StationProvider interface with unit tests.
<!-- SECTION:FINAL_SUMMARY:END -->
