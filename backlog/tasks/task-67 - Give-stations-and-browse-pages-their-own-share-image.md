---
id: TASK-67
title: Give stations and browse pages their own share image
status: Done
assignee: []
created_date: '2026-09-18 13:24'
updated_date: '2026-09-18 17:57'
labels:
  - seo
dependencies: []
ordinal: 67000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Every page shares the same generic tuner image, so a station link on WhatsApp or X looks identical to the home page and says nothing about what was shared. Next can render an opengraph-image per route segment. Give station pages an image carrying the station name, country and genre, and give country and tag pages one naming the place or genre. Reuse the existing design language from app/opengraph-image.tsx rather than inventing a second look. Keep them cacheable: these are rendered per request and a popular station could be scraped often.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A shared station link previews with that station's name and country
- [ ] #2 Country and tag pages preview with the place or genre named
- [ ] #3 Images stay within the platform size limits and are cached
- [ ] #4 Falls back to the site image when a station cannot be loaded
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Station, country and tag pages now render their own share card from one shared layout in lib/seo/share-image.tsx, which the site card was refactored onto so there is a single design rather than a second look. A station previews with its country, name and genre; country and tag pages name the place or genre. Cached for a day, since a popular station is scraped far more often than it is played, and a station that cannot be loaded still gets the site card rather than nothing. The catch worth recording: pageMetadata declares openGraph explicitly, which replaces the root's object, so Next does not fold in a route's own opengraph-image file. Each of the three pages has to name its image path, otherwise the file exists and is never referenced. Verified by fetching the generated PNGs (200 image/png, 54-66KB) and reading them: the RTL card shows France, RTL, généraliste in the existing design.
<!-- SECTION:FINAL_SUMMARY:END -->
