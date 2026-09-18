---
id: TASK-52
title: Add llms.txt and llms-full.txt
status: To Do
assignee: []
created_date: '2026-09-18 08:00'
labels:
  - seo
  - ai-visibility
dependencies: []
priority: high
ordinal: 52000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Nothing on the site tells a model what OpenRadio is in a single fetch. Serve /llms.txt in the standard format (H1 name, blockquote summary, then linked sections) covering what the product is, how to browse, the main entry points and the licence. Serve /llms-full.txt with the expanded prose an assistant can quote. Generate both from lib/site.ts constants and the real route list so they cannot drift from the app.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /llms.txt returns text/plain in the documented llms.txt structure
- [ ] #2 GET /llms-full.txt returns the expanded version
- [ ] #3 Both are generated from existing site constants, with no duplicated copy to keep in sync
- [ ] #4 Unit test covers the generated content
<!-- AC:END -->
