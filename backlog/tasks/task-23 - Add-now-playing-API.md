---
id: TASK-23
title: Add now playing API
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:21'
labels:
  - now-playing
dependencies:
  - TASK-22
  - TASK-6
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GET /api/now-playing/[id] reads ICY metadata from the station stream with bounded bytes and timeout, SSRF guarded, rate limited.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Never accepts raw URLs from the client
- [x] #2 ICY parser unit tested
- [x] #3 Returns title null when metadata is unavailable
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GET /api/now-playing/[id] reads the first ICY metadata block from the directory's stream URL through safeFetch (bounded bytes, 6s timeout, 20s cache), rate limited 30/min per client, HLS skipped, never errors to the client. ICY parser and reader unit tested; verified live (real titles from several stations).
<!-- SECTION:FINAL_SUMMARY:END -->
