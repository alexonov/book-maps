# Book Maps

A spoiler-free map companion for *The Shadow of the Wind* by Carlos Ruiz Zafón. Set how far you have read; the map of 1945 Barcelona only shows places, people, and routes you have already met. Later pins are not greyed out. They are not there.

This first slice covers the opening (**The Cemetery of Forgotten Books**) and **Days of Ashes, chapters 1–5**. Fermín Romero de Torres has not entered the story yet, so he is not in the data.

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

Reader progress is stored in the browser (`localStorage`). Reset it from the chapter control.

## How the spoiler gate works

Every chapter, place, journey, and character has a `revealedIn` field pointing at a chapter id. The UI filters with `src/lib/spoiler.ts` before anything reaches the map or inspector. Notes on a place (`notesByChapter`) unlock the same way, so a pin that appears early does not grow later plot.

Do not add teaser markers, silhouettes, or “??? still locked” pins.

## Add later chapters

Data lives in `src/data/` as typed JSON:

| File | What it holds |
| --- | --- |
| `chapters.json` | Reading order, part name, short synopsis |
| `locations.json` | Pins: names (Catalan / Spanish / English), type, coordinates, blurbs |
| `journeys.json` | Route overlays as lat/lng paths |
| `characters.json` | People who may appear in filters |
| `types.ts` | The schema |

Chapter ids in this slice: `cemetery`, `ashes-1` … `ashes-5`. Continue the pattern (`ashes-6`, then whatever your edition uses for the next part). Keep `order` strictly increasing.

Marker types: `bookshop`, `library`, `home`, `street`, `institution`, `event`.

Set `background: true` for historical or neighborhood places the reader now *knows about* but has not visited as a scene (Montjuïc Castle in chapter 3 is the model). Those pins respect the **Background places** toggle.

### Coordinates

Use real Barcelona positions. For invented interiors (Sempere & Sons, the Cemetery, Barceló’s apartment), pick the street or square literary walking routes already use, set `fictional: true` and `approximate: true`, and say so in `address`.

### Copy

Write a short original blurb. A few attributed words from the novel are fine; a paragraph of quotation is not.

## Prompt for extending the dataset

Paste this into an LLM with the chapter you have just read. Attach `src/data/types.ts` and the existing JSON files.

```
You are extending Book Maps, a spoiler-gated Barcelona companion for The Shadow of the Wind.

I have just finished chapter: [PART + CHAPTER TITLE / NUMBER].
Do not use anything that happens after that chapter. If you are unsure whether a fact is already revealed, omit it.

Return JSON patches only (new or updated objects) matching src/data/types.ts for:
- chapters.json (one new chapter object)
- locations.json
- journeys.json
- characters.json

Rules:
1. revealedIn must be this chapter’s id, or an earlier chapter id if the place already exists. Never a later id.
2. If a place already has a pin, do not duplicate it. Add a notesByChapter entry instead, still gated to this chapter.
3. No teaser pins, unnamed silhouettes, or “you will return here” copy.
4. Blurbs: 1–3 original sentences. No long novel excerpts.
5. Names: Catalan, Spanish, and English. Mark fictional vs real. Mark approximate coordinates.
6. lat/lng must be real WGS84 points in Barcelona (or say if a scene is not in the city and skip the pin).
7. Characters appear in characters.json only when the reader has met them or clearly heard their name. Fermín, Bea, Nuria, and others must not be added before they appear.
8. Journeys are paths the reader has actually walked in this chapter, as short arrays of {lat, lng}.
9. Types must be one of: bookshop, library, home, street, institution, event.
10. If the only new information is historical (a castle, a rumour about the war), use background: true.

After the JSON, list in one short paragraph what you deliberately left out because it would spoil later pages.
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Leaflet, OpenStreetMap. Static JSON only — no database, no auth, no Mapbox.
