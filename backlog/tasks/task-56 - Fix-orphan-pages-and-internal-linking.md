---
id: TASK-56
title: Fix orphan pages and internal linking
status: Done
assignee: []
created_date: '2026-09-18 08:01'
updated_date: '2026-09-18 12:30'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The header labelled '/' as 'Discover' while the real /discover page had no link anywhere, so the feature was reachable only by typing the URL. Renamed the home item to 'Tuner' and added a real Discover entry, which fixes the orphan and the mislabel together. Moved the nav into lib/navigation.ts so the header, footer and tests read one list. Added a guard asserting every fixed route in the sitemap is linked from the site's own chrome; proved it by removing the new link, which fails with expected ['/discover'] to deeply equal []. Language pages are reached from station pages rather than chrome, so they are excluded as content-reached. Checked the extra item at 390px and 1280px: no overflow at either.
<!-- SECTION:FINAL_SUMMARY:END -->
