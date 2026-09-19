# Coverage gaps

Radio Browser is community edited, so what it carries follows whoever bothered
to add entries rather than what is actually on the air. This report says what a
country broadcasts that we cannot play.

```
npm run coverage-gap -- BD          # one country
npm run coverage-gap -- BD NG EG    # several
```

Wikidata answers what exists. It is free, keyless and has a real SPARQL
endpoint, but it records no stream URLs, so nothing it returns can be played
directly. The website column is a starting point for finding a stream, not a
stream. Nothing on the site depends on this script: it is run by hand, and a
Wikidata outage cannot affect the app.

Names are compared on the brand rather than the spelling, so "Radio Today"
matches "Radio Today 89.6 FM" and "DhakaFM 90.4" matches "Dhaka FM". See
`lib/stations/coverage.ts`.

## Bangladesh, the case that prompted this

A listener in Dhaka could not find a single station with a presenter talking.
Part of the answer was ours to fix (TASK-74, TASK-75, TASK-80). The rest is
this: most of the commercial Dhaka dial is simply not in the directory.

Run on 2026-09-19. Directory carries 24, Wikidata knows 23, and 16 of those
are not carried:

| Station | Website |
| --- | --- |
| Radio Aamar | http://www.radioaamar.com/ |
| Radio Today |  |
| ABC Radio | https://www.abcradio.fm/ |
| Radio Metrowave |  |
| Radio Metropolitan |  |
| City FM 96.0 FM | http://www.cityfm96.fm/ |
| Radio Capital |  |
| Radio Padma |  |
| Radio Dhoni |  |
| Colours FM |  |
| Bangla Radio |  |
| Radio Amber |  |
| Radio Ekattor |  |
| Radio Edge |  |
| Radio Dhol |  |
| Radio Din Raat |  |

Seven matched: Radio Foorti, Radio Bhumi, Peoples Radio, Radio Shadhin,
DhakaFM, Jago FM and Spice FM.

Not every missing brand can be added. Radio Today streams through zeno.fm,
which answers 401 to any third-party client, so it cannot be played from here
at all. That is why the seed list in TASK-78 probes every entry in CI rather
than trusting a URL because it was published somewhere.
