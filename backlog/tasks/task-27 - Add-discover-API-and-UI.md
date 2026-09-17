---
id: TASK-27
title: Add discover API and UI
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:37'
labels:
  - discovery
dependencies:
  - TASK-26
  - TASK-22
  - TASK-19
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
POST /api/discover returns intent and stations. Uses AI SDK generateObject when an AI key is configured, otherwise the deterministic parser. Discover input on the home page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Works with no AI key
- [x] #2 AI output validated with Zod and falls back on failure
- [x] #3 Rate limited
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
POST /api/discover and /discover page: rule parser always, AI SDK structured output via AI Gateway when configured (6s timeout, validated, faith tags blocked unless explicit), progressive relaxation when nothing matches, rate limited; discover input with examples replaces hero search. Verified live without AI; AI path unit tested with mocked model.
<!-- SECTION:FINAL_SUMMARY:END -->
