---

## 🧠 Overview: What Is Eventer3?

**Eventer3** is a lightweight, **local-first application** designed to help users manage complex storytelling
elements (like events, characters, scenes) in **film or novel projects**, using an intuitive keyboard-driven
interface.

- **Backend:** Ruby Sinatra
- **Frontend:** Vanilla JavaScript (ES modules), no framework, no build process
- **Persistence:** SQLite (données application : `./data/main.db`, données de chaque projet : dans son `eventer.db`)

---

## 🏗️ Architecture

### Core Concepts

Everything in Eventer3 is either:
- A **Lister** – like a folder that holds other items.
- An **Item** – like a file or subfolder within a Lister.

This structure supports recursive nesting of content (<FAUX> : e.g., Projects → Brins → Events → Persos</FAUX> <VRAI>:L’imbrication ne se fait que par élément de même type sauf pour la liste de départ : les Projects</VRAI>).

**Projects** → Events → Events → Events → Events → Events → …

Pour le moment, les imbrications ne fonctionnent que pour le events, mais  plus tard, elle fonctionnera aussi pour les autres éléments : 

Brins → Brins → Brins → Brins → …

Persos → Persos → Persos → Persos → Persos → …

### Data Flow

- The backend runs a minimal Sinatra app:
  - Serves static files from `public/`
  - Exposes routes:
    - `GET /data/*` – for fetching data
    - `PATCH /data/*` – for saving changes

- On every request, it ensures initial data exists via:
  ```ruby
  Bootstrap.ensure_initial_data!
  ```

### Frontend Structure

Entry point:
```html
public/index.html → public/app.js → App.start() → ProjectLister.init()
```

All frontend logic lives under `public/classes/`:

| Folder                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `models/`               | Lister, Item, ProjectLister, Project, Brin, Perso |
| `repositories/`         | Handles persistence via PATCH requests to server  |
| `system/`               | LOG, Error, Texte utilities                       |
| `KeyboardController.js` | Centralized keyboard handling with mode stack     |

---

## 🔑 Keyboard Navigation

A global `KeyboardController` manages keybindings based on current **mode**:

### Modes
- **Normal Mode**: Handles navigation and creation.
- **Item Edition Mode**: Routes all input to item editor.

### Key Shortcuts

| Key         | Action                             |
| ----------- | ---------------------------------- |
| `n`         | Create new item                    |
| `↑` / `↓`   | Navigate between items             |
| `⌘↑` / `⌘↓` | Move selected item up/down         |
| `Enter`     | Confirm edition or create new item |
| `Escape`    | Cancel edition                     |

> Full keyboard spec in: `dev/Specs-Keyboard.md`

---

## 🧪 Testing

### End-to-End (E2E) Tests with Playwright
- All specs must import from `__setup__.js`
- Uses fixtures via `installFixtures(fixtureName)`
- Backup & restore of `data/` folder before/after test runs

### Unit Tests
- Node built-in test runner (`node --test`)
- Located in: `tests/specs/unit/`
- Ruby tests: `tests/ruby/`

---

## 🧱 Development Philosophy

1. **TDD Strict**: Write tests first.
2. **Verbose Logging**: Enabled with `LOG.on(level)` and `LOG.m(level, message, data)`
3. **Avoid Over-Abstraction**: If functionality can be handled by existing `Lister` or `Item`, don’t add a new abstraction.

---

## 📁 File System Layout

```
./CLAUDE.md          	# Claude documentation file
./app.rb             	# Main Sinatra app
./data.main.db				# App database
./lib/               	# Backend models and logic
./public/            	# Frontend assets
  └── index.html     	# Entry point
  └── app.js         	# JS entry script
  └── classes/
      ├── models/
      ├── repositories/
      └── system/
./tests/             	# Test suite
  ├── e2e/
  ├── specs/unit/
  └── fixtures/
```

---

## ✅ Summary

Eventer3 is a **simple yet powerful** tool for organizing narrative content through nested lists and keyboard interaction. It’s ideal for writers, screenwriters, or creators working on long-form storytelling projects.

It emphasizes:
- Local-first design
- Minimalist architecture
- Keyboard-driven workflow
- Strong test coverage (both unit and E2E)
- Clean separation between frontend and backend

---