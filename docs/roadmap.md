# OpenRadio roadmap

OpenRadio is a personal project built for the fun of building it, so this roadmap is a direction, not a promise of dates. Anything here is open to help, and ideas outside it are welcome too.

## Shipped

The web app at [openradio.space](https://openradio.space):

- Tuning dial across featured cities, with instant playback from that country
- Search by name, country, language and genre, with shareable URLs
- Natural language discovery ("calm jazz from Japan"), keyword based, AI optional
- Surprise me
- Station pages with similar stations, plus country, language and genre pages
- Persistent player with MP3, AAC, OGG and HLS support, error recovery and media key control
- Now playing titles where stations broadcast them
- Favorites and history stored on the device, no account
- Interface colors and motion that follow the mood of the station, always contrast checked
- Installable PWA with offline browsing of what you already visited
- Accessibility pass with zero axe violations on main pages

## Next

- **Programmatic landing pages** for genre and country pairs, so people searching for "jazz radio in Japan" can find a real page
- **Structured data** so search engines and assistants understand stations
- **World map** view for geographic discovery
- **Sleep timer** and alarm
- **Collections**: group stations into your own lists
- **Internationalization**: interface in Bengali, Arabic, Spanish, French and more
- **Better station health signals**, so dead streams surface less often

## Later: apps everywhere

The plan is to keep one shared core (station provider, player logic, design tokens) and wrap it per platform.

| Platform | Approach | Notes |
|---|---|---|
| **macOS, Windows, Linux** | Desktop app (Tauri or Electron) | Menu bar or tray playback, global media keys, launch at login |
| **Android** | React Native or Expo | Background playback, Android Auto, lock screen controls |
| **iOS** | React Native or Expo | Background audio, CarPlay, widgets |
| **Chrome extension** | Toolbar popup | Quick tune, favorites, keep playing while you work |
| **Others under consideration** | Smart TV, Sonos, Home Assistant | Only if there is real interest |

Native apps come after the web experience feels right. If you want to lead one of these, open an issue and say hello.

## Not planned

- Accounts as a requirement for listening
- Advertising or tracking
- Hosting, recording or rebroadcasting station audio
- Inferring anyone's religion, ethnicity or politics from what they listen to

## How to help

Pick something from [`backlog/`](../backlog/), open an issue with an idea, or improve a page you use. See [CONTRIBUTING.md](../CONTRIBUTING.md).
