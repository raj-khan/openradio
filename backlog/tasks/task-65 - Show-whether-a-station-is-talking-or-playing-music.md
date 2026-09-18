---
id: TASK-65
title: Show whether a station is talking or playing music
status: To Do
assignee: []
created_date: '2026-09-18 12:37'
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
