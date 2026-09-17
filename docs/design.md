# OpenRadio: Design direction

**Concept: "Atlas Tuner".** OpenRadio should feel like holding a beautiful world radio, not browsing a website. Every screen borrows from analog radio hardware (tuning scales, needles, frequency readouts, grille textures) and places it over full-bleed photography of the places and moods you tune into.

## Research

Inspiration only, nothing copied:

- Pinterest "Radio UI design" and "Music app" idea boards
- Dribbble tags `radio-app` and search `radio tuning`
- Mobbin was requested but its MCP needs a paid plan, so it was not used

Recurring patterns worth adapting:

| Pattern seen | How OpenRadio uses it |
|---|---|
| Huge frequency readout ("98.8 MHz") | Each station gets a stable pseudo frequency (87.5 to 108.0) shown in large mono digits |
| Tick scale with a red tuning needle | `FrequencyDial`: a draggable/scrollable scale used to tune between places and moods |
| Retro radio hardware, speaker grilles | Subtle dot grille texture on surfaces, knob-like round controls |
| Equalizer and waveform bars | Animated `EqualizerBars` while playing (static with reduced motion) |
| Photo-heavy tiles | Place and mood tiles with licensed photography and dark gradient scrims |
| Full-screen now playing | Expanded player: blurred atmosphere photo, big frequency, rotating artwork disc |

## Principles

1. **Player first.** The player and the "tuning" act are the hero; lists are secondary.
2. **Photography sets the atmosphere.** Places and moods always have an image. Station artwork is small and framed like a label.
3. **Analog details, digital clarity.** Ticks, needles and grilles are decoration; text stays high contrast and readable.
4. **Motion means sound.** Things only move when audio plays. `prefers-reduced-motion` stops all ambient motion.
5. **Never block audio.** Images lazy load and never delay playback.

## Visual language

- **Type:** Bricolage Grotesque for display (expressive, a little retro); Geist for body; Geist Mono for frequencies, codecs, bitrates and counters.
- **Palette (dark first):** ink `#0a0908`, warm surface `#16130f`, raised `#211c16`, hairline `#3a3128`, paper text `#f4ede4`, muted `#a89c8d`, needle signal orange `#ff5a2c`, dial glow amber `#ffb347`. The vibe engine may shift accent hues later but keeps contrast AA.
- **Texture:** fine film grain overlay on photos; dot grille pattern on the player.
- **Shapes:** large radii (24px) on tiles, pill buttons, circular knob controls.
- **Scrims:** photos always sit under a bottom-to-top ink gradient so text passes contrast.

## Signature components

- `FrequencyDial`: horizontal tick scale with labelled majors and a fixed center needle. Snaps to entries (places or moods). Keyboard: arrow keys move between entries.
- `FrequencyReadout`: large mono digits `94.3` plus `MHz` label, derived from station id.
- `EqualizerBars`: 4 to 5 bars animated with CSS while playing.
- `PlaceTile` / `MoodTile`: photo, scrim, title, station count, tick strip along the bottom.
- `TunerCard`: station tile styled like a radio preset button: artwork label, frequency, name, meta, play knob.
- `NowPlayingView`: full-screen sheet from the player bar.

## Imagery

- Source: Unsplash (Unsplash License permits free commercial and non-commercial use without permission; attribution is given anyway).
- Stored locally in `public/images/` as optimized WebP so they cache offline and do not depend on a third-party host.
- Credits in `lib/imagery/credits.ts`, shown on the About page.
- Never Unsplash+ (paid) photos. Never images of identifiable people as the main subject for faith or culture tiles.
