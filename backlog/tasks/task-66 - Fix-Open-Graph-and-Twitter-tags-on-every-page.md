---
id: TASK-66
title: Fix Open Graph and Twitter tags on every page
status: Done
assignee: []
created_date: '2026-09-18 13:24'
updated_date: '2026-09-18 13:33'
labels:
  - seo
  - bug
dependencies: []
priority: high
ordinal: 66000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Sharing any page other than the home page previews as the home page. The root layout hardcodes openGraph.title and openGraph.url, and Next passes both to every child that does not override them, so /faq previews as 'OpenRadio: world radio, open source' and every page reports og:url as https://www.openradio.space even though its canonical is correct. Station pages set openGraph but not twitter, so the same link previews one way on WhatsApp and another on X. Give openGraph.title a template like the document title already has, set og:url per page from the canonical path, and keep twitter in step with openGraph rather than letting it fall back to the site defaults. Verified on production: title and canonical are right everywhere, og:title and og:url are not.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 og:title matches the page title on every route
- [ ] #2 og:url matches the page's own canonical, never the home page
- [ ] #3 twitter tags agree with the openGraph tags on the same page
- [ ] #4 A test asserts this for a representative page of each kind, so it cannot regress
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Every page other than the home page previewed as the home page on every social platform. The root layout hardcoded openGraph.title and openGraph.url and Next hands both to any child that does not override them, so /faq and /country/jp shared with the generic site title and, worse, og:url pointed at the home page everywhere. Station pages set openGraph but not twitter, so the same link read 'RTL' on WhatsApp and the generic title on X. Added lib/seo/page-metadata.ts as one helper producing canonical, openGraph and twitter together, and routed all thirteen pages through it. Two regressions surfaced while testing and were fixed: declaring openGraph on a page replaces the root's object rather than merging, which silently dropped the file-convention share image and downgraded twitter:card from summary_large_image to a small thumbnail. Seven e2e tests now assert og:title matches the page, og:url matches the canonical, and twitter agrees with openGraph, and they failed for exactly the right reasons before the fix.
<!-- SECTION:FINAL_SUMMARY:END -->
