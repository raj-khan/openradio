---
id: TASK-46
title: Add structured data and canonical metadata
status: Done
assignee: []
created_date: '2026-09-17 18:29'
updated_date: '2026-09-17 18:58'
labels:
  - seo
dependencies:
  - TASK-43
ordinal: 46000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
JSON-LD for the site (WebSite with search action), station pages (RadioStation or BroadcastService) and breadcrumbs, plus canonical links and per page Open Graph images where useful.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Structured data validates without errors
- [x] #2 Every indexable page has a canonical URL
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
JSON-LD for the site (WebSite with SearchAction), stations (RadioBroadcastService with ListenAction), listing pages (CollectionPage with ItemList) and breadcrumbs, plus canonical URLs on every page and noindex on favorites, history and offline. Unit tested including script-tag escaping; verified in rendered HTML.
<!-- SECTION:FINAL_SUMMARY:END -->
