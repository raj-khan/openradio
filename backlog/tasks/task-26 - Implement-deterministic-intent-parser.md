---
id: TASK-26
title: Implement deterministic intent parser
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:32'
labels:
  - discovery
dependencies:
  - TASK-3
ordinal: 26000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Parse natural language into search filters using a curated dictionary of countries, demonyms, languages, genres and moods.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Unit tests cover multiple phrasings
- [x] #2 Never maps country or language to religion
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
parseIntent maps natural language to country (Intl region names plus aliases and demonyms), language, genre tag and mood (with fallback tag), leftover words become name search; faith tags only from explicit words. 24 unit tests.
<!-- SECTION:FINAL_SUMMARY:END -->
