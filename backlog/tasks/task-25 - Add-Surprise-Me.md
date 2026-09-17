---
id: TASK-25
title: Add Surprise Me
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:29'
labels:
  - discovery
dependencies:
  - TASK-6
  - TASK-12
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GET /api/surprise returns a random healthy station, Surprise Me button starts playback and links to the station.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Filters out low bitrate and unknown country stations
- [x] #2 Friendly error if nothing found
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GET /api/surprise picks a healthy station (known country, bitrate >= 64, preferably another country) from a random page of popular stations since Radio Browser caches random order; Surprise me in hero and header plays it and shows where you landed. Unit tested, verified live.
<!-- SECTION:FINAL_SUMMARY:END -->
