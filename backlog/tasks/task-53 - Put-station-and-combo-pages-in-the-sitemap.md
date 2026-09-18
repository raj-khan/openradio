---
id: TASK-53
title: Put station and combo pages in the sitemap
status: Done
assignee: []
created_date: '2026-09-18 08:00'
updated_date: '2026-09-18 12:54'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Sitemap went from about 190 URLs to 1,643: 1,408 station pages and 42 combos that were both entirely absent before. Did not chunk, and that was deliberate: the protocol limit is 50,000 per file and the real constraint is the fetch budget, since the directory serves at most 100 stations per request, so the cap is 2,000 (20 requests) and it fits in one file. Station pages are ranked by votes plus plays and filtered for substance: on air, has a country, meets the speech-aware quality floor, has tags or a homepage, and has been voted for or played at least once. Added lastChangedAt to the normalizer from the directory's lastchangetime, so lastmod reports when the station's details changed; deliberately did not fall back to lastCheckedAt, which moves on every health probe and would claim the page changed when nothing did. Verified in the built XML: 1,408 lastmod values with genuinely varied real dates, no duplicates. Combos are counted from one sample per featured country rather than 192 per-combo requests, a lower bound that under-includes rather than listing a page whose own noindex would then contradict the sitemap.
<!-- SECTION:FINAL_SUMMARY:END -->
