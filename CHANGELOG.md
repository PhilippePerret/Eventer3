# CHANGELOG — Eventer3

### ContextualHelp — hint ⌘+v clipboard (30/06/2026)

**Fichiers modifiés :**
- `public/classes/ui/ContextualHelp.js` — import `Clipboard` + `_buildShortcuts()` ajoute `{ sc:'⌘+v', ef:'Coller' }` si `Clipboard.isCompatible(item.minClass)` ; suppression `console.log` debug
- `tests/specs/e2e/app/contextual-help.spec.js` — migration `locator.press` → `press(page,key)` ; 3 tests clipboard ajoutés

**Fonctionnalités :**
- `⌘+v` apparaît dans l'aide contextuelle uniquement si le clipboard contient un item compatible avec le contexte courant

---

### TargetsManager + TargetsPanel — migration nouvelle architecture (30/06/2026)

**Fichiers créés :**
- `public/classes/ui/TargetsManager.js` — gestion liste des cibles (add, moveUp/Down, pin, save via `/api/items/:id`)
- `public/classes/ui/TargetsPanel.js` — panneau flottant (`KeyDispatcher`, insertion `[title](id)` dans contenteditable)
- `tests/specs/e2e/links/targets-link.spec.js` — tests mémorisation + insertion lien
- `tests/specs/e2e/links/targets-pin.spec.js` — tests pinning, réordre, persistance

**Fichiers modifiés :**
- `public/classes/models/abstract/Item.js` — `EDITION_HANDLED_KEYS` + `!ev.metaKey` dans `onkeydown` (laisse passer `⌘+k`)
- `public/classes/models/listen/Item.js` — `k: { nokey: 'memoAsTarget', meta: 'openTargetsPanel' }`
- `public/classes/models/dom/Item.js` — `memoAsTarget()` + `openTargetsPanel()`
- `public/classes/models/core/Project.js` — `targetsManager` lazy getter + `targetsManager.load()` dans `enterInside()`

**Fonctionnalités :**
- `k` sur item sélectionné → mémorise la cible (notification)
- `⌘+k` en édition → ouvre TargetsPanel
- `↓`/`↑` navigue dans le panneau, `⌘↓`/`⌘↑` réordonne / pine
- `↩︎` insère `[title](id)` au curseur dans le champ contenteditable, sélectionne le titre
- `⌘↩︎` ferme le panneau sans insérer
- Persistance : `link_targets` sauvegardé dans `project_meta` via PATCH

---

### Panneau styles — migration nouvelle architecture (30/06/2026)

**Fichiers créés :**
- `public/classes/models/core/Style.js` — `Style extends Item` (id=name, css=string, PROPS=[])
- `public/classes/models/dom/Style.js` — mixin `_buildContent` (lettre a/b/…, preview textuel)
- `public/classes/models/core/ListerStyle.js` — lister du panneau styles (CHECK_KEY='css', PANEL_ID='style-panel')
- `public/classes/models/listen/Style.js` — `ListerStyleLi` (s=closePanel ; ⌥↓/⌥↑ via ListerLi)
- `tests/specs/e2e/apparence/style-panel.spec.js` — 31 tests (ouverture, navigation, cocher/décocher, CSS immédiat, ordre, ⌥↓/⌥↑, persistance)

**Fichiers modifiés :**
- `public/classes/models/core/Event.js` — `css: []` dans constructor + prop `{ name:'css', type:'no-edit' }`
- `public/classes/models/dom/Event.js` — `openStylePanel()` + `_afterBuild()` (CSS au build)
- `public/classes/models/dom/Item.js` — hook `_afterBuild?.()` après `attach(el)`
- `public/classes/models/core/Project.js` — `listerStyle` lazy getter + `load()`/`build()` dans `enterInside()`
- `public/classes/models/abstract/Lister.js` — `backgroundNext/Prev/_switchBackground` (communs à tous les panneaux)
- `public/classes/models/listen/Lister.js` — `alt:'backgroundPrev/Next'` sur ArrowUp/Down (ListerLi)

**Fonctionnalités :**
- `s` sur ListerEvent → ouvre panneau styles pour l'event sélectionné
- `s` sur panneau actif / `⌘+Enter` → ferme le panneau
- `↓`/`↑` navigue entre styles, `⌘↓`/`⌘↑` réordonne
- `Space` coche/décoche un style → CSS injecté immédiatement sur `.event-title`
- `⌥↓`/`⌥↑` — passe à l'event suivant/précédent en fond, styles mis à jour
- Persistance : `ev.css` sauvegardé via `ev.scheduleSave()`, CSS réappliqué au rechargement via `_afterBuild`
