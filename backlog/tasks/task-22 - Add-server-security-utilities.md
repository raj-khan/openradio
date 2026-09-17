---
id: TASK-22
title: Add server security utilities
status: Done
assignee: []
created_date: '2026-09-17 15:41'
updated_date: '2026-09-17 17:11'
labels:
  - security
dependencies:
  - TASK-1
priority: high
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
SSRF-safe URL validation (http/https only, no credentials, reject private, loopback, link-local and reserved IPs after DNS resolution) and an in-memory rate limiter.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Unit tests cover IPv4, IPv6 and DNS rebinding style cases
- [x] #2 Rate limiter unit tested
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
isPublicIp (IPv4, IPv6, mapped and NAT64), parseExternalUrl, connect-time safe DNS lookup via undici Agent, safeFetch with manual re-validated redirects, in-memory rate limiter and client key helper. Unit tested plus live checks: public stream allowed, loopback-resolving hostname and redirect to 127.0.0.1 refused.
<!-- SECTION:FINAL_SUMMARY:END -->
