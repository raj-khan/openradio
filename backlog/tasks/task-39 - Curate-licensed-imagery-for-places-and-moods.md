---
id: TASK-39
title: Curate licensed imagery for places and moods
status: Done
assignee: []
created_date: '2026-09-17 16:24'
updated_date: '2026-09-17 16:34'
labels:
  - design
dependencies:
  - TASK-38
priority: high
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Select Unsplash License photos for featured places and moods, download and optimize to WebP in public/images, record credits in lib/imagery/credits.ts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No Unsplash+ photos
- [x] #2 Each image under 200 KB
- [x] #3 Credits include photographer and source URL
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
30 Unsplash License photos (16 places, 13 moods, 1 hero), free tier only, stored as WebP under 200 KB in public/images, catalog with alt text, placeholder color, credits and mood tag mapping; unit tested.
<!-- SECTION:FINAL_SUMMARY:END -->
