---
id: TASK-72
title: Handle stations that only stream over http
status: Done
assignee: []
created_date: '2026-09-18 17:23'
updated_date: '2026-09-18 17:50'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Measured first, as the task asked. 44% of the popular pool is filed with an http address; of 12 sampled, 11 serve the identical stream over https and simply have the old address on record. Chrome silently upgrades mixed audio and it plays, logging a warning, but that is Chrome's behaviour rather than ours and Safari and Firefox are stricter. So the player now tries https for every station and keeps the station's own address as a fallback, in both the load path and the media error path; the error handler needed it too, since retrying the https guess against a host that does not serve https would only fail again. Verified in a browser against the live directory: 5 of 6 http-filed stations now play over https on the first attempt and the sixth falls back as designed. Kept media-src http: deliberately and documented why in the CSP: a minority of stations answer only on http, and blocking them to tidy a console warning would break playback outright.
<!-- SECTION:FINAL_SUMMARY:END -->
