---
id: TASK-55
title: Add an FAQ page with FAQPage structured data
status: Done
assignee: []
created_date: '2026-09-18 08:00'
updated_date: '2026-09-18 12:34'
labels:
  - seo
  - ai-visibility
dependencies: []
ordinal: 55000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Answer engines quote question and answer pairs more readily than prose. Add a real FAQ covering the questions people actually ask: is it free, where do the stations come from, do you track me, why did a station stop, can I use it offline, how do I add a station, what licence is it under. Mark it up as FAQPage. Answers should be short, factual and self-contained so they survive being quoted without the surrounding page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An FAQ page exists, linked from the footer and the about page
- [ ] #2 FAQPage JSON-LD matches the visible copy exactly
- [ ] #3 Answers are self-contained and each stands alone when quoted
- [ ] #4 Page is in the sitemap
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Nine questions in lib/copy/faq.ts as the single source for both the rendered page and its FAQPage JSON-LD, so the markup can never summarise rather than mirror the visible text. Answers are written to survive being quoted alone: each names its subject instead of leaning on the question, and a test enforces that (minimum length, full sentence, mentions the subject). Grounded the catalogue claim by querying the live API: 57,167 stations across 240 countries, stated as 'more than 50,000 from over 200' so it stays true as the directory drifts. Linked from the footer and the about page, added to the sitemap and to llms.txt.
<!-- SECTION:FINAL_SUMMARY:END -->
