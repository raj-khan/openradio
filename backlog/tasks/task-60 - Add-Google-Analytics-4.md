---
id: TASK-60
title: Add Google Analytics 4
status: Done
assignee: []
created_date: '2026-09-18 08:03'
updated_date: '2026-09-18 13:04'
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
Owner still needs to set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-17NXJ0LPEC in Vercel. Until then analytics is entirely off and no consent prompt appears.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GA4 behind consent mode v2. All four storage types default to denied before gtag.js loads, so nothing is stored until the visitor agrees, and the answer is remembered per device. Verified in a real browser rather than by reading the code: no CSP violations, dataLayer order is consent-default then js then config, and crucially no cookies at all before consent, with _ga and _ga_17NXJ0LPEC appearing only after Allow is clicked. The CSP needed the nonce rather than a host allowlist, because script-src uses strict-dynamic which ignores host allowlists; the consent defaults go in a plain inline nonce'd script because ordering before gtag.js is the whole point and next/script cannot guarantee it in the app router. Rewrote the about and FAQ privacy copy, which promised no tracking and no cookies and would have become false. Measurement id comes from NEXT_PUBLIC_GA_MEASUREMENT_ID and a malformed value disables analytics rather than being injected into a script.
<!-- SECTION:FINAL_SUMMARY:END -->
