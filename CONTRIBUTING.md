# Contributing to OpenRadio

Thanks for being here. OpenRadio is a personal project built for fun, and it is better with other people in it. Issues, ideas and pull requests are all welcome, from a one-word typo fix to a whole feature.

## Ways to help

- **Fix or report a station problem.** Station data comes from [Radio Browser](https://www.radio-browser.info), so listing fixes belong there, but tell us if OpenRadio handles a station badly.
- **Design and UX.** The look is deliberately unusual (an analog tuner). Ideas that make it clearer or more beautiful are welcome.
- **Accessibility.** Keyboard traps, screen reader wording, contrast, reduced motion: all fair game.
- **Translations and local knowledge.** Genres, languages and country names that read wrong to a native speaker.
- **Code.** Pick anything in [`backlog/`](backlog/) or open an issue first for larger changes.

## Getting set up

```bash
git clone https://github.com/raj-khan/openradio.git
cd openradio
npm install
npm run dev
```

No API keys or database are needed. See the README for optional environment variables.

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e   # optional locally, runs in CI
```

Please also:

- Keep one logical change per pull request, with a short imperative title (Add, Fix, Update, Remove, Refactor, Test).
- Add or update tests when you change behavior.
- Check your change at 390px and 1280px, and with the keyboard.
- Avoid em-dashes in copy, and keep user-facing wording plain and friendly.

## Principles worth knowing

1. Audio comes first. Nothing (AI, images, metadata) may block or interrupt playback.
2. Real data decides. AI may interpret a request; it never invents stations or streams.
3. No accounts, no tracking. Favorites and history stay on the listener's device.
4. Culture and faith come only from explicit station tags, never inferred from a country, language or name.
5. We never host, record or rebroadcast audio.

## Reporting security issues

Please do not open a public issue. See [SECURITY.md](SECURITY.md).

## Code of conduct

Participation is covered by our [Code of Conduct](CODE_OF_CONDUCT.md). Be kind.
