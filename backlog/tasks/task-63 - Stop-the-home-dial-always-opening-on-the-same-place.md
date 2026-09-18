---
id: TASK-63
title: Stop the home dial always opening on the same place
status: Done
assignee: []
created_date: '2026-09-18 12:37'
updated_date: '2026-09-18 12:41'
labels:
  - ux
dependencies: []
priority: high
ordinal: 63000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
PLACES in lib/imagery/catalog.ts is a fixed 16-item array, so the dial opens on Japan/Tokyo and steps to Bangladesh/Dhaka in that order every single visit. The set is curated because each place carries licensed photography, so the fix is not to add places but to vary the way in: rotate or randomise the starting position so a returning visitor lands somewhere new. Server rendered, so the choice must be made in a way that does not break hydration or get cached into one answer for everyone.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The dial does not open on the same place every visit
- [ ] #2 All 16 curated places remain reachable, none becomes unreachable
- [ ] #3 No hydration mismatch and no stale cached pick shared by all visitors
- [ ] #4 Order is stable within a single page view, so the dial does not reshuffle under the user
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The dial opened on Tokyo then Dhaka every visit because PLACES is a fixed list and HeroTuner starts at index 0. Rotated the list by the same ten minute window the home page caches on, with a stride of 7 that is coprime with the 16 places: each cached render opens somewhere new, everyone reading that render sees the same thing so there is no hydration mismatch, and all 16 come up before any repeats. Random would have been wrong twice over: frozen into one answer for everyone by the cache, and mismatched against the server HTML if done on the client. Verified the real sequence across 12 windows: Tokyo, Cairo, Jakarta, Mumbai, Berlin, Paris, Mexico, Dhaka, Marrakech, Havana, New York, Istanbul. Also fixed the dial e2e test, which asserted the second city was Dhaka and would now have passed only during one window in sixteen.
<!-- SECTION:FINAL_SUMMARY:END -->
