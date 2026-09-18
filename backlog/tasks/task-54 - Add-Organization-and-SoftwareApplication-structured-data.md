---
id: TASK-54
title: Add Organization and SoftwareApplication structured data
status: Done
assignee: []
created_date: '2026-09-18 08:00'
updated_date: '2026-09-18 12:26'
labels:
  - seo
  - ai-visibility
dependencies: []
ordinal: 54000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The markup describes stations well but never describes OpenRadio itself, so a model reading a page learns what a station is and not what the product is. Add an Organization node (name, url, logo, sameAs the GitHub repo) and a SoftwareApplication node (application category, free price, licence, operating system) wired into the existing JsonLd component in the root layout, linked by @id to the WebSite node already there.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Organization and SoftwareApplication JSON-LD render on every page
- [ ] #2 Nodes are linked by @id to the existing WebSite node rather than floating free
- [ ] #3 Output validates against Schema.org and Google's Rich Results test
- [ ] #4 Unit tests extend lib/seo/structured-data.test.ts
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Organization (#organization) and SoftwareApplication/WebApplication (#app) nodes and linked the graph by @id: the app's publisher and isPartOf, the website's publisher, and each station's broadcastAffiliateOf all point at the organization node instead of repeating an inline copy. Verified in rendered HTML from a local production build rather than only in unit tests: the about page carries all three nodes and a real station page carries five, with broadcastAffiliateOf resolving to #organization.
<!-- SECTION:FINAL_SUMMARY:END -->
