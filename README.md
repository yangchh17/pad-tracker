# PAD Tracker

A personal mood tracker. Log how you're feeling along three simple scales —
pleasant/unpleasant, energized/calm, in control/overwhelmed — and see how
your mood moves over time.

Live at: https://yangchh17.github.io/pad-tracker/

## Your data

Everything you log stays only on your own device. Nothing is uploaded
anywhere. Use **Export CSV** from the Journal screen now and then as a
backup.

## Optional AI companion ("Talk it through")

Turn on "Use local AI" in Settings (gear icon) to unlock **Talk it
through** — a short conversation that helps you process how you're
feeling before logging your mood. It's entirely optional; the app works
the same without it.

This feature needs a local AI program called Ollama running on a
computer. Setup and remote-access notes are kept separately, not in this
public file.

## Installing

Use **Add to Home Screen** (iOS Safari) or **Install app** (Android
Chrome) — an installed copy is more reliable than a browser tab for
keeping your data around long-term.

## Updating the app

1. Edit `index.html`.
2. Bump `CACHE_VERSION` in `sw.js` so installed copies pick up the change.
3. Commit and push — GitHub Pages redeploys automatically within a
   minute or two.

## Local testing before pushing

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`, check the console for errors, and try
logging an entry before pushing.
