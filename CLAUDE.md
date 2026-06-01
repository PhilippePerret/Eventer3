# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Start the server** (from project root):
```bash
ruby ./app.rb
# or with bundler:
bundle exec ruby app.rb
```
Server runs on `http://127.0.0.1:4567`.

**Kill the server:**
```bash
pkill -9 ruby
```

**Run all e2e tests** (from `tests/` directory):
```bash
cd tests && npm test
```

**Run unit tests only:**
```bash
cd tests && npm run test:unit
```

**Run tests in headed mode (browser visible):**
```bash
cd tests && npm run test:headed
```

**Run a single e2e spec:**
```bash
cd tests && npx playwright test specs/e2e/app/start-up.spec.js
```

The Playwright config auto-starts the server if not already running. Tests are always run from the `tests/` directory.

---

## Architecture

Eventer3 is a **local-first**, keyboard-driven event-list manager for film/novel projects. Backend: Ruby Sinatra. Frontend: vanilla JavaScript (ES modules), no framework, no build step.

### Backend (`app.rb`, `lib/`)

Minimal Sinatra app. Responsibilities: serve `public/`, and expose `GET /data/*` and `PATCH /data/*` routes for JSON file I/O. All business logic lives in the frontend.

`Bootstrap.ensure_initial_data!` runs on every request to guarantee `data/projects.json` and its items exist.

### Frontend (`public/`)

Entry: `public/index.html` → `public/app.js` → `App.start()` → `Projects.init()`.

All frontend classes live under `public/classes/`:
- `models/` — `Lister`, `Item`, `Projects`, `Project` (and future `Event`, `Brin`, `Perso`)
- `repositories/` — `ListerRepository` (PATCH/PUT to server), `Mapper` (key compression)
- `system/` — `LOG`, `Error`, `Texte`
- `KeyboardController.js` — global keyboard dispatcher

---

## The Lister / Item Abstraction

**Everything in this app is either a `Lister` or an `Item`.** This is the single most important architectural fact.

- A `Lister` holds an ordered list of `Item`s and handles rendering, keyboard navigation, and persistence of that list.
- An `Item` represents one row. An `Item` may optionally own a `Lister` (`hasLister: true`), making the structure recursively nestable to arbitrary depth.
- `Projects < Lister`, `Project < Item`. Future: `EventLister < Lister`, `Event < Item`, `BrinLister < Lister`, `Brin < Item`, etc.

Both Ruby (`lib/models/`) and JavaScript (`public/classes/models/`) have mirrored `Lister` and `Item` base classes.

---

## Persistence Model

Data lives in `data/` as JSON. The path hierarchy mirrors the runtime nesting:

```
data/
  projects.json          ← root Lister definition
  projects/
    __items.json         ← all Project items for the root Lister (array, order = display order)
    <item-id>.json       ← Lister definition for an item that has hasLister=true
    <item-id>/
      __items.json       ← items of that sub-Lister
      ...                ← infinitely recursive
```

**Critical rules (never violate):**
- Paths are **never stored in data**. They are always derived at runtime from `contextPath` (the chain of ids from root to current Lister).
- No breadcrumbs, no stored paths, no path concatenation outside of `contextPath`.
- `__items.json` is an array; array order is the display order.
- Item data is persisted with **short keys** (see `Mapper.js`): `tt`=title, `hl`=hasLister, `ty`=type, `co`=color, `st`=state, `id`=id, etc. `ItemDataMapper.toRuntime()` / `toPersistence()` convert between the two forms.

---

## KeyboardController

`KeyboardController` owns a **mode stack**. Normal mode dispatches arrow keys, `n`, `⌘↑↓` to `activeLister`. `item-edition` mode routes all keys to the item's editor handler.

- `n` → create new item (inserts editor above current selection)
- `↑`/`↓` → select previous/next item
- `⌘↑`/`⌘↓` → move selected item up/down (save is debounced 300 ms)
- `Enter` → confirm edition / commit new item
- `Escape` → cancel edition

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

- **TDD strict** : les tests sont écrits EN PREMIER, donc ils échouent intentionnellement. Un test qui échoue n'est PAS un bug à corriger immédiatement — c'est la phase RED normale du cycle RED→GREEN→REFACTOR. Ne jamais paniquer face à des tests rouges, ne jamais "corriger" un test qui échoue sans avoir d'abord compris qu'on est en phase RED. Implémenter le code pour faire passer les tests, pas l'inverse.
- `dev/Tests.md` liste ce qui reste à tester.
- Verbose logging: `LOG.on(level)` (1–4), `LOG.m(level, message, data)`. Currently set to level 4 in `App.start()`.
- Keyboard-first: every action must be doable without a mouse.
- No unnecessary complexity. If it can be handled by `Lister`/`Item`, don't add a new abstraction.
