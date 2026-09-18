---
id: decision-1
title: Do not label stations as talking or playing music
date: '2026-09-18 13:07'
status: rejected
---

## Context

A listener said they never heard a presenter, only music. TASK-64 fixed the part
that was our doing: a bitrate floor meant for music was excluding talk stations,
and there was no way to ask for speech. That work is done.

TASK-65 was the harder half. Tags describe a *station*, not what is on the air
at this moment. A talk station plays music beds, trailers and ads, and some
stations tagged `news` are music stations that carry bulletins. So even a
perfect talk filter drops you onto a song sometimes.

The idea was to use the live ICY metadata we already read for now playing, on
the theory that a title shaped like "Artist - Title" means music while a show
name or an empty title means speech, and to label the station accordingly.

## Decision

Do not ship the label. The signal is not good enough to be honest with.

Measured against the live directory: 45 stations whose tags are unambiguously
speech and 45 unambiguously music, with the "X - Y" shape as the test.

|  | talk-only | music-only |
| --- | --- | --- |
| published any title | 20 (44%) | 31 (69%) |
| of those, "X - Y" shape | 9 (45%) | 29 (94%) |

Two findings, either of which is enough on its own.

**The signal is missing more often than not, exactly where it is needed.** 56%
of talk stations publish no title at all. Silence is not evidence of speech: a
music station with a lazy encoder looks identical.

**Show names are shaped like songs.** The dash is a formatting convention, not a
fact about audio:

- `LBC UK` -> "Leading Britain's Conversation - Shelagh Fogarty"
- `WDR 5` -> "WDR 5 Quarks - Wissenschaft und mehr mit Johannes Do..."
- `Giornale Radio` -> "Tempo Reale con Lapo De Carlo e Vicky Mangone - ..."

All three are people talking, and all three would have been labelled as music.

Worth recording honestly: roughly half the apparent errors were not errors. When
Bayern 2 reported "Sophie Zelmani - Travelling" a song really was playing on a
talk station, which is the very thing the listener noticed. So the signal does
carry real information. It just cannot be turned into a claim that is right
often enough to put on screen, and a label that is wrong a third of the time is
worse than no label: it teaches people to distrust everything next to it.

## Consequences

- The now playing title is still shown exactly as the station publishes it. That
  is a quotation, not a claim, so it stays honest whatever the station sends.
- TASK-64's control is the answer to the original complaint: people can ask for
  voices, and the stations that were being filtered out no longer are.
- Worth revisiting only with a signal about the audio itself rather than a
  string about it. Analysing the stream server side would cost real bandwidth
  per station and is not worth it for a label.
