# OpenRadio: Architecture v3 (merged plan)

> Explore the world through radio.

Open-source web app to discover and listen to live internet radio from every country, language and genre, with a calm, adaptive visual atmosphere and optional AI-powered natural-language discovery.

This plan merges Plan 1 (OpenRadio) and Plan 2 (OpenRadio v2). It keeps Plan 2's principles (provider abstraction, real data as source of truth, respectful culture handling, graceful degradation) and Plan 1's small footprint (one app, no database, everything user-specific stays on the device).

---

## 1. Principles

1. **Find a real station, press play, keep listening.** Everything else is secondary.
2. **Audio is never blocked** by AI, visuals, images or metadata. If any of those fail, the radio keeps playing.
3. **Real data is the source of truth.** AI may interpret a request, never invent stations, URLs or facts.
4. **AI is optional.** The app is fully useful with no API key configured.
5. **No accounts, no tracking, no database** in v1. Favorites and history live in the browser.
6. **Culture from explicit metadata only.** Never infer religion or ethnicity from country or language.
7. **We do not record or cache audio.** Offline means the app shell, station metadata, favorites and history.
8. **Small, verifiable steps.** One task per PR. Lint, typecheck, tests and build must pass.

## 2. What we cut from Plans 1 and 2 (and why)

| Idea | Decision | Reason |
|---|---|---|
| Real-time audio analysis (Web Audio `AnalyserNode`) | Cut | Most streams send no CORS headers, so analysis returns silence unless audio is proxied through our server (bandwidth cost, rebroadcasting). |
| Offline audio buffering of live streams | Cut | Live streams are endless; Cache API cannot store them sensibly, and recording broadcasts raises copyright issues. |
| Postgres, Redis, BullMQ, NestJS | Cut for v1 | Radio Browser is already a free, cached directory. Add storage only when a feature needs it. |
| Monorepo with 10 packages | Cut | One Next.js app with clear `lib/` module boundaries. Extract packages later if mobile ships. |
| 5+ AI agents | Reduced to 1 | A single intent parser with a Zod schema, plus a deterministic fallback parser. |
| Image search providers | Deferred | Needs API keys and attribution handling. Use station artwork plus generated gradients. |
| World map, accounts, journeys, passport | Deferred | Post-MVP. |

## 3. MVP scope

- Station discovery via Radio Browser
- Filters: country, language, tag, free text
- Browse pages per country, language and tag (SEO friendly, limited set)
- Station detail page
- Persistent player across navigation (MP3/AAC/OGG plus HLS via hls.js)
- Media Session API (lock screen and media keys)
- Now playing (ICY metadata read server-side, when available)
- Favorites and recently played (localStorage)
- Surprise Me
- Natural-language discovery: deterministic parser always, AI parser when a key is configured
- Vibe engine: deterministic mood and theme from tags and now-playing text, animated gradient background, contrast-checked, reduced-motion aware
- PWA: manifest, installable, offline shell with cached metadata
- Friendly error states everywhere
- Security headers and CSP, SSRF-safe server fetches
- Accessibility: keyboard, ARIA, focus, contrast
- Tests: unit (Vitest), E2E smoke (Playwright)

## 4. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript strict |
| Styling | Tailwind CSS v4 with CSS custom properties for theme tokens |
| Validation | Zod |
| Client state | Zustand (player, favorites, history) with localStorage persistence |
| Streaming | HTML `<audio>` and hls.js for `.m3u8` streams |
| AI (optional) | Vercel AI SDK `generateObject` with a Zod schema, provider chosen by env |
| Tests | Vitest, Playwright |
| Lint/format | ESLint (next config), Prettier |
| CI | GitHub Actions: lint, typecheck, test, build |
| Hosting | Vercel (any Node host works) |
| Package manager | npm |

## 5. Architecture

