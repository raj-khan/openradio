---
id: TASK-19
title: Build home page
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 16:45'
labels:
  - ui
dependencies:
  - TASK-40
priority: high
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Immersive home: full-bleed atmosphere hero with discover input, FrequencyDial to tune between featured places, mood shelf with photo tiles (including an explicit-tag Faith and Spirituality mood), popular stations as tuner tiles.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Loads with Radio Browser data server-side
- [x] #2 Degrades gracefully if the provider is down
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Immersive home: hero whose photo crossfades as you tune the FrequencyDial across 16 cities, Tune in plays a live station from that country, search field, mood and place shelves with live station counts, most played tuner grid, provider-down fallback. Verified in Chrome at 390px and 1440px.
<!-- SECTION:FINAL_SUMMARY:END -->
