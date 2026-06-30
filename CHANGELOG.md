# CHANGELOG — Eventer3

## [En cours]

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
