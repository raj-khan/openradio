---
id: TASK-71
title: Stop insecure station logos breaking the padlock
status: Done
assignee: []
created_date: '2026-09-18 17:23'
updated_date: '2026-09-18 17:30'
labels:
  - bug
  - security
dependencies: []
priority: high
ordinal: 71000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Chrome reports 'Connection is not fully secure. Attackers might be able to see the images that you are looking at on this site and trick you by modifying them.' Measured across 400 live stations: 8% carry a faviconUrl over http, including the BBC World Service (http://cdn-profiles.tunein.com/...). StationArtwork renders those straight into an img tag, and the CSP permits img-src http:, so the browser loads them and then warns about the whole page. Our own place photography is local webp over https and is not involved, so there is no reason to replace the imagery with drawn graphics. Two ways out: proxy the logos through our own https endpoint using the existing SSRF guard in lib/security/url-guard.ts, which keeps the logos and costs bandwidth, or refuse http logos and fall back to the generated gradient StationArtwork already draws. Decide deliberately and say why.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 No page loads a subresource over http, so the padlock warning is gone
- [ ] #2 Station logos either still appear or degrade to the existing generated artwork, never a broken image
- [ ] #3 img-src no longer permits http:
- [ ] #4 If proxied, the proxy reuses the existing SSRF protections and caches
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The local server runs over http, so mixed-content blocking cannot be reproduced there. The evidence is the normalizer output and the CSP header rather than a browser warning disappearing.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Chose upgrading over proxying, on evidence: of 14 insecure logos sampled from the live directory, 13 served the identical file over https and simply had the old address recorded. faviconUrl is now rewritten to https when the station is normalized, which keeps the logos without spending bandwidth or standing up another endpoint that fetches arbitrary URLs. img-src no longer permits http:, so the one in fourteen that cannot be upgraded is blocked and falls back to the generated gradient StationArtwork already draws on error. Verified against a local production build: 0 http favicons out of 100 stations where the live site still serves 8%, CSP header reads img-src 'self' data: blob: https:, and a browser pass found no external http image requests. Left streamUrl alone deliberately: 37% of streams are http and upgrading one that does not answer on https would break playback outright, which is TASK-72.
<!-- SECTION:FINAL_SUMMARY:END -->
