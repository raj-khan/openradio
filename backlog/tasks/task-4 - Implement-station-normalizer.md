---
id: TASK-4
title: Implement station normalizer
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:46'
labels:
  - stations
dependencies:
  - TASK-3
priority: high
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Convert raw Radio Browser station JSON into the internal Station model. Trim, split, lowercase and dedupe tags and languages, prefer url_resolved, reject stations without a valid http(s) stream URL.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Handles missing and malformed fields without throwing
- [x] #2 Detects HLS streams
- [x] #3 Unit tests cover edge cases
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Normalizer converts raw Radio Browser stations and facets into internal models, rejecting unusable stations; unit tested.
<!-- SECTION:FINAL_SUMMARY:END -->
