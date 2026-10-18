---
id: TASK-83
title: Stop inviting the bulk AI crawlers
status: To Do
assignee: []
created_date: '2026-10-18 09:37'
labels: []
dependencies: []
ordinal: 83000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Vercel's free tier ran out. robots.txt names 21 AI crawlers and allows all of them, and every page renders per request, so each pass over the 600 sitemap station pages is 600 renders. Keep the ones that cite and send a reader back, block the ones that collect in bulk and send nothing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 robots.txt allows only the crawlers that cite and refer
- [ ] #2 The bulk collectors get an explicit Disallow: / rather than being dropped from the list, since the wildcard rule would otherwise still let them in
- [ ] #3 Googlebot, Bingbot and other unnamed search crawlers are unaffected
- [ ] #4 The API stays disallowed for every user agent
<!-- AC:END -->