```text
Browser
 ├── Pages (Server Components): home, search, station, country/language/tag, favorites, history
 ├── Persistent Player (Client): Zustand store + AudioEngine (<audio> / hls.js) + Media Session
 ├── Vibe Layer (Client): tags + now playing -> mood -> theme tokens -> CSS variables
 └── Service Worker: app shell + cached API GETs (stale-while-revalidate)

Next.js server (route handlers)
 ├── /api/stations            search (validated query)
 ├── /api/stations/[id]       single station
 ├── /api/stations/[id]/click report a play to Radio Browser (etiquette)
 ├── /api/now-playing/[id]    ICY metadata for a known station (SSRF guarded)
 ├── /api/countries | /api/languages | /api/tags
 ├── /api/surprise            random healthy station
 └── /api/discover            natural language -> filters (AI or deterministic)

lib/
 ├── stations/   types, schemas, normalizer, StationProvider, RadioBrowserProvider
 ├── player/     store, state machine, audio engine, media session
 ├── now-playing/ icy parser, safe fetch
 ├── discover/   deterministic parser, AI parser
 ├── vibe/       mood mapping, theme presets, contrast utilities
 ├── library/    favorites, history stores
 └── security/   url validation, rate limiting
```

## 6. Domain model

```ts
interface Station {
  id: string            // Radio Browser stationuuid
  name: string
  streamUrl: string     // url_resolved, falls back to url
  homepageUrl?: string
  faviconUrl?: string
  country?: string
  countryCode?: string
  state?: string
  languages: string[]
  tags: string[]
  codec?: string
  bitrate?: number
  isHls: boolean
  votes: number
  clickCount: number
  lastCheckOk: boolean
  lastCheckedAt?: string
  source: "radio-browser"
}

interface StationQuery {
  text?: string
  country?: string      // ISO 3166-1 alpha-2 code
  language?: string
  tag?: string
  order?: "popular" | "votes" | "name" | "random"
  limit?: number        // 1..100, default 30
  offset?: number
}

interface StationProvider {
  search(query: StationQuery): Promise<Station[]>
  getById(id: string): Promise<Station | null>
  getCountries(): Promise<Facet[]>
  getLanguages(): Promise<Facet[]>
  getTags(limit?: number): Promise<Facet[]>
  reportClick(id: string): Promise<void>
}

interface Facet { name: string; code?: string; stationCount: number }
```

Normalization rules: trim strings, split and lowercase tags and languages, drop empty values, dedupe, reject stations without a valid http(s) stream URL, never assume a field exists.

## 7. Radio Browser client

- Resolve a server from the official mirror list, fall back to `de1.api.radio-browser.info`.
- Send a descriptive `User-Agent` (`OpenRadio/<version>`).
- Always `hidebroken=true` for search.
- 8 second timeout, one retry on another mirror.
- Cache GET responses with Next.js fetch revalidation (facets 24h, search 10 min, station 1h).
- Report clicks via `/json/url/{uuid}` when a user starts playback (as the API docs ask).

## 8. Player

States: `idle | loading | playing | paused | buffering | error`.

- Single `<audio>` element owned by a client provider mounted in the root layout, so playback survives navigation.
- hls.js loaded lazily only for HLS stations when the browser lacks native HLS.
- Error recovery: on stall or error retry once after a short delay, then show a friendly error with "Try again" and "Find similar". Never retry forever.
- Volume and mute persisted.
- Media Session metadata (station name, now playing, artwork) and play/pause/stop handlers.

## 9. Now playing

- Server route takes a station id (never a raw URL), looks up the stream URL via the provider.
- Validates the URL: http(s) only, no credentials, resolves DNS and rejects private, loopback, link-local and reserved IP ranges.
- Requests with `Icy-MetaData: 1`, reads only up to the first metadata block (bounded bytes, 5s timeout), then aborts.
- Parses `StreamTitle='...'`. Returns `{ title: string | null }`.
- Client polls every 30s while playing, only for non-HLS streams. Missing metadata shows nothing, never an error.

## 10. Discovery

**Deterministic parser** (always available): matches country names and demonyms, language names and genre/mood keywords from a curated dictionary. Example: "calm bengali music from bangladesh" -> `{ country: "BD", language: "bengali", tag: "music", mood: "calm" }`.

**AI parser** (only when `AI_GATEWAY_API_KEY` or a provider key is set): AI SDK `generateObject` with the same Zod schema. Output is validated, then merged with the deterministic result. On any failure fall back silently to deterministic.

Results always come from `StationProvider.search`. Mood maps to tags (e.g. calm -> chill, ambient, lounge, classical).

**Surprise Me:** pick a random station with `order=random`, `hidebroken`, bitrate >= 64 and a known country.

## 11. Vibe engine

Deterministic in v1.

