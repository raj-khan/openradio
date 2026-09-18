---
id: TASK-71
title: Stop insecure station logos breaking the padlock
status: To Do
assignee: []
created_date: '2026-09-18 17:23'
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
