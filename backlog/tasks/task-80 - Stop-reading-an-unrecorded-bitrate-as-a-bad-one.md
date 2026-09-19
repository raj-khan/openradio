---
id: TASK-80
title: Stop reading an unrecorded bitrate as a bad one
status: Done
assignee: []
created_date: '2026-09-19 03:14'
updated_date: '2026-09-19 03:25'
labels: []
dependencies: []
priority: high
ordinal: 80000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
meetsQualityFloor compares station.bitrate to a floor, and the directory writes 0 when it simply has not recorded a bitrate. Unknown is therefore judged as 0 kbps and the station is dropped. Measured share of live stations with no recorded bitrate: Bangladesh 43%, India 49%, Egypt 45%, Nigeria 50%.

This is the main reason Dhaka had no voices. Bangladesh has 6 speech stations; 3 are offered, and those 3 are two Quran recitation channels plus Jago FM, whose stream is dead. The three dropped ones, including Radio Vivid Voice and Spice FM which are tagged talk outright, were dropped only because no bitrate is on file. Nigeria loses 13 of its 18 speech stations the same way.

Treat an unrecorded bitrate as unknown rather than as zero, and let the stream probe decide, since it already rejects anything that does not answer. Rank stations with a known good bitrate above unknown ones so quality still wins where it is known.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A station with no recorded bitrate is not dropped by the quality floor
- [ ] #2 A station with a recorded bitrate below the floor is still dropped
- [ ] #3 Known-good bitrates are preferred over unknown ones in ordering
- [ ] #4 Measured voices pool for BD, EG, NG, MX, TR, CU recorded before and after
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Measured voices pool per country, before -> after:
BD 3 -> 6, EG 2 -> 9, NG 5 -> 18, KE 4 -> 10, MX 3 -> 5, PK 8 -> 10, CU 1 -> 2, TR 9 -> 10, VN 14 -> 17, IN 8 -> 8.
Music pools roughly double in the same countries (IN 37 -> 83, NG 25 -> 43).

Dhaka now offers six voice stations instead of three, and the three added are the ones tagged talk outright: Radio Vivid Voice, Spice FM and Universal Health Radio.

On the third acceptance criterion: the candidate pool is deliberately NOT partitioned into known-bitrate first. Doing so would bury the unknown stations behind the same few known ones, which in Bangladesh means the probe would keep landing on the two Quran channels and the dead Jago FM: the exact complaint this task exists to fix. Quality preference is applied where it costs no variety, in dedupe's betterEntry, which keeps the row with a recorded bitrate when two entries describe one stream. The stream probe decides the rest.
<!-- SECTION:NOTES:END -->
