---
id: decision-2
title: Do not add a second station source
date: '2026-09-19 12:10'
status: rejected
---

## Context

A listener in Dhaka could not find a single station with a presenter talking.
Most of that was ours to fix, and is fixed: TASK-80 stopped an unrecorded
bitrate being read as a bad one, TASK-75 found voices the directory never
tagged, TASK-74 collapsed entries sharing one stream and TASK-79 stopped the
tuner landing on the same station twice. Dhaka went from three voice stations,
two of them Quran recitations and the third off the air, to eight with no
back-to-back repeats.

The remaining gap is not ours. TASK-77 measured it: Radio Browser carries 24
Bangladeshi stations, Wikidata knows 23 brands, and 16 of those are absent,
including most of the commercial Dhaka dial (Radio Today, ABC Radio, Radio
Capital, Radio Ekattor, Colours FM, Radio Aamar, Radio Dhoni, City FM, Radio
Padma). TASK-78 proposed carrying a seed list of our own to close it.

## Decision

Rejected. There is no source of those streams we can verify, so a seed list
would either ship empty or ship entries that do not play.

## What was tried

**Wikidata** answers what exists and is free, keyless and stable, but records no
stream URLs. It became the coverage report in TASK-77 and is useful for that.
It can never be a source of stations to play.

**The broadcasters' own sites.** Eight Dhaka stations were loaded in a real
browser with their players started, and every audio request was captured.
Nothing usable came back:

- Radio Shadhin and Radio Bhumi stream through surfernetwork with a signed
  token that expires sixty seconds after the page issues it.
- Radio Today streams through zeno.fm, which answers 401 to any third-party
  client. The same is true of stream.zenolive.com.
- Radio Dhoni publishes a plain Shoutcast address on two IPs, and neither
  answers from outside the country.
- ABC Radio, Peoples Radio, City FM and Radio Today's own page exposed no
  stream at all, even with the player running.

Zero of eight gave a static address that answered a probe. This is not a gap in
the search: these stations have deliberately made their streams unusable to
third-party clients, and that is their right.

**fmstream.org** lists real stream URLs and claims around 200,000 of them, but
publishes no API and no findable licensing terms. Bulk-extracting and
republishing another directory's data is a licensing question, not an
engineering one, and was put to the owner rather than decided here.

**Contributing back to Radio Browser** through its public `/json/add` endpoint
is real and would help everyone, but it writes to a public third-party database
under this project's name and needs a working stream to submit in the first
place. We do not have one.

## Consequences

Coverage of Bangladesh stays what the directory carries. `npm run coverage-gap`
keeps a current list of what is missing, so if a station's stream becomes
reachable the work queue is already written down.

No seed provider is built. An abstraction with nothing to put in it would be
dead code pretending to be a feature.

If this is revisited, the thing to check first is whether any of the sixteen
missing brands has become reachable, since that is the single fact the whole
idea depends on.
