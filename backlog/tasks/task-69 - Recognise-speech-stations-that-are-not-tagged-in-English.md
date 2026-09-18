---
id: TASK-69
title: Recognise speech stations that are not tagged in English
status: Done
assignee: []
created_date: '2026-09-18 13:27'
updated_date: '2026-09-18 13:54'
labels:
  - bug
  - discovery
dependencies: []
priority: high
ordinal: 69000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Reported from Dhaka: choosing Voices offered only Jago FM, and that stream was dead. Measured across all 16 featured countries, asking exactly as the dial asks (top 30, live, above the floor). Six of sixteen return one voice station or none: Bangladesh 1, India 1, Mexico 1, Turkey 1, Egypt 0, Cuba 0.

The stations exist. The filter cannot see them, for two reasons.

SPEECH_TAGS is English only. Cuba tags news as 'noticias', Turkey as 'haber' and 'haberler', Morocco as 'actualites', Egypt's Quran stations as 'اسلامي', 'دين' and 'قران كريم'. NTV Radyo and MEDI 1 only matched at all because they happened to carry an English tag alongside their own.

Many speech stations carry no useful tag whatsoever. Radio Reloj, Cuba's 24 hour news station, is tagged '101.5 fm, 950 am, icrt'. Mexico's '88.9 Noticias' and 'MVS Noticias' are tagged with frequencies and network names. Egypt has Quran stations tagged 'classical' or nothing at all. For these the name is the only signal there is.

Two further faults make it worse. The dial fetches only 30 stations, and the difference is large: Japan has 3 voice stations in the top 30 against 5 in the top 100, France 8 against 22, Germany 12 against 26. And when nothing matches we silently fall back to every station, so a listener in Egypt who asks for Voices is given music and never told why.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Speech tags are recognised in the languages stations actually use, at minimum Spanish, French, Portuguese, German, Turkish, Arabic and Bengali
- [ ] #2 A station identifiable only by its name, such as Radio Reloj or 88.9 Noticias, is recognised
- [ ] #3 The dial samples enough stations that a country's voice stations are actually reachable
- [ ] #4 When a country genuinely has none, say so rather than silently playing music
- [ ] #5 Re-run the per-country measurement and show the before and after
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Three faults, all fixed. Speech tags were English only, so Cuba's 'noticias', Turkey's 'haber', Morocco's 'actualites' and Egypt's 'اسلامي' and 'قران كريم' were invisible; the list now covers Spanish, Portuguese, French, German, Dutch, Turkish, Italian, Arabic, Bengali, Hindi, Urdu, Indonesian, Russian and East Asian terms. Many speech stations carry no useful tag at all, so the name is now a secondary signal, deliberately narrow and whole-word only. And the dial fetched 30 stations where the directory serves 100, which alone was hiding most of them. Measured before and after across all 16 countries: Bangladesh 1 to 3, India 1 to 8, Egypt 0 to 2, Mexico 0 to 4, Turkey 1 to 7, and the wider sample lifted Brazil 4 to 24, France 8 to 23, Germany 11 to 26. Mexico and Turkey were rescued entirely by name detection finding 88.9 Noticias, MVS Noticias, a HABER and Habertürk Radyo. Cuba remains thin at 1 because Radio Reloj announces itself as a clock, which is exactly why the silent fallback had to go: asking for Voices and being handed music now says so instead of pretending.
<!-- SECTION:FINAL_SUMMARY:END -->
