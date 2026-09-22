# Book Maps — Project Context

Spoiler-free interactive map companion for *The Shadow of the Wind* by Carlos Ruiz Zafón, set in Barcelona.

## Goal

Help a reader track locations, character movements, and journeys through Barcelona as they read, without ever seeing a future place, death, or plot turn.

## Source of truth

Local folder: `~/Documents/projects/book-maps`  
GitHub: `https://github.com/alexonov/book-maps`

Code and these docs live in that folder. Open `docs/handoff.md` first in a new chat.

## Product decisions

- **One book only** for now. No multi-book library or book picker.
- **No Kindle / Amazon sync.** There is no official third-party progress API. Do not ship a Connect Kindle control. Do not scrape Amazon.
- **Progress unit:** scene beats. *I’ve read further* advances one beat; unread beat titles stay hidden. Chapter slider is a fallback.
- **Map as “I am here.”** Current place plus optional walk-back through already-visited streets.
- Optional later: local `My Clippings.txt` / emailed CSV as a *suggested* beat, never silent sync.

## First slice

A working web app, not a platform:

- Persistent reader progress (scene beat; chapter slider as fallback).
- Map gated to that progress: visited places, current setting, routes so far.
- Optional “background / historical places known up to this point.”
- Marker types: bookshops & libraries, homes, streets, institutions, key events.
- Inspector: Catalan/Spanish name + English, chapters, spoiler-safe blurb, characters present, real-world photo or street-view link when it exists.
- Character filters for people who have appeared by the selected progress.
- Sample data for the opening plus Days of Ashes 1–5, with real Barcelona coordinates where the place is real.
- README that explains how to add later chapters, including a safe LLM prompt.

## Stack (locked)

- Next.js (App Router), TypeScript, Tailwind, shadcn/ui
- Leaflet + OpenStreetMap (no Mapbox token)
- Static JSON/TypeScript data in-repo — no auth, no database

## Constraints

- **No spoilers beyond the selected progress.** Future pins, paths, names, and copy stay unavailable — not greyed-out teasers.
- **No long novel excerpts.** Short original blurbs only; a few words of attributed quotation at most.
- Gothic / sepia / dark Barcelona atmosphere. Real copy, empty/loading/error states, desktop and mobile.
