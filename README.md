# Book Maps

A spoiler-free map companion for *The Shadow of the Wind* by Carlos Ruiz Zafón. Mark how far you have read; the map of 1945 Barcelona only shows places, people, and routes you have already met. Later pins are not greyed out. They are not there.

This slice covers the opening (**The Cemetery of Forgotten Books**) and **Days of Ashes, chapters 1–5**, split into scene beats. Fermín Romero de Torres has not entered the story yet, so he is not in the data.

Literary shops and the Cemetery of Forgotten Books are fictional and marked as approximate. Cafés, the Ateneo, Plaça Reial, Montjuïc Castle, and the streets themselves are real, with coordinates you can walk.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://127.0.0.1:4729](http://127.0.0.1:4729). The map uses Leaflet and OpenStreetMap tiles. No API keys.

```bash
npm run build
npm start -- --port 4729
```

Reader progress is a beat id in the browser (`localStorage`). **I’ve read further** advances one beat. The chip opens reached moments only. **Back to dawn** resets.

## How the spoiler gate works

Every beat, place, journey, and character has a `revealedIn` field pointing at a beat id. The UI filters with `src/lib/spoiler.ts` before anything reaches the map or inspector. Notes on a place (`notesByBeat`) unlock the same way, so a pin that appears early does not grow later plot.

Unread beat titles stay hidden. Do not add teaser markers, silhouettes, or “??? still locked” pins.

## Add later chapters

Data lives in `src/data/` as typed JSON:

| File | What it holds |
| --- | --- |
| `chapters.json` | Parts and numbered chapters (fallback picker) |
| `beats.json` | Scene beats: place, mood, current pin, spoiler-safe title |
| `locations.json` | Pins: names (Catalan / Spanish / English), type, coordinates, blurbs |
| `journeys.json` | Route overlays as lat/lng paths |
| `characters.json` | People who may appear in filters |
| `types.ts` | The schema |

Chapter ids in this slice: `cemetery`, `ashes-1` … `ashes-5`. Beat ids are kebab phrases (`dawn-santa-anna`, `quatre-gats`). Continue the chapter pattern (`ashes-6`, then whatever your edition uses for the next part). Keep `order` strictly increasing in both files. Each new beat must name a `chapterId` and a `currentLocationId`.

Marker types: `bookshop`, `library`, `home`, `street`, `institution`, `event`.

Set `background: true` for historical or neighborhood places the reader now *knows about* but has not visited as a scene (Montjuïc Castle when Clara first tells the story is the model). Those pins respect the **Background places** toggle.

### Coordinates

Use real Barcelona positions. For invented interiors (Sempere & Sons, the Cemetery, Barceló’s apartment), pick the street or square literary walking routes already use, set `fictional: true` and `approximate: true`, and say so in `address`.

### Copy

Write a short original blurb. A few attributed words from the novel are fine; a paragraph of quotation is not. Beat titles must be safe to read only after that moment; never put a future title in the picker.

## Prompt for extending the dataset

Paste this into an LLM with the chapter you have just read. Attach `src/data/types.ts` and the existing JSON files.

```
You are extending Book Maps, a spoiler-gated Barcelona companion for The Shadow of the Wind.

I have just finished chapter: [PART + CHAPTER TITLE / NUMBER].
Do not use anything that happens after that chapter. If you are unsure whether a fact is already revealed, omit it.

Return JSON patches only (new or updated objects) matching src/data/types.ts for:
- chapters.json (one new chapter object if this chapter is new)
- beats.json (one beat per distinct street or moment; do not collapse a walking chapter into a single beat)
- locations.json
- journeys.json
- characters.json

Rules:
1. revealedIn must be a beat id from this chapter, or an earlier beat if the place already exists. Never a later id.
2. Each beat needs chapterId, order, title (spoiler-safe once reached), placeLabel, moodLabel, yearLabel, currentLocationId, synopsis.
3. If a place already has a pin, do not duplicate it. Add a notesByBeat entry instead, still gated to this beat.
4. No teaser pins, unnamed silhouettes, or “you will return here” copy.
5. Blurbs: 1–3 original sentences. No long novel excerpts.
6. Names: Catalan, Spanish, and English. Mark fictional vs real. Mark approximate coordinates.
7. lat/lng must be real WGS84 points in Barcelona (or say if a scene is not in the city and skip the pin).
8. Characters appear in characters.json only when the reader has met them or clearly heard their name. Fermín, Bea, Nuria, and others must not be added before they appear.
9. Journeys are paths the reader has actually walked in this beat, as short arrays of {lat, lng}.
10. Types must be one of: bookshop, library, home, street, institution, event.
11. If the only new information is historical (a castle, a rumour about the war), use background: true.

After the JSON, list in one short paragraph what you deliberately left out because it would spoil later pages.
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Leaflet, OpenStreetMap. Static JSON only — no database, no auth, no Mapbox.
