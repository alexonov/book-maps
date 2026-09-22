# Handoff — Book Maps

This file is for a **new chat opened on the local repo**.

## What this is

Spoiler-free Barcelona map for *The Shadow of the Wind*. One book. Next.js + Leaflet. No auth, no database.

Decisions and constraints: [project context](project-context.md).

## Status

- App lives in `~/Documents/projects/book-maps`. GitHub: [alexonov/book-maps](https://github.com/alexonov/book-maps).
- Map is gated by scene beats through Days of Ashes 5. Progress chrome is the place chip plus **I’ve read further**. Chapter slider is a fallback inside the progress sheet.
- `main` is on GitHub. No public Vercel URL yet. Import the repo at [vercel.com/new](https://vercel.com/new). Notes: [deploy](deploy.md), [local repo](local-repo.md).

## Do not rebuild

- No Kindle / Connect Amazon. No official page-level API. See [progress and UX](ux-and-progress.md).
- Early pins are mixed quality: [content confidence](content-confidence.md).

## Next

1. Deploy to Vercel if you want a phone URL.
2. Extend `beats.json` and the other data files as you read past Days of Ashes 5. Use the README prompt.
3. Optional later: local `My Clippings.txt` as a *suggested* beat. Not silent sync. Not a multi-book product.
