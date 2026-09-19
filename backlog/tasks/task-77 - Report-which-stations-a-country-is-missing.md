---
id: TASK-77
title: Report which stations a country is missing
status: Done
assignee: []
created_date: '2026-09-19 03:08'
updated_date: '2026-09-19 03:43'
labels: []
dependencies: []
ordinal: 77000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Radio Browser lists 26 stations for Bangladesh. Wikidata lists 23 Bangladeshi radio brands, and the ones the directory has never heard of include Radio Today, ABC Radio, Radio Capital, Radio Ekattor, Colours FM, Radio Aamar, Radio Dhoni, City FM and Radio Padma: most of the commercial FM dial in Dhaka. Wikidata is free, keyless and has a real SPARQL endpoint, but it carries no stream URLs, so it cannot be a station source. Use it for what it is good for: a per-country gap report that gives the seed list a real work queue instead of guesses.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A script queries Wikidata for radio stations in a given country
- [ ] #2 It reports which known brands our directory does not carry
- [ ] #3 Output is committed for Bangladesh as the first worked example
- [ ] #4 No runtime page depends on Wikidata
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Wikidata answers what exists: free, keyless, real SPARQL endpoint, queried by ISO code so it works for any country. It records no stream URLs, so it can never be a station source, and nothing on the site depends on it.

Bangladesh, run 2026-09-19: directory carries 24, Wikidata knows 23, and 16 of those are not carried, including Radio Today, ABC Radio, Radio Capital, Radio Ekattor, Colours FM, Radio Aamar, Radio Dhoni, City FM and Radio Padma. Seven matched.

Name matching is on the brand rather than the spelling, so 'Radio Today' matches 'Radio Today 89.6 FM' and 'DhakaFM 90.4' matches 'Dhaka FM'. The camel-case split was needed: glued together, the FM in DhakaFM is no longer a word and survived the decoration strip.

Output committed to docs/coverage.md.
<!-- SECTION:NOTES:END -->
