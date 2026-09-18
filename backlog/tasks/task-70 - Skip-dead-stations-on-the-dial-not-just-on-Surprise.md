---
id: TASK-70
title: 'Skip dead stations on the dial, not just on Surprise'
status: Done
assignee: []
created_date: '2026-09-18 13:27'
updated_date: '2026-09-18 14:00'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The dial took its pick straight from the station search and handed it to the player unchecked, so a dead stream cost the listener the full load timeout with nothing to fall back on. That is what happened in Dhaka: the one voice station the filter found was Jago FM, it was off the air, and there was no second choice. The dial now goes through /api/surprise with a country parameter, so it gets the same reachability probe and the same alternates list Surprise already had, and the shared recovery logic moved into lib/player/use-tuner.ts rather than being written twice. Added relaxMode to surpriseCandidates to mark the real difference between the two callers: drawing from the whole world there is always somewhere else, so falling back to any station beats refusing, but pinned to one country there is not, and quietly playing music after someone asked for voices hides the gap from them.
<!-- SECTION:FINAL_SUMMARY:END -->
