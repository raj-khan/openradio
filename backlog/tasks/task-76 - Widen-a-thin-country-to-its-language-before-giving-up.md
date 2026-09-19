---
id: TASK-76
title: Widen a thin country to its language before giving up
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 03:37'
labels: []
dependencies: []
ordinal: 76000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Pinned to one country the app refuses rather than silently handing over music, which is right, but in Bangladesh it means 'voices' almost always refuses. Before refusing, offer speech stations in the country's own languages from anywhere: Bengali voices from West Bengal or the diaspora are closer to what was asked for than nothing. Say plainly that the station is from elsewhere.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A thin country falls back to its languages before returning 404
- [ ] #2 The response marks the station as from outside the chosen country
- [ ] #3 The UI says where it went instead of the country asked for
- [ ] #4 A country with enough stations of its own is unaffected
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Measured across all 241 countries that have stations: 66 (27%) return nothing for Voices. Of 53 sampled, the guarded language fallback finds real stations for 11 (Burkina Faso to French, Kosovo to Albanian, San Marino to Italian, Syria to Arabic, Suriname to Hindi, Antarctica/Bermuda/Bahamas/Fiji/Falklands to English). The other 41 keep the honest refusal.

The guard matters more than the fallback. Read naively, the most common language in Tuvalu, Nauru, Liberia, Djibouti and a dozen other tiny territories comes out as Arabic, because each carries one relayed Quran channel. Offering Arabic talk radio to someone who asked for Tuvalu is worse than saying there is none, so a language must carry at least 3 stations and 25% of the country's list before it speaks for it.

The UI says where it went rather than swapping quietly. Surprise me already named the country it landed in; the home dial now adds a line naming the language and the country.
<!-- SECTION:NOTES:END -->
