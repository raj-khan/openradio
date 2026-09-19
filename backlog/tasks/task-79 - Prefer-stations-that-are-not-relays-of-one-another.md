---
id: TASK-79
title: Prefer stations that are not relays of one another
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 03:49'
labels: []
dependencies: []
ordinal: 79000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Asking for voices tends to land on the same few networks because news is syndicated: the BBC World Service, RFI and their relays are filed many times over. Measured, BBC is only 4% of the talk-tagged pool, so the fix is not to single it out but to stop drawing the same brand twice. Spread the choice across distinct station names and hosts so repeated presses give genuinely different radio.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Two draws in a row do not return the same brand name
- [ ] #2 Candidates are spread across stream hosts, not just shuffled
- [ ] #3 Measured repeat rate over 200 draws recorded before and after
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Measured the global draw first and found it was already varied: 60 draws gave 50 distinct names and 0 back-to-back repeats, because each request hits a random page of the popular list. BBC was 2 of 60, so the 'always the BBC' impression is not the BBC dominating, it is thin pools repeating.

The repetition is in the country-pinned path, which is the one being complained about. Over 200 draws: Bangladesh Voices repeated the previous station on 13-15% of presses, Nepal 10%, Cuba 34%. After: 0% in all three.

Two causes. A brand filed under several entries gets several chances (AL-QURAN BANGLA is in the Bangladesh list twice on different streams, so TASK-74's stream dedupe misses it), and nothing stopped the draw landing on the station already playing.

Avoiding by id alone was not enough and the measurement caught it: BD only fell to 5%, because a brand filed twice keeps whichever entry the shuffle put first, so the id played last time is often not the id that survived this time. Matching on the brand took it to 0%.

The brand fold here is deliberately lighter than the coverage report's: that one strips 'radio' and 'fm' to compare two directories, which here would merge 'Radio One' with 'One FM' and shrink an already thin pool.
<!-- SECTION:NOTES:END -->
