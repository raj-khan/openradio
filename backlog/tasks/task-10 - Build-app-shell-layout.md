---
id: TASK-10
title: Build app shell layout
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 15:57'
labels:
  - ui
dependencies:
  - TASK-1
priority: high
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Root layout with header navigation, theme tokens as CSS variables, dark-first design, footer with Radio Browser attribution, space reserved for the persistent player.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Responsive at 360px and desktop widths
- [x] #2 Skip-to-content link
- [x] #3 Theme tokens defined as CSS custom properties
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Root layout with sticky header nav (icons on mobile, labels on desktop), footer with Radio Browser attribution, theme tokens as CSS variables mapped into Tailwind, skip link, reduced-motion defaults and player spacer.
<!-- SECTION:FINAL_SUMMARY:END -->
