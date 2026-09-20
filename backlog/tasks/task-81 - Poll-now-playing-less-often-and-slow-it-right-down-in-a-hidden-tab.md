---
id: TASK-81
title: Poll now playing less often and slow it right down in a hidden tab
status: Done
assignee: []
created_date: '2026-09-20 14:14'
updated_date: '2026-09-20 14:20'
labels: []
dependencies: []
ordinal: 81000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Every listening visitor sends a now playing request every 30 seconds, so an hour of listening is 120 serverless invocations from one person. The CDN header on the route only helps when several people share a station, which is rare outside the popular few. Radio is mostly listened to with the tab in the background, where a title that is a couple of minutes stale is unnoticeable: the visible tab keeps a responsive cadence and a hidden one drops to a trickle, which keeps the lock screen roughly right without paying per minute for it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Visible tab polls once a minute rather than every 30 seconds
- [x] #2 Hidden tab polls at a much slower cadence
- [x] #3 Returning to a visible tab refreshes the title immediately rather than waiting out the interval
- [x] #4 Polling still stops entirely when playback stops or the station is HLS
- [x] #5 Unit tests, lint, typecheck, format and build all pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Visible tab polls at 60s, hidden at 180s, chosen fresh on each tick by a rescheduling timeout rather than a fixed setInterval, so a tab that is backgrounded mid-listen actually slows down. A visibilitychange listener polls immediately on return, so the slower hidden cadence never shows as a stale title to someone looking at the page. An hour of foreground listening goes from 120 requests to 60, an hour backgrounded from 120 to 20.

Found while investigating this: the API routes already carry CDN cache headers via cacheFor(), and the upstream Radio Browser calls are already cached through Next's data cache, so neither was the leak.
<!-- SECTION:NOTES:END -->
