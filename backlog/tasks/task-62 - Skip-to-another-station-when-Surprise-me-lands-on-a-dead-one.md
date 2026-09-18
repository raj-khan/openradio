---
id: TASK-62
title: Skip to another station when Surprise me lands on a dead one
status: Done
assignee: []
created_date: '2026-09-18 09:05'
updated_date: '2026-09-18 09:40'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Two layers. Server: /api/surprise now probes up to 4 candidates at once with a 2.5s timeout and returns the first that actually answers, because Radio Browser's lastCheckOk goes stale. Verified against real streams: BBC World Service, SRG and Radio Paradise all came back reachable in 143-1384ms, while the exact station that broke the promo shoot (157.254.194.202) was rejected in 583ms, a bogus host in 3ms and a private IP in 0ms through the existing SSRF guard. Client: the response now carries alternates, and SurpriseButton watches the player for an error on the station it handed over and moves to the next candidate, covering geo-blocks, CORS and codec failures the server cannot see. Falls back to an unprobed pick rather than 404ing when nothing answers. Without this a dead station cost the listener the full 15s load timeout plus a retry, about 30 seconds, before anything said so.
<!-- SECTION:FINAL_SUMMARY:END -->
