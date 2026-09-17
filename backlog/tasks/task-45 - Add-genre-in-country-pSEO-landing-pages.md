---
id: TASK-45
title: Add genre in country pSEO landing pages
status: Done
assignee: []
created_date: '2026-09-17 18:29'
updated_date: '2026-09-17 18:52'
labels:
  - seo
dependencies:
  - TASK-43
priority: high
ordinal: 45000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Programmatic landing pages for well stocked genre and country pairs (for example /jazz-radio-in-japan) with real station lists, unique copy, internal links from country and tag pages, and sitemap inclusion. Skip thin pairs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Pages render real stations and unique titles and descriptions
- [x] #2 Only pairs with enough stations are generated and indexed
- [x] #3 Internal links connect country, genre and combo pages
- [x] #4 Unit tests for pair selection and slug parsing
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Genre in country landing pages at /<genre>-radio-in-<country> for 12 curated genres and every real country, with breadcrumbs, real station lists, related genre links from country pages, canonical URLs and noindex for thin pages. Shared canonical region index fixes deprecated country codes (DD, UK, FX) and alternate names (Myanmar). Unit tested and verified live.
<!-- SECTION:FINAL_SUMMARY:END -->
