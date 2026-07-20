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
at a local [Ollama](https://ollama.com) instance for **"Talk it through"** —
a multi-turn conversation (in Record, next to the Note field) that helps you
process what you're feeling, capturing your mood both before and after the
conversation on the same entry. This is entirely opt-in — off by default,
and logging an entry without it works exactly the same either way.

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

**Reachability from your phone (Tailscale).** By default the AI features
only work from a browser on the same machine as Ollama, since the deployed
app is HTTPS and browsers block HTTPS pages from calling a plain HTTP local
endpoint. On this setup, that's solved: Ollama is reachable at
`https://my-brain-1.tail28b58f.ts.net:8443` for any device on the same
Tailscale tailnet (phone included) — set that as the Base URL in Settings
on your phone, same model name, and it works exactly like localhost does
on the desktop, including from the installed PWA.

This isn't just `tailscale serve` pointed at Ollama directly — Ollama
rejects any request whose `Host` header isn't `localhost`/`127.0.0.1` (an
anti-DNS-rebinding check with no env var to turn off), and a reverse proxy
like `tailscale serve` forwards the original Host header unchanged. A
small local Python proxy (`host-rewrite-proxy.py`, project root, outside
this repo) sits in between and rewrites the Host header back to
`localhost:11435` before forwarding to a second Ollama instance dedicated
to this path (port 11435, separate from the normal one on 11434, since the
running instance couldn't be restarted with `OLLAMA_ORIGINS` set — locked
process). Run `start-tailscale-ollama.ps1` (also project root) after every
reboot to bring this back up; nothing here is installed as a Windows
service. Your phone also needs Tailscale connected to the same tailnet.

The app calls Ollama's **native** `/api/chat` endpoint (not the generic
OpenAI-compatible `/v1/chat/completions`) with an explicit `num_predict`/
`num_ctx` budget. This was a deliberate, tested choice, not an oversight:
on real hardware, the OpenAI-compatible endpoint silently ignored every
attempt to raise the token budget (`max_tokens`, and an `options` passthrough)
and always capped out at a small default — reasoning/"thinking" models
(e.g. Ollama's `gemma4` family) then spend their entire budget on internal
chain-of-thought and return an empty answer, `finish_reason: "length"`.
The native endpoint's `options.num_predict` fixed this reliably. Trade-off:
this ties the integration to Ollama specifically rather than any
OpenAI-compatible local server — accepted deliberately since Ollama is
what's actually being used.

**Thinking is explicitly disabled** (`"think": false` in the request body)
for models that support it. Without this, reasoning models like `gemma4`
spend 60-90+ seconds per reply on hidden chain-of-thought before answering
— fine for quality, bad for a live conversation. With it off, the same
model answers directly in a couple of seconds with no change in which model
runs, only whether it deliberates first. The client-side timeout is still
set to 120s as a safety margin; don't lower it without testing against your
actual model first, since non-reasoning or differently-configured models
may not benefit the same way.

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
