---
id: TASK-59
title: Fix the local network permission prompt on page load
status: To Do
assignee: []
created_date: '2026-09-18 08:03'
labels:
  - bug
  - privacy
dependencies: []
priority: high
ordinal: 59000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Visiting openradio.space makes Chrome ask 'allow other devices on your local network'. Cause: NEXT_PUBLIC_GOATCOUNTER_URL in production holds a bare number, so goatcounterOrigin() resolves new URL('https://1287') to the origin https://0.0.5.7. VisitCounter then requests a pixel from that non-public address and Chrome raises its Local Network Access permission prompt. The rendered home page carries origin https://0.0.5.7 today. Two parts: correct the environment variable in Vercel, and harden goatcounterOrigin() so a non-public host can never be accepted again.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 NEXT_PUBLIC_GOATCOUNTER_URL is a real GoatCounter URL in production, or unset
- [ ] #2 goatcounterOrigin() returns null for IP literals, numeric shorthand and hosts with no dot
- [ ] #3 Unit test covers the 1287 case and a plain IP literal
- [ ] #4 Loading the production home page raises no local network prompt
<!-- AC:END -->
