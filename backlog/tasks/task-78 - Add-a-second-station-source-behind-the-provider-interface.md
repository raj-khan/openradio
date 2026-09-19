---
id: TASK-78
title: Add a second station source behind the provider interface
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 04:03'
labels: []
dependencies: []
ordinal: 78000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
getStationProvider already hides the directory behind one interface, so a second source is a matter of composing providers rather than rewriting callers. Add a seed provider reading a list held in the repo, merged with Radio Browser and deduped by stream URL, so stations the directory misses can be carried without waiting on it. Every seed entry must pass our own probe in CI: scraping found Radio Today's stream on zeno.fm, but it answers 401 to any third-party client, so an unverified list would ship stations that cannot play.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A seed provider reads stations from a file in the repo
- [ ] #2 Seed and Radio Browser results merge and dedupe by stream URL
- [ ] #3 A test fails if a seed entry is malformed
- [ ] #4 A CI job probes every seed stream and reports the dead ones
- [ ] #5 Seeded with whatever Bangladeshi stations actually verify
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Rejected on evidence. See backlog/decisions/decision-2. No verifiable source of the missing Dhaka streams exists: Wikidata carries no stream URLs, and of eight Dhaka broadcasters sniffed in a real browser, streams are token-signed and expire in 60 seconds (Shadhin, Bhumi), answer 401 to third-party clients (Radio Today via zeno.fm), or are unreachable from outside the country (Radio Dhoni). Zero of eight gave a static address that answered a probe. fmstream.org and contributing back to Radio Browser were put to the owner as licensing and outward-facing decisions rather than decided here; the owner chose to drop the task.
<!-- SECTION:NOTES:END -->
