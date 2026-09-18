---
id: TASK-65
title: Show whether a station is talking or playing music
status: Done
assignee: []
created_date: '2026-09-18 12:37'
updated_date: '2026-09-18 13:08'
labels:
  - ux
  - discovery
dependencies: []
ordinal: 65000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Follow-up to the talk radio finding, and the harder half of it. Even on a talk station a listener who tunes in at a random moment often catches a music bed or an ad break, and many stations tagged news are music stations that carry bulletins. Tags describe the station, not what is on the air right now. We already read live ICY metadata for now playing, which is a usable signal: a StreamTitle that looks like artist and title suggests music, a show name or an empty title suggests speech. Investigate whether that is reliable enough to label a station 'live show' against 'now playing', and only ship it if it is honest, since a wrong label is worse than none.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Assess how reliably ICY metadata distinguishes speech from music, with real measurements
- [ ] #2 Ship a label only if it is right clearly more often than not, otherwise write up why not and close
- [ ] #3 No label claims certainty the signal does not support
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Investigated and rejected, written up as decision-1. Measured 45 unambiguously talk and 45 unambiguously music stations against the live directory. Two findings each sufficient on their own: 56% of talk stations publish no ICY title at all, and silence is indistinguishable from a music station with a lazy encoder; and show names are shaped exactly like song titles, so LBC's 'Leading Britain's Conversation - Shelagh Fogarty', WDR 5's 'Quarks - Wissenschaft und mehr' and Giornale Radio's 'Tempo Reale con...' would all have been labelled as music while people were talking. Recorded honestly that about half the apparent errors were not errors: when Bayern 2 reported 'Sophie Zelmani - Travelling' a song really was playing on a talk station, which is the very thing the listener noticed. The signal carries real information but cannot support a claim that is right often enough to display, and a label wrong a third of the time teaches people to distrust everything beside it. The now playing title is still shown as published, which is a quotation rather than a claim.
<!-- SECTION:FINAL_SUMMARY:END -->
