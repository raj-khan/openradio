---
id: TASK-83
title: Stop inviting the bulk AI crawlers
status: Done
assignee: []
created_date: '2026-10-18 09:37'
updated_date: '2026-10-18 09:42'
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
- [x] #1 robots.txt allows only the crawlers that cite and refer
- [x] #2 The bulk collectors get an explicit Disallow: / rather than being dropped from the list, since the wildcard rule would otherwise still let them in
- [x] #3 Googlebot, Bingbot and other unnamed search crawlers are unaffected
- [x] #4 The API stays disallowed for every user agent
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
robots.txt now allows 8 crawlers and refuses 13. Allowed: OAI-SearchBot, ChatGPT-User, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User, Applebot, DuckAssistBot. All of them cite the site and send a reader back.

The refusals are explicit (Disallow: /) rather than omissions, because the wildcard rule invites anything it does not name. Verified by serving the build and reading the real /robots.txt.

Google-Extended and Applebot-Extended are refused for consistency only: they fetch nothing, so they save no requests.

Does not address the cause. Pages still render per request because of the CSP nonce in app/layout.tsx (see TASK-82 notes), so a crawl is still uncached work, there is just much less of it invited. Also unverified: which hosting meter actually tripped. If it was bandwidth rather than renders, this changes less than expected.
<!-- SECTION:NOTES:END -->
