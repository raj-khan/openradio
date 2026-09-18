---
id: TASK-53
title: Put station and combo pages in the sitemap
status: To Do
assignee: []
created_date: '2026-09-18 08:00'
labels:
  - seo
dependencies: []
priority: high
ordinal: 53000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
sitemapPaths() emits about 180 URLs and includes no /station/[id] pages and no pSEO combo pages, even though both already render server side with structured data and canonicals. Add them. Stations need chunking through Next's generateSitemaps (50k URL limit per file) and a quality bar so dead or thin stations stay out: pick a bounded, ranked set rather than the whole Radio Browser directory. Combos should be emitted only above MIN_COMBO_STATIONS so the sitemap agrees with the noindex already set on thin ones. Set lastModified on entries where we have a real date.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Station pages appear in the sitemap, chunked, with a documented ranking and cap
- [ ] #2 Combo pages appear only when they clear MIN_COMBO_STATIONS, matching their noindex rule
- [ ] #3 lastModified is set where a real timestamp exists rather than being faked as now
- [ ] #4 The sitemap route stays within the build and revalidate budget
- [ ] #5 Unit tests cover chunking, the quality bar and the combo threshold
<!-- AC:END -->
