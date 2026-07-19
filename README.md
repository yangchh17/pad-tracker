# PAD Tracker

A personal mood tracker mapping your emotional life as a trajectory through
phase space, using the PAD model: **Valence** (pleasant–unpleasant),
**Arousal** (energized–calm), **Dominance** (in control–overwhelmed).

Live at: https://yangchh17.github.io/pad-tracker/

## What's here
- `index.html` — the whole app (originally a Claude Design prototype, wired
  up here to real `localStorage` persistence, a responsive full-screen frame,
  CSV export, and empty states).
- `support.js` — the Claude Design runtime the app template/logic depends on.
  Generated code — don't hand-edit.
- `vendor/` — self-hosted `react.production.min.js`, `react-dom.production.min.js`,
  `babel.min.js` (pinned to the exact versions `support.js` expects, loaded
  via a `window.__resources` override in `index.html` instead of unpkg.com,
  so the app doesn't depend on a third-party CDN staying up).
- `manifest.json`, `sw.js`, `icons/` — the PWA shell (installable, offline-capable).

## Data safety
All entries live only in your browser's `localStorage` on whatever device you
installed the app on — nothing is sent to a server. Use **Export CSV** from
the Journal screen periodically as a backup; that file is also your
cross-device transfer mechanism until JSON import/export ships.

Installing via **Add to Home Screen** (iOS Safari) or **Add to Home
screen/Install app** (Android Chrome) matters beyond convenience: an
installed PWA is exempt from Safari's periodic eviction of unused website
data, which a regular browser tab is not.

## Updating the app
1. Edit `index.html` (and `sw.js`/`manifest.json`/`vendor/` only if those
   specifically need to change).
2. Bump `CACHE_VERSION` in `sw.js` (e.g. `pad-tracker-v2` → `v3`) so installed
   copies actually pick up the change — the service worker is
   stale-while-revalidate, so without a version bump it'll keep serving the
   old cached shell for a while.
3. Commit and push:
   ```bash
   git add -A
   git commit -m "describe the change"
   git push
   ```
4. GitHub Pages rebuilds automatically from the `master` branch root within
   a minute or two.

## Local testing before pushing
```bash
python -m http.server 8000
```
Open `http://localhost:8000/`, check DevTools console for errors, confirm the
manifest resolves and the service worker activates (Application tab), and
exercise the app (log an entry, check it appears in Home/Journal, reload to
confirm persistence, toggle EN/中文, export CSV) before pushing.
