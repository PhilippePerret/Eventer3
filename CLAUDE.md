# CLAUDE.md

- User runs server
- Userruns tests

Server runs on `http://127.0.0.1:4567`.

Tests are always run from the `tests/` directory.

---

## Architecture

Eventer3 is a **local-first**, keyboard-driven event-list manager for film/novel projects. Backend: Ruby Sinatra. Frontend: vanilla JavaScript (ES modules), no framework, no build step.

### Persistance

- SQLite
- data in ./data/eventer.db 

### Backend (`app.rb`, `lib/`)

Minimal Sinatra app. Responsibilities: serve `public/`, and expose `GET /data/*` and `PATCH /data/*` routes.

`Bootstrap.ensure_initial_data!` runs on every request to guarantee `data/eventer.db`.

### Frontend (`public/`)

Entry: `public/index.html` → `public/app.js` → `App.start()` → `ProjectLister.init()`.

All frontend classes live under `public/classes/`:
- `models/` — `Lister`, `Item`, `ProjectLister`, `Project`, `Brin`, `Perso`
- `repositories/` — `ListerRepository` (PATCH/PUT to server)
- `system/` — `LOG`, `Error`, `Texte`
- `KeyboardController.js` — global keyboard dispatcher

---

## The Lister / Item Abstraction

**Everything in this app is either a `Lister` or an `Item`.** This is the single most important architectural fact.

### Finder analogy

- A `Lister` is like a Folder in the Finder
- A `Item` is like a Folder or a File in the a `Lister` (Folder in the Finder)
- A `Folder` is a `Item` with a `Lister`

### So

- A `Lister` holds an ordered list of `Item`s and handles rendering, keyboard navigation, and persistence of that list.
- An `Item` represents one row (displaying). An `Item` may optionally own a `Lister` (`lister_id`), making the structure recursively nestable to arbitrary depth.
- `ProjectLister < Lister`, `Project < Item`, `EventLister < Lister`, `Event < Item`, `BrinLister < Lister`, `Brin < Item`, etc.

Both Ruby (`lib/models/`) and JavaScript (`public/classes/models/`) have mirrored `Lister` and `Item` base classes.

---

## KeyboardController

`KeyboardController` owns a **mode stack**. Normal mode dispatches arrow keys, `n`, `⌘↑↓` to `activeLister`. `item-edition` mode routes all keys to the item's editor handler.

- `n` → create new item (inserts editor above current selection)
- `↑`/`↓` → select previous/next item
- `⌘↑`/`⌘↓` → move selected item up/down (save is debounced 300 ms)
- `Enter` → confirm edition / commit new item
- `Escape` → cancel edition
- and more in dev/Specs-Keyboard.md

`Lister.render()` calls `keyboardController.register(this)` to set the active lister.

---

## Tests

### E2E (Playwright)

All Playwright specs **must** import from `__setup__.js`, never directly from `@playwright/test`:
```js
import { test, expect } from '../../e2e/__setup__.js'
// adjust relative path based on spec depth
```

`global-setup.js` backs up `data/` to `.data_before_tests/` and replaces it with `tests/data_ini_state/` before each run. `global-teardown.js` restores it.

To load custom fixtures inside a test, use `installFixtures(fixtureName)` from `tests/helpers/install-fixtures.js` — it copies from `tests/fixtures/<name>/` to `data/`.

### Unit tests

Node built-in test runner (`node --test`). Files in `tests/specs/unit/`.

---

## Development Philosophy

- **TDD strict** : tests first. Test -> RED -> Code -> GREEN.
- **Verbose logging**: `LOG.on(level)` (1–4), `LOG.m(level, message, data)`. Currently set to level 4 in `App.start()`.
- If it can be handled by `Lister`/`Item`, don't add a new abstraction.
