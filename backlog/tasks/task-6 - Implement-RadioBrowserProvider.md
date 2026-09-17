---
id: TASK-6
title: Implement RadioBrowserProvider
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:49'
labels:
  - stations
dependencies:
  - TASK-4
  - TASK-5
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
StationProvider implementation on top of the client and normalizer: search with query mapping, getById, countries, languages, tags, reportClick.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Search always hides broken stations
- [x] #2 Order options map to Radio Browser parameters
- [x] #3 Facets are normalized and sorted by station count
- [x] #4 Unit tests for query mapping
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
RadioBrowserProvider implements search, getById, countries, languages, tags and reportClick with caching per data type; getStationProvider singleton.
<!-- SECTION:FINAL_SUMMARY:END -->
