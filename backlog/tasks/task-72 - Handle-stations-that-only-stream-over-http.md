---
id: TASK-72
title: Handle stations that only stream over http
status: To Do
assignee: []
created_date: '2026-09-18 17:23'
labels:
  - bug
  - player
dependencies: []
priority: high
ordinal: 72000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
37% of stations in the popular pool have a streamUrl over http. On an https page browsers block or silently upgrade mixed media, so these either fail or behave inconsistently, and media-src in the CSP currently permits http: to paper over it. This is probably a real share of the 'station is not responding' failures. Investigate what actually happens per browser, try the https variant of the same host first since many Icecast servers serve both, and decide honestly what to do with the ones that only ever answer on http: play them, hide them, or mark them. Measure before choosing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Measure how many http-only stations actually play today, and in which browsers
- [ ] #2 Try https on the same host before giving up on a station
- [ ] #3 A station that can never play is not offered as though it can
- [ ] #4 media-src http: is removed or its remaining need is documented
<!-- AC:END -->
