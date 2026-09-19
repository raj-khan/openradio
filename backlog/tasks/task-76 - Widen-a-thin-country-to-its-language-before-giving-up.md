---
id: TASK-76
title: Widen a thin country to its language before giving up
status: To Do
assignee: []
created_date: '2026-09-19 03:08'
labels: []
dependencies: []
ordinal: 76000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Pinned to one country the app refuses rather than silently handing over music, which is right, but in Bangladesh it means 'voices' almost always refuses. Before refusing, offer speech stations in the country's own languages from anywhere: Bengali voices from West Bengal or the diaspora are closer to what was asked for than nothing. Say plainly that the station is from elsewhere.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A thin country falls back to its languages before returning 404
- [ ] #2 The response marks the station as from outside the chosen country
- [ ] #3 The UI says where it went instead of the country asked for
- [ ] #4 A country with enough stations of its own is unaffected
<!-- AC:END -->
