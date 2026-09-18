---
id: TASK-58
title: Add a crawler smoke test
status: Done
assignee: []
created_date: '2026-09-18 08:01'
updated_date: '2026-09-18 12:57'
labels:
  - seo
  - test
dependencies: []
ordinal: 58000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Most AI crawlers and some search crawlers do not run JavaScript, so a regression that moves content behind hydration would be invisible to us and fatal to indexing. Add a test that fetches the key routes with a crawler user agent and asserts the raw HTML already contains the title, the description, the JSON-LD block and real station content, with no JavaScript executed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Test fetches home, search, a station page, a country page and a combo page as a crawler
- [ ] #2 Asserts title, meta description, canonical and JSON-LD are present in raw HTML
- [ ] #3 Asserts station names appear in raw HTML without hydration
- [ ] #4 Runs in CI
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added e2e/crawler.spec.ts: 11 tests that fetch pages over plain HTTP with a GPTBot user agent and run no JavaScript, which is how most AI crawlers and some search crawlers actually read the site. Asserts title, meta description and canonical on eight routes, real station names present in the raw markup rather than an empty shell, the expected JSON-LD types per page (Organization, WebSite, SoftwareApplication, RadioBroadcastService, BreadcrumbList, FAQPage, CollectionPage), that robots.txt names the AI crawlers and points at the sitemap, that llms.txt and llms-full.txt serve, that the sitemap contains station URLs, and that /favorites and /history still declare noindex. Proved the assertions bite by deleting the layout's JSON-LD and confirming exactly one test failed and the rest still passed.
<!-- SECTION:FINAL_SUMMARY:END -->
