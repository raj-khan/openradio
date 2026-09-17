---
id: TASK-50
title: Add privacy-friendly visit counter
status: Done
assignee: []
created_date: '2026-09-17 18:49'
updated_date: '2026-09-18 03:08'
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
- [x] #1 Counter works with no database of our own
- [x] #2 No cookies and no personal data, documented in the about page
- [x] #3 Visit count visible (site footer or about page) and does not block rendering
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Chose GoatCounter (free for open source, no cookies, no personal data, public
dashboard). Disabled unless NEXT_PUBLIC_GOATCOUNTER_URL is set. Client pixel
records a path-only page view per navigation; the footer shows total visits
from the public counter endpoint, cached an hour and behind Suspense so it
never blocks rendering. Documented on the about page. Unit tested; verified
the disabled path in rendered HTML.
<!-- SECTION:FINAL_SUMMARY:END -->