```ts
type Mood = "calm" | "energetic" | "nostalgic" | "romantic" | "focused" | "melancholic" | "joyful" | "mysterious" | "neutral"
interface Vibe { mood: Mood; energy: "low" | "medium" | "high"; animation: "none" | "subtle" | "slow" | "dynamic" }
interface Theme { background: string; surface: string; accent: string; accentAlt: string; text: string; mutedText: string }
```

- Mood from station tags and now-playing keywords (e.g. jazz/lounge -> calm, rock/dance/edm -> energetic, oldies/80s/retro -> nostalgic, news/talk -> focused).
- Each mood has a theme preset. A small hue offset derived from the station id keeps stations distinct.
- Every generated theme passes WCAG AA (4.5:1) for text on background and surface; otherwise it falls back to the neutral preset.
- Theme applied as CSS variables with a 1s crossfade. Animated gradient background. `prefers-reduced-motion` disables animation.
- Vibe refresh at most every 30s, only when station or now-playing text changes.

## 12. Culture and faith

- Faith stations appear only through explicit station tags (e.g. `islamic`, `quran`, `christian`, `gospel`).
- A "Faith & Spirituality" browse chip is simply a set of explicit tags.
- No inference from country, language or name. No user-level attributes are stored.

## 13. Library (on device)

- Favorites: ordered list of station snapshots, max 500.
- History: last 50 plays, deduped by station, with timestamp.
- Stored in localStorage via Zustand persist, versioned for migrations.

## 14. Routes

```text
/                      Hero, discover input, Surprise Me, popular countries, genres, popular stations
/search                Filters (country, language, tag, text), URL-synced, paginated
/station/[id]          Station detail, play, vibe, now playing, similar stations
/country/[code]        Top stations for a country
/language/[name]       Top stations for a language
/tag/[tag]             Top stations for a tag
/favorites             Saved stations
/history               Recently played
/about                 Project, data attribution, disclaimer
/offline               Offline fallback
```

SEO: `sitemap.ts` lists the top countries, languages and tags only (no millions of thin pages). Each page has proper metadata.

## 15. PWA and offline

- `app/manifest.ts` with icons and theme color.
- Hand-written `public/sw.js`: precache the shell and offline page; stale-while-revalidate for `/api/countries|languages|tags|stations`; network-first for pages with offline fallback; never touch audio requests.
- Registered only in production.
- UI shows an "Offline: browsing saved data, live audio needs a connection" notice.

## 16. Security

- Security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`.
- CSP: `media-src` and `img-src` allow `https:` and `http:` (stations are external), `connect-src 'self'` plus `https:` for HLS segments, `script-src 'self'` plus required inline for Next.js.
- All route handler input validated with Zod.
- SSRF guard for any server-side fetch of station URLs.
- Simple in-memory rate limit on `/api/discover` and `/api/now-playing`.
- No secrets in the client bundle. `.env.example` documents optional keys.
- Station names and tags are rendered as text only.

## 17. Error UX

- Never show raw errors. Examples: "This station isn't responding right now. Try another station."
- `error.tsx`, `not-found.tsx`, empty states, loading skeletons.
- Radio Browser outage: show a friendly message and keep favorites and history usable.

## 18. Accessibility

- All controls reachable and operable by keyboard, visible focus rings.
- Player controls with ARIA labels and live region for status changes.
- Contrast validated for dynamic themes.
- Reduced motion respected.

## 19. Testing

- Unit: normalizer, query builder, SSRF guard, ICY parser, deterministic intent parser, mood mapping, contrast utilities, player state machine, library stores.
- E2E (Playwright, mocked API where needed): home loads, search filters, open station page, play button changes state, favorite persists after reload.
- CI runs lint, typecheck, unit tests, build.

## 20. Delivery workflow

- Tasks tracked with Backlog.md in `backlog/`.
- One task per branch (`task-<n>-<slug>`) and PR. Squash merge after checks pass.
- Commit messages: imperative, prefixed by intent (`Add`, `Fix`, `Update`, `Remove`, `Refactor`, `Test`).

## 21. Post-MVP backlog

World map, accounts and sync, collections, image providers with attribution, AI vibe descriptions, radio journeys, radio passport, i18n, native apps (Expo), Chromecast.

## 22. Environment variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
RADIO_BROWSER_BASE_URL=          # optional override
AI_GATEWAY_API_KEY=              # optional, enables AI discovery
AI_MODEL=openai/gpt-5-mini       # optional
```
