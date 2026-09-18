---
id: TASK-57
title: Verify in Search Console and Bing and submit sitemaps
status: In Progress
assignee: []
created_date: '2026-09-18 08:01'
updated_date: '2026-09-18 13:11'
labels:
  - seo
  - ops
dependencies: []
ordinal: 57000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Nothing is verified or submitted today, so there is no index coverage data and no way to see what search engines and answer engines actually fetch. Verify openradio.space in Google Search Console and Bing Webmaster Tools, submit the sitemap, and record where the verification lives. Prefer DNS TXT so it survives redeploys; otherwise use Next's metadata.verification with the token in an environment variable, never committed. Needs the account owner's hands for the token.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Property verified in Google Search Console with the method recorded in docs
- [ ] #2 Property verified in Bing Webmaster Tools
- [ ] #3 Sitemap submitted and reporting coverage in both
- [ ] #4 No verification token committed to the repository
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Code side done and merged: metadata.verification wired to GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION / YANDEX_SITE_VERIFICATION, malformed tokens dropped rather than rendered, and docs/search-console.md written as a runbook. The remaining acceptance criteria need the account owner: verifying the property (DNS TXT preferred, which needs no code at all), submitting the sitemap, and confirming coverage reports. Nothing further can be done from here.
<!-- SECTION:NOTES:END -->
