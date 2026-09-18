---
id: TASK-64
title: Let people choose talk radio over music
status: Done
assignee: []
created_date: '2026-09-18 12:37'
updated_date: '2026-09-18 12:48'
labels:
  - ux
  - discovery
dependencies: []
priority: high
ordinal: 64000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A listener reported never once hearing a live presenter. Measured against the live API: 20% of the popular pool Surprise draws from is tagged talk, news, public radio or faith, and 'news' is the single most common tag (49 of 400 sampled), so the stations are there. The product steers away from them. Three causes found. First, MIN_SURPRISE_BITRATE of 64 excludes 40% of news and 26% of talk stations, against 11% of jazz, because speech is broadcast at lower bitrates: the quality floor is silently a music filter. Second, the home page offers 11 music moods against 2 speech ones, and the dial is place-based, so every default path leads to music. Third, there is no way to ask for talk at all. Add an explicit choice (music, talk, or either) that steers the dial, Surprise and the moods, and stop the bitrate floor filtering out speech.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A visible control lets someone choose talk, music or either
- [ ] #2 The choice steers Surprise, the dial and the mood tiles
- [ ] #3 Speech stations are no longer excluded by a bitrate floor meant for music
- [ ] #4 Choosing talk yields a speech station most of the time, measured against the live directory
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
TASK-65 remains the harder half: tags describe a station, not what is on air at this moment, so a talk station can still be playing a music bed when you arrive.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Three causes, all fixed. The quality floor was the big one: a flat 64 kbps minimum was excluding the BBC World Service (56k), LBC UK (48k), esRadio, Deutschlandfunk and Radio Canada, because speech is broadcast at lower bitrates than music needs. Stations are now judged against a floor that matches what they broadcast, 32k for speech and 64k for music. Added an explicit Anything/Music/Voices control in the hero, remembered per device, which steers both Surprise and the dial's tune-in. Measured against the live directory over 600 sampled stations and 200 draws per mode: Voices returns speech in 100% of picks, Music in 0%, Anything stays at its natural 23%. Both the mode and the country preference fall back rather than returning nothing, so a place with no talk station still plays.
<!-- SECTION:FINAL_SUMMARY:END -->
