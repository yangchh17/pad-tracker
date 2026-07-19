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

## Optional local-AI assistance (Ollama)
The gear icon (⚙) opens **Settings**, where you can optionally point the app
at a local [Ollama](https://ollama.com) instance for two things: re-ranking
emotion-word suggestions using your note text ("Ask AI" in Record), and a
"Get Insights" summary of recent patterns in Journal. This is entirely
opt-in — off by default, and the existing free/offline nearest-neighbor
suggestions keep working exactly the same either way.

**Required one-time setup** — Ollama blocks cross-origin requests by default,
and it treats this app's origin and its own `:11434` port as different origins
even on the same machine. Start Ollama with `OLLAMA_ORIGINS` set to allow the
app's address (or `*` for local testing):
```powershell
$env:OLLAMA_ORIGINS="*"; ollama serve
```
(Or, if using the Ollama desktop app: Settings → "Expose Ollama to the
network".) Without this, every AI feature will fail immediately with a
connection error, regardless of whether Ollama is actually running.

**Reachability today is desktop-only.** The deployed app is served over
HTTPS (GitHub Pages), and browsers block HTTPS pages from calling a plain
HTTP local endpoint — this applies even on the same Wi-Fi, it's not a network
issue. So the AI features currently only work when using the app from a
browser on the same machine as Ollama (e.g. `http://localhost:8000`, see
"Local testing" below), not from the installed phone PWA. Using it from a
phone would need something like Tailscale Serve to give Ollama a real HTTPS
address — not set up yet.

The base URL/model fields in Settings work with any OpenAI-compatible
`/v1/chat/completions` endpoint, not just Ollama, so switching providers
later is a settings change, not a code change.

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
