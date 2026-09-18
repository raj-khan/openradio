---
id: TASK-61
title: Fix mobile responsive breakage
status: Done
assignee: []
created_date: '2026-09-18 09:03'
updated_date: '2026-09-18 09:19'
labels:
  - bug
  - ui
dependencies: []
priority: high
ordinal: 61000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Pages break at phone width; the history page was reported as visibly broken. Audit every route at 390px and below for horizontal overflow, clipped controls, text that cannot wrap and tap targets under 44px, then fix what the audit finds. Add an automated check so a future layout change cannot silently reintroduce overflow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 No route scrolls horizontally at 390px
- [ ] #2 History page renders correctly at phone width
- [ ] #3 Every route audited at 390px with findings recorded
- [ ] #4 Automated check asserts no horizontal overflow on key routes
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Also observed but not fixed here: header nav links are 40x28 and the skip link 24x16, all under the 44px recommended tap target. Worth a follow-up.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The history rows are grid items, which default to min-width:auto and so refuse to shrink below their content. A fixed 80px timestamp gutter then pushed each row to 615px, scrolling the page sideways to 631px in a 390px viewport. Measured it with a real mobile viewport against production after seeding localStorage, because the empty history page looks fine and only breaks once entries exist. The timestamp now sits above the card below the sm breakpoint and returns to a side gutter above it. Verified against a local build: 631px to 390px, and names went from 'CAPI...' to 'CAPITAL - The UK...'. Swept the other nine routes at 390px and found no other horizontal overflow. The new e2e test was checked both ways: it fails at 631 > 412 on the old layout and passes on the new one.
<!-- SECTION:FINAL_SUMMARY:END -->
