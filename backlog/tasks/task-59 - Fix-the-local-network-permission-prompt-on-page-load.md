---
id: TASK-59
title: Fix the local network permission prompt on page load
status: Done
assignee: []
created_date: '2026-09-18 08:03'
updated_date: '2026-09-18 12:24'
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

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
AC #1 and #4 need the Vercel dashboard and a deploy, both owner actions. The code side is done.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
goatcounterOrigin() now rejects any host that is not a real public domain: IPv4 and IPv6 literals, integer shorthand, bare words with no dot, and localhost/local/internal style suffixes. The live failure was NEXT_PUBLIC_GOATCOUNTER_URL holding a bare site code, which URL expands as integer shorthand, so 1287 became https://0.0.5.7 and every visitor got Chrome's local network permission prompt while the counter recorded nothing. The environment variable still has to be corrected in Vercel (owner's action, AC #1); this change means a wrong value disables counting quietly instead of prompting every visitor.
<!-- SECTION:FINAL_SUMMARY:END -->
