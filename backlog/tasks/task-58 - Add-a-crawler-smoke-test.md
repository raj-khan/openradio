---
id: TASK-58
title: Add a crawler smoke test
status: To Do
assignee: []
created_date: '2026-09-18 08:01'
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
