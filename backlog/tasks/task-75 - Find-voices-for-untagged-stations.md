---
id: TASK-75
title: Find voices for untagged stations
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 03:30'
labels: []
dependencies: []
ordinal: 75000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Mode filtering reads tags, and 12 of Bangladesh's 26 stations carry no tags at all, so they can never match 'voices' whatever they broadcast. Only 3 BD entries are talk-tagged and one of those is the dead Jago FM duplicate. Extend the existing nameSuggestsSpeech signal with language and station-name evidence so untagged stations are judged on what is known about them rather than dropped.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 An untagged station whose name reads as speech matches voices mode
- [ ] #2 Stations with tags keep their current behaviour
- [ ] #3 Measured voices-mode pool size for BD, IN, EG, MX, TR recorded before and after
- [ ] #4 No measured increase in music stations leaking into voices mode
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Extended the name signal with three families found by inspecting untagged stations in the countries with the worst coverage: format words (info, sport, sports), networks that carry nothing but speech (VOA, RFI, NPR, World Service, Al Jazeera, Vaticana), and Quran reciter names in both Latin and Arabic script, since Egypt relays four of those untagged or tagged classical.

Deliberately excluded broadcasters that also run music services: 'bbc' would wrongly claim Radio 1 and 6 Music, 'trt' would claim TRT Muzik. Those are left to their tags.

Voices detected, before -> after: BD 6 -> 8, EG 9 -> 15, NG 18 -> 22, PK 10 -> 12, KE 10 -> 11, CU 2 -> 3, FR 28 -> 29. No change in IN, MX, TR, GB, US, which is the point: the gain lands where tagging is poor and leaves well-tagged pools alone.

False positives: 9 of 2528 music-only stations (0.36%). Inspected, 8 of the 9 are genuinely speech stations the directory tagged as music (88.9 Noticias, Sky News Arabia tagged country, Quran stations tagged classical). Only 'HPR4 Bluegrass Gospel' is arguably music.
<!-- SECTION:NOTES:END -->
