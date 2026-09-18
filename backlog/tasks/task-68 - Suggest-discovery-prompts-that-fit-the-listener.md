---
id: TASK-68
title: Suggest discovery prompts that fit the listener
status: Done
assignee: []
created_date: '2026-09-18 13:25'
updated_date: '2026-09-18 17:25'
labels:
  - ux
  - discovery
dependencies: []
priority: high
ordinal: 68000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The four examples under the discover box are a hardcoded array, so a listener in Dhaka at 2am is shown 'Calm jazz from Japan' and 'UK news' exactly like everyone else. Make them fit the person.

Two signals are worth using and cost nothing. The browser already knows its timezone through Intl.DateTimeFormat().resolvedOptions().timeZone, which gives both the local hour and, via the zone's region, a good guess at the country. That means late-night suggestions after midnight, news and something brisk at breakfast, and a prompt naming the listener's own country and language. It needs no permission prompt, no IP lookup and no third-party service, and nothing leaves the device, which matters for a site that promises no tracking.

Weather was also suggested and is the one to leave out unless it earns its place: it needs an external API, a key, a budget and a location, and 'rainy day jazz' is a thin payoff for a third-party dependency and a new privacy question. Mood cannot be detected at all; the site already lets people pick one.

The suggestions must not break hydration: render the fixed set on the server and swap after mount, the same way the listening mode does.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Suggestions reflect the listener's local time of day
- [ ] #2 At least one suggestion names the listener's own country or language, derived from the timezone rather than an IP lookup or a permission prompt
- [ ] #3 No hydration mismatch and no flash of wrong content
- [ ] #4 Falls back to the current fixed examples when the timezone is unavailable or unrecognised
- [ ] #5 Every generated suggestion actually returns stations, verified against the live directory
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The four examples under the discover box now follow the listener's clock and name their own country or language. Both signals come from the browser: the timezone gives the local hour and, through a curated zone-to-country map, a fair guess at where they are, and navigator.language gives what they read in. No permission prompt, no IP lookup, no third-party request, nothing leaving the device. Left weather out deliberately: it needs an external API, a key and a location for a thin payoff. Every phrase is built from vocabulary lib/discover/intent.ts already parses, and there is a test asserting that across 1,920 listener combinations; it caught 'Radio from Turkey' falling through to free-text because the parser knows the country as Turkiye. Verified against the live directory that all 37 distinct prompts return stations, none empty, though 'News from Bangladesh' returns only one, consistent with TASK-69's finding. The server renders the fixed set and the browser swaps in the local one a frame later, so there is no hydration mismatch.
<!-- SECTION:FINAL_SUMMARY:END -->
