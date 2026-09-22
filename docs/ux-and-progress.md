# Reading progress and UX

A spoiler-free Barcelona map for *The Shadow of the Wind*. The map tracks the street the reader is standing on. Progress chrome and UX for that one book are covered here. Product scope lives in [project context](project-context.md).

**Shipped:** progress is a scene beat. The header is a place chip and **I’ve read further**. Unread beat titles stay hidden. The chapter slider lives behind **I’m in a numbered chapter**. Walk-back and **I am here** are on the map.

**Verdict:** there is no honest Kindle or Amazon hook for a third-party web app in 2026. Do not ship a Connect Kindle control. The closest path to “I took a bus to this street, open the map, see only up to that moment” is a curated scene-beat, with the map itself as the place you mark *here*, and a chapter slider only as a coarse fallback.

---

## 1. Kindle, WhisperSync, and third-party access

**No.** Official WhisperSync and page-level Kindle progress are not available to a third-party web app. Amazon keeps reading position, notes, and highlights on its own servers and syncs them among Kindle apps and devices on the same account. That loop does not open to outside clients.

| Path | What it actually is | Usable here? |
| --- | --- | --- |
| WhisperSync / Kindle Sync | Amazon-to-Amazon backup of position, notes, highlights | No. There is no public API. |
| Login with Amazon | OAuth for `user_id`, name, email, postal code | No. Profile only. |
| Creators API / Product Advertising API | Retail catalog: title, images, offers, browse nodes | No. Not a personal library. |
| Kindle for Web (`read.amazon.com`) | Browser reader for the account holder | No. Human UI, no partner API. |
| Kindle Notebook | Signed-in page of notes and highlights | No. Viewing and copy/paste only. Automating it is scraping. |
| Export / Share notes | Device or desktop notebook can email PDF/CSV when Sync is on | Reader-owned file, not live sync. Optional later helper. |
| `My Clippings.txt` | Plain text on an e-ink Kindle, copied over USB | Reader-owned file. Optional later helper. |
| Send to Kindle | Upload or email *into* a Kindle library | Wrong direction. No progress out. |
| Publisher APIs (Penguin Random House) | ISBN metadata, jacket, retail links, promotional copy | No reading position. |
| Amazon “request your data” | Slow personal-data export | Days later, not a product loop. |

### What Amazon documents

