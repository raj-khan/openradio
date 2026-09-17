---
id: TASK-5
title: Implement Radio Browser HTTP client
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:48'
labels:
  - stations
dependencies:
  - TASK-1
priority: high
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Server-only client for the Radio Browser API: mirror list resolution with fallback, descriptive User-Agent, timeout, one retry on another mirror, Next.js fetch revalidation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Base URL overridable via RADIO_BROWSER_BASE_URL
- [x] #2 Requests time out after 8 seconds
- [x] #3 Retries once on a different mirror
- [x] #4 Unit tests with mocked fetch
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Server-only Radio Browser client with mirror resolution, fallback, User-Agent, 8s timeout, single retry on another mirror and Next.js revalidation.
<!-- SECTION:FINAL_SUMMARY:END -->
