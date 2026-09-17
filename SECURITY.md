# Security policy

## Reporting a vulnerability

Please do not open a public issue for security problems.

Use GitHub's private reporting: **Security → Report a vulnerability** on [the repository](https://github.com/raj-khan/openradio/security/advisories/new). If that is unavailable, contact the maintainer through their GitHub profile.

Please include what you found, how to reproduce it, and what an attacker could do with it. You will get a first response as soon as possible; this is a personal project, so please allow a few days.

## Scope

In scope:

- The OpenRadio web app and this repository
- Server routes under `/api`, especially anything that fetches external URLs
- Client-side issues such as cross-site scripting or leaking listener data

Out of scope:

- Radio Browser itself and third-party station streams (report those to their owners)
- Content of radio stations
- Denial of service through traffic volume

## What the app already does

- Server-side fetches of station streams are guarded against server-side request forgery: only public addresses are allowed, checked at connect time, with redirects re-validated
- A strict Content Security Policy with per-request nonces
- Input validation with Zod on every route, plus rate limiting on discovery and now playing
- No accounts and no personal data storage: favorites and history stay in the browser

## Supported versions

The latest commit on `main` and the deployed site at openradio.space.
