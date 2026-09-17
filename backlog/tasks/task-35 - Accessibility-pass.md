---
id: TASK-35
title: Accessibility pass
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 18:14'
labels:
  - a11y
dependencies:
  - TASK-19
  - TASK-16
  - TASK-17
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Audit keyboard navigation, focus rings, ARIA labels, headings and contrast across pages and fix issues.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All interactive controls reachable by keyboard
- [x] #2 No critical axe violations on main pages
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
axe-core audit of 11 pages at 1280px and 390px plus player bar and now playing view; fixed nested interactive controls and keyboard access in the dial, heading order, a contrast failure and duplicate banner landmark. Re-audit reports zero violations; tab order and keyboard dial verified.
<!-- SECTION:FINAL_SUMMARY:END -->
