---
id: TASK-51
title: Declare an AI crawler policy in robots.txt
status: Done
assignee: []
created_date: '2026-09-18 08:00'
updated_date: '2026-09-18 08:06'
labels:
  - seo
  - ai-visibility
dependencies: []
priority: high
ordinal: 51000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
robots.txt currently carries one wildcard rule, so every AI crawler falls back to its own default. Name the AI crawlers explicitly and allow them all: answer engines (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, PerplexityBot-User) and training crawlers (CCBot, Google-Extended, Applebot-Extended, meta-externalagent, Bytespider). OpenRadio is free and open source, so being in training data is the goal rather than a cost. Keep /api/ disallowed for all of them and point at the sitemap.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Every named AI crawler is explicitly allowed in the generated robots.txt
- [ ] #2 /api/ stays disallowed for every user agent including the AI crawlers
- [ ] #3 Unit test asserts the generated rules, so a future edit cannot silently drop a crawler
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Split the AI crawler list into lib/seo/crawlers.ts as ANSWER_CRAWLERS (cite and link back) and TRAINING_CRAWLERS (bulk ingestion), and named all 21 explicitly in robots.txt with Allow: / and Disallow: /api/. Allowing both groups is deliberate for a free, open source product with no content to protect. Verified the built robots.txt carries 22 user agent blocks including the wildcard. Unit tested so a future edit cannot silently drop a crawler.
<!-- SECTION:FINAL_SUMMARY:END -->
