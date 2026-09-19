---
id: TASK-74
title: Collapse stations that share a stream URL
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 03:12'
labels: []
dependencies: []
ordinal: 74000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Two entries pointing at the same audio waste a listener's attempt twice. Measured: Jago FM and Spice FM are each filed twice in Bangladesh with an identical stream URL, and Jago FM's is dead, so 'voices in Dhaka' burns both its tries on the same silence. Globally 50 of 480 popular entries (10%) are an exact duplicate of another entry's stream. Dedupe on the normalized stream URL when a list is built, keeping the better documented entry (tags, bitrate, votes), so alternates are genuinely different stations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Stations sharing a normalized stream URL collapse to one entry
- [ ] #2 The kept entry is the one with the most tags, then bitrate, then votes
- [ ] #3 Surprise alternates contain no two stations with the same stream
- [ ] #4 Measured before/after duplicate rate is recorded in the task
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Measured against the live directory: Bangladesh 26 raw entries -> 24 (8% shared a stream), popular top 500 -> 482 (4%), popular offset 2000 -> 494 (1%). Both Jago FM rows and both Spice FM rows collapse, so asking for voices in Dhaka no longer spends two attempts on the same dead stream.
<!-- SECTION:NOTES:END -->
