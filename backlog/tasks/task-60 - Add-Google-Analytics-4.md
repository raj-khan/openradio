---
id: TASK-60
title: Add Google Analytics 4
status: To Do
assignee: []
created_date: '2026-09-18 08:03'
updated_date: '2026-09-18 08:04'
labels:
  - analytics
dependencies: []
ordinal: 60000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add the GA4 tag G-17NXJ0LPEC. Two constraints to resolve first. CSP: script-src uses a nonce with strict-dynamic, so a host allowlist is ignored and both the gtag loader and the inline config script must carry the per-request nonce that proxy.ts already sets in x-nonce. Privacy: the about page currently promises 'No accounts and no tracking' and 'no cookies and no personal data', which GA4 contradicts because it sets cookies and collects IP-derived data, so the about copy needs updating and EU and UK visitors need a consent path before the tag may fire.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GA4 loads with the request nonce and is not blocked by CSP
- [ ] #2 Measurement ID comes from an environment variable, disabled when unset
- [ ] #3 About page privacy copy matches what is actually collected
- [ ] #4 Consent decision recorded: either a consent gate or a documented reason it is not needed
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Decision: GA4 with consent mode v2, defaulting all storage to denied until the visitor accepts. Keep GoatCounter as the cookie-free baseline. About page copy must be rewritten to describe GA4 before the tag ships.
<!-- SECTION:NOTES:END -->
