---
id: TASK-56
title: Fix orphan pages and internal linking
status: To Do
assignee: []
created_date: '2026-09-18 08:01'
labels:
  - seo
dependencies: []
ordinal: 56000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
/discover is in the sitemap and has no inbound link anywhere on the site, so it is reachable only by typing the URL. That is both a product gap (the feature is undiscoverable) and a crawl signal problem. Link it from the header or home page, then audit every route in the sitemap for at least one inbound internal link and fix whatever else is orphaned.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 /discover is reachable from the site's own navigation
- [ ] #2 Every indexable route in the sitemap has at least one inbound internal link
- [ ] #3 A test or script asserts no indexable route is orphaned
<!-- AC:END -->
