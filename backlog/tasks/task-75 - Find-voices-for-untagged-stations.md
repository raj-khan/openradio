---
id: TASK-75
title: Find voices for untagged stations
status: To Do
assignee: []
created_date: '2026-09-19 03:08'
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
