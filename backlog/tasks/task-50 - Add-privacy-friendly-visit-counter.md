---
id: TASK-50
title: Add privacy-friendly visit counter
status: To Do
assignee: []
created_date: '2026-09-17 18:49'
labels:
  - ops
dependencies: []
ordinal: 50000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Show how many people have visited OpenRadio without adding a database. Evaluate options: GoatCounter (free for open source, privacy friendly, public dashboard), Umami cloud free tier, Vercel Analytics (no public number), or a tiny counter stored in an edge KV. Prefer no cookies, no personal data, and a number we can display on the site or in the README.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Counter works with no database of our own
- [ ] #2 No cookies and no personal data, documented in the about page
- [ ] #3 Visit count visible (site footer or about page) and does not block rendering
<!-- AC:END -->
