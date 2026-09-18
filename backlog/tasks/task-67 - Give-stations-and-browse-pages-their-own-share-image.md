---
id: TASK-67
title: Give stations and browse pages their own share image
status: To Do
assignee: []
created_date: '2026-09-18 13:24'
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
