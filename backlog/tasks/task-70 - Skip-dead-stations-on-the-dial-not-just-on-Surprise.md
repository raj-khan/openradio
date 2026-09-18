---
id: TASK-70
title: 'Skip dead stations on the dial, not just on Surprise'
status: To Do
assignee: []
created_date: '2026-09-18 13:27'
labels:
  - bug
  - ux
dependencies: []
priority: high
ordinal: 70000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The reachability probe from TASK-62 only runs in /api/surprise. The home dial's Tune in button picks from /api/stations and hands the station straight to the player, so a dead stream costs the listener the full load timeout plus a retry with no fallback. That is exactly what happened in Dhaka: the one voice station the filter found was Jago FM, it was off the air, and the dial had nothing to fall back to. Give the dial the same treatment: probe before handing over, and move to the next candidate when one fails in the browser.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 The dial does not hand over a station that is not answering
- [ ] #2 A stream that fails in the browser advances to the next candidate
- [ ] #3 Shares the probe and the skip logic with Surprise rather than duplicating them
- [ ] #4 Falls back gracefully when a country has very few stations
<!-- AC:END -->
