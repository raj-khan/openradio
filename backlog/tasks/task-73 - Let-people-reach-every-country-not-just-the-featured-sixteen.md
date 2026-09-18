---
id: TASK-73
title: 'Let people reach every country, not just the featured sixteen'
status: Done
assignee: []
created_date: '2026-09-18 17:23'
updated_date: '2026-09-18 17:44'
labels:
  - ux
dependencies: []
priority: high
ordinal: 73000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The home dial carries only the 16 curated places, because each one has its own licensed photograph, so the other 220-odd countries in the directory are unreachable from the home page. Reported alongside a request for search in the country picker and for next and previous buttons on the wheel. Search is the real fix: a picker that can find any country by typing, with the curated sixteen as the default view. Next and previous buttons are worth adding regardless, because dragging a wheel on a phone is fiddly and there is no keyboard equivalent on touch.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Any country in the directory can be reached from the home page
- [ ] #2 The picker supports typing to filter
- [ ] #3 Next and previous controls exist alongside the wheel
- [ ] #4 Countries without curated photography still look deliberate
- [ ] #5 Works with a keyboard and with a screen reader
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Three things, one cause. An 'All countries' picker lists every country in the directory (240 against the dial's 16), opens with the search field focused, filters as you type and navigates to that country's page. Next and previous buttons sit on the dial itself, because a touch screen has no keyboard so the arrow keys the slider already understood were unreachable, and dragging a scale with a thumb is fiddly. Countries without curated photography were already handled: the country page falls back to HERO_IMAGE. Two faults found by testing in a real browser rather than assuming. Escape did not close the dialog, because a type=search input swallows the first press to clear itself, so the field is plain text. And ranking by station count alone read as noise: typing 'ba' listed Bosnia, Lebanon and Albania above Bangladesh, so matches are now tiered by prefix, then country code, then word prefix, then substring. Folding also drops a leading article, because the directory files the US as 'The United States Of America' and 'united' was ranking Tanzania above it.
<!-- SECTION:FINAL_SUMMARY:END -->
