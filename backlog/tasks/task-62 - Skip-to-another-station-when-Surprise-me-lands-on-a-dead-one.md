---
id: TASK-62
title: Skip to another station when Surprise me lands on a dead one
status: To Do
assignee: []
created_date: '2026-09-18 09:05'
labels:
  - bug
  - ux
dependencies: []
priority: high
ordinal: 62000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Surprise me picks a random station and hands it to the player. When that stream does not respond the user is left on a 'station is not responding' error and has to press Surprise again. Radio Browser listings go stale constantly, so this is common: it happened while filming the promo video. Detect the failure and move straight to another candidate instead of showing a dead end. Fetch a small pool of candidates rather than one, advance through them on a stream error or timeout, and only show the error once the pool is exhausted. The same retry should cover the home page's first autoplay station.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A dead Surprise result advances to the next candidate automatically
- [ ] #2 The user sees a brief 'finding another station' state, not an error
- [ ] #3 Gives up with a clear message only after a bounded number of tries
- [ ] #4 Failure path covered by a test with a stream that never responds
<!-- AC:END -->