- **Sync / WhisperSync** backs up “reading position, notes, and highlights” to Amazon and shares them across *Kindle apps and devices on that account*. Turning Sync off disables sharing a reading position and Export/Share for notes. Kindle for Web still writes its own data to Amazon in that case; it still does not expose it to other software. Source: [Update Your Sync Settings for Kindle](https://www.amazon.com/gp/help/customer/display.html?nodeId=GGFEXXS8Z7DPJSTN).
- **Login with Amazon** scopes are `profile`, `profile:user_id`, and `postal_code`. The documented profile payload is `user_id`, `email`, `name`, and optionally `postal_code`. There is no Kindle-library or position scope. Source: [Customer Profile](https://developer.amazon.com/docs/login-with-amazon/customer-profile.html).
- **Creators API** (successor to Product Advertising API 5.0) offers `SearchItems`, `GetItems`, `GetVariations`, and `GetBrowseNodes` for the public catalog. Source: [Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction).
- **Kindle for Web** is a browser reader with its own notebook for notes, highlights, and bookmarks. Help covers reading and annotating, not partner access. Sources: [What is Kindle for Web?](https://www.amazon.com/gp/help/customer/display.html?nodeId=GCQEMKHLBENNKWU2), [View Your Notebook in Kindle for Web](https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=TS3oZMNGd9T0s62hVd).
- **Send to Kindle** accepts PDF, EPUB, and similar files through the web upload, approved email, official apps, or the Chrome extension. It is inbound document delivery. Source: [Learn About Sending Documents to Your Kindle Library](https://www.amazon.com/gp/help/customer/display.html?nodeId=G5WYD9SAF7PGXRNA).
- **Penguin Random House Enhanced API** returns title records by ISBN (jacket, format, characters, promotional content, retail links). It does not return a reader’s place in the book. Source: [Title resource](https://developer.penguinrandomhouse.com/docs/read/enhanced_prh_api/resources/Title).
- **Request your personal information** is an account-holder data export, not an integration. Source: [Request your personal information](https://www.amazon.com/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS).

### What the industry does instead

Readwise, which lives on Kindle highlights, states outright that Kindle offers no developer API and that their importer drives a browser extension through `read.amazon.com/notebook`. Source: [Import from Amazon Kindle](https://docs.readwise.io/readwise/docs/importing-highlights/kindle). Community clients that report `percentageRead` do it with session cookies, a device token, and Amazon’s private Cloud Reader endpoints. That is unauthorized access, it breaks, and it is out of bounds for this product.

### Highlights and clippings, precisely

These are real, reader-owned *annotation* exports. They are not a reading-position API.

- **Kindle Notebook** (`read.amazon.com/notebook`) shows cloud-synced highlights for store books. There is no documented export API. Publisher clipping limits (often roughly 10–20% of a title) can truncate what leaves Amazon.
- **Export / Share** from a Kindle notebook or the desktop app can email a PDF and sometimes a CSV to the account address, and only while Sync is on. That is a file the reader already possesses.
- **`My Clippings.txt`** lives in the documents folder of a physical e-ink Kindle. USB copy is the official transfer path. It records highlights and notes made *on that device*, including many sideloaded files, and it misses highlights made only in the phone app or Cloud Reader. Kindle apps and Fire tablets do not offer this file.
- Kindle “locations” are not print page numbers. They drift across editions and fonts. A highlight is also not “I am here”: people highlight a sentence and keep reading, or reread chapter one in a new year.

None of this justifies a fake sync badge.

---

## 2. Honest substitutes

Ranked for the north star: open the map after a bus ride and see Barcelona only up to that moment.

### 1. Scene beats (the product)

Give the book a spine finer than “Days of Ashes, Chapter 3.” A beat is a spoiler-safe moment the reader can recognize without a page number: *Dawn on Santa Anna*, *Barceló at Els Quatre Gats*, *Clara at the Ateneo*. Each beat unlocks the places, people, and routes that exist by then, and marks one current setting.

This is the only substitute that can feel like a street. Chapters in this novel are uneven: some stay in the shop, some walk half the city, some open a memory of Montjuïc without leaving the room. A chapter slider cannot tell those apart.

**Rule:** the picker never names a beat the reader has not reached. Unread titles are themselves spoilers. Already-passed beats stay visible so a returning reader can jump back. The one forward control is *I’ve read further*, which reveals the next title only after they take it.

### 2. The map as “I am here”

Once a place is on the map, tapping it can mean two different things. Default tap inspects. A distinct *I am here* action sets that place as the current setting when the beat allows it. That is the bus-stop gesture: you do not hunt a dropdown for “Chapter 5”; you put your finger on Carrer de Santa Anna.

If the street they want is still hidden, they are further along than the map. *I’ve read further* unlocks the next beat. Do not offer a search box that can type a future name.

### 3. “I’ve read further” as the daily verb

Most sessions are not “set progress.” They are “I read two more scenes on the metro.” One gold control that advances a single beat, with an undo, beats a slider. Hold or long-press for a catch-up sheet of locked-but-unlabeled steps (“advance 3 moments”) without previewing their names.

### 4. Chapter slider (fallback)

Keep it. Hide it behind *I’m in a numbered chapter*. It is the right tool when someone knows they finished Days of Ashes 4 and does not care about the street. It is the wrong tool to lead with. The first slice already treats chapters as the unit of progress and stores that id in `localStorage`; beats should become the stored unit, with each beat belonging to a chapter so the fallback still works.

### 5. Local annotation import (later, optional, browser-only)

A reader may drop `My Clippings.txt` or an Amazon-emailed CSV onto the page. Parse in the browser, keep the file on the device, match *The Shadow of the Wind* / *La sombra del viento*, and offer the latest clipping as a *suggested* beat — never as a silent update, never as “Kindle synced.”

Ship this only after beats exist. Mapping a Kindle location onto a chapter is a downgrade. Mapping it onto a beat, with the reader confirming, is useful. No account, no server, no database. Skip it if it starts to look like a second product.

### Do not bother

Print-page entry (Penguin vs Weidenfeld vs ebook “page 184”). Kindle location fields. Percentage sliders. Amazon data-request uploads. Goodreads. Anything that implies the map knows where the Kindle is.

---

## 3. The reading journey

Opinion: this companion should feel like a lamp you open beside the book, not a dashboard you configure. Progress is a place, then a time of day, then a chapter number if someone asks.

### First open

Land at dawn, 1945: the walk to the Cemetery of Forgotten Books, Sempere & Sons, almost nothing else. No book picker. No empty-state lecture.

The first sentence under the title is enough: later streets stay off the map. The progress chrome is a closed chip — *You are at dawn, 1945* — not an open dropdown of every chapter in the slice.

If `localStorage` is empty, stay at dawn. If it holds a beat, resume there and fly the map to the current setting. Do not ask them to log in.

A first-time reader who is already mid-book uses *I’ve already read further*. That opens the catch-up path: advance unlabeled beats, or the chapter fallback, never a list of future names.

### Daily return, while reading

This is the real product.

1. The chip still says where they were last night.
2. The map is already framed on that street.
3. They either tap *Still here* (or just start looking around) or tap *I’ve read further*.
4. The next beat’s title appears, new pins arrive, the gold ring moves, the inspector can speak to the new current setting.
5. They can undo once if they skipped ahead by accident.

That is the whole daily loop. Character filters, background places, and routes stay secondary. Do not make them re-select a chapter to see last night’s Barcelona.

Persist the beat id in `localStorage` the way the first slice already persists a chapter id. Same origin, same honesty: this browser, this book, no account.

### Current scene versus explore-the-past

Two modes. Do not collapse them into one slider position.

**You are here.** Default. One gold-ringed current setting. Visited places stay on the map, quieter. Routes so far may draw. The inspector’s first line is the current street, not a synopsis of the whole chapter. Future pins, names, and copy stay absent — not greyed, not “locked,” not teased.

**Walk back.** A deliberate look behind. The gold ring dims; the trail of already-visited places and routes brightens. Tapping an old pin tells the story as of *that* visit, not as of now. The spoiler gate does not move. Leaving walk-back restores the current street and recenters.

The existing toggles (*Routes so far*, *Background places*) belong to *You are here*. Background places are neighborhood texture the reader already has a right to — a fortress on the skyline, a café name in passing — not a sneak of the next plot street. Keep them optional and visually dashed, as the first slice does.

Character filters apply to people who have appeared by the current beat. Filtering is not time travel. It should not reveal a place that the beat has not unlocked.

### Progress control

Lead with the chip and *I’ve read further*. That pair is the dream.

- Chip label: place + time, not “Chapter 5.” Example shape: *Santa Anna · a watching street · 1945*.
- Tap the chip: a sheet of *reached* beats, grouped by part (The Cemetery of Forgotten Books, Days of Ashes, …). Selecting an older beat is walk-back-plus-gate: it *does* move progress backward, with a clear *Return to latest* if they only meant to look.
- *I’ve read further*: advances one beat. Long-press or “catch up” advances several unlabeled steps.
- *I’m in a numbered chapter*: the slider and the part/chapter list. Fallback, not the home control.
- Reset remains, and it should say what it does: back to dawn.

Empty: dawn, four quiet pins, inspector inviting a tap. Loading: the map may wait; the chip should not. Error: the map can fail without losing the stored beat; say the streets will not load, not that progress is gone.

Do not add accounts or a database to sync that chip across phones. One book, one browser, is the honest first product. A later local file import can *suggest* a beat; it still should not silently overwrite the chip.

---

## 4. Chrome that fits gothic Barcelona

The map is the book. Everything else is lamplight around it.

### Progress chrome

A brass chip in the header, serif place-name, small-caps part label. *I’ve read further* is a single lamp-gold control, always in the same thumb reach. Do not wrap it in a form. Do not look like a settings bar.

The first slice’s “I have read through” plus a chapter `<Select>` plus a slider is the fallback pattern wearing the lead costume. Demote that block. The chip replaces it.

### Overlay stacking (the dropdown bug)

The chapter menu can open underneath the map. That is not a one-off Select bug. It is the map and the chrome fighting over the same air.

Leaflet owns a tall z-index ladder inside the map pane (tiles, overlays, markers, popups, then controls near 1000). The first slice already treats filters as a map overlay at `z-[500]`. The header sits at `z-20`. A chapter menu that drops from the header into the map’s rectangle loses to that ladder.

Do not “fix” this by bumping one dropdown above 1000. The next victim will be a pin, the inspector, or the attribution.

**Contract:**

- Menus that must float over the map use a portal and a single documented overlay tier *above* Leaflet controls, or they do not float over the map at all.
- Progress does not float over the map. It opens a sheet or drawer from the header — same family as the mobile inspector — so it never enters Leaflet’s stacking context.
- Filters may stay on the map, but they are a panel, not a dropdown that escapes its panel.
- One overlay at a time: progress sheet, inspector sheet, filter panel. No stacked popovers.

Treat any future control the same way. If it is a list, it is a sheet. If it is a toggle, it may sit on the map.

### Map versus inspector

Desktop: the map is the stage; the inspector is a bound caption on the right, not a floating card. It stays put while the city moves. Current setting gets the gold ring and a short original blurb. Catalan, Spanish, and English names stay in that order. “Look at the street” remains a door out to the real city, not an in-app theater.

Mobile: the map fills the glass. The chip and *I’ve read further* stay in a compact header. Filters collapse behind a single control, as they do now. The inspector is the existing bottom sheet — keep that, and put the progress sheet in the same motion language (rise from below or drop from the header, dim the map, dismiss on the map tap). Do not add a second column.

Walk-back on a phone is a segmented control in the header chip, not a mode buried in filters.

### Atmosphere

Sepia, soot, brass. Current pin: a warm ring, as if a lamp found that corner. Past pins: the same language, less light, never greyed-as-disabled. Background pins: dashed, thinner. No badge that looks like a Kindle logo. No progress percentage. No “Chapter 5 of 5” countdown that advertises how much map is left in the slice.

Copy stays original and short. The inspector may attribute a few words. It does not reprint the novel.

Empty, loading, and error states should sound like the city, not like a framework: *Unfolding Barcelona…*, *These streets will not load. Your place is still marked.*, *No places for this person yet.*

### What the first slice already got right

Spoiler gating by omission. Gold ring for the current setting. Trilingual names. Character filters limited to people who have appeared. Background places as a toggle. Mobile inspector as a sheet. Local-only progress. Keep those. Change the unit of progress and the way chrome sits on the map.

---

## What not to build

- A Connect Kindle, WhisperSync, or “sync with Amazon” control.
- Anything that reads `read.amazon.com` on the reader’s behalf.
- Greyed future pins, locked names, or a count of hidden streets.
- Accounts, a database, or cross-device sync for a chapter id.
- A multi-book library.
- Long quotations, page-number fields for every edition, or a percentage slider dressed up as a street.
