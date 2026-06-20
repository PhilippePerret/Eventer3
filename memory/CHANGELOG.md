# CHANGELOG — Eventer3

## 2026-06-20 (suite 3)

### FilePicker — bug frappe nouveau dossier
- `FilePicker._el` listener : `StopEvent` déplacé dans `_handleKey` après guard `_creatingFolder` — le `preventDefault` précoce bloquait la frappe dans l'input
- Test ajouté dans `filesystem/filepicker.spec.js` : `pressSequentially` pour valider la frappe réelle

## 2026-06-20 (suite 2)

### FilePicker — portage nouvelle architecture
- `ui/FilePicker.js` : listener keydown sur `this._el` (tabindex="-1" + focus) — plus de document capture
- `ListerListener` : touche `n` → `createNew()`
- `ProjectLister` (core) : `createNew()` — ouvre FilePicker, crée projet via `POST /api/listers/1/items`, met à jour `project_order`, recharge et sélectionne le nouveau projet
- Tests `filesystem/filepicker.spec.js` et `project/edit-project.spec.js` : 28/28 passent — remis en place depuis `_tdd/` avec marque `// Refactorisé — nouvelle architecture`

## 2026-06-20 (suite)

### Corrections bugs
- `PopupSelect.handleKeyDown` : ArrowDown ne propagait plus vers ListerListener — refacto HANDLED_KEYS / NOT_STOPPED_KEYS / StopEvent
- `DOM._applyValuesWidth` : largeur fixe sur champs select (basée sur le label le plus long) — évite le changement de taille à la sélection

### Nouveaux fichiers
- `utils/events.js` : `StopEvent(event)` extrait de DOM.js (évite import circulaire)
- `ui/KeyboardablePanel.js` : portée depuis public-old — keyboardController remplacé par document capture, même pattern HANDLED_KEYS/NOT_STOPPED_KEYS
- `ui/FilePicker.js` : portée depuis public-old — en cours (listener à déplacer sur `this._el` avec tabindex/focus)

## 2026-06-20

### Fonctionnel
- Édition projet : Enter entre en édition, Enter valide, Escape annule
- Tab cycle entre les champs PROPS en édition (title → state → type)
- Persistance du titre modifié après rechargement
- PopupSelect sur champs select : ArrowDown/Enter ouvrent le popup
- Ordre correct des options dans les popups (fix `[...DEV_STATES]`)
- Position de state/type stable lors de l'édition du titre (`flex:1` sur title)
- `__setup__.js` : suppression du `body.click()` post-navigation (ZERO MOUSE)
- Tests `_tdd/edit-project.spec.js` : 8/9 passent (1 en attente : FilePicker non porté)
- `tests/helpers/create-project-helper.js` : corrigé pour ZERO MOUSE
- `pane1(page).locator('body').press()` → remplacé par ciblage d'éléments réels dans les helpers

## 2026-06-19

### Réimplémenté
- `Item` + `ItemDom` (nouvelle architecture cible)
- `Lister` + `ListerDom` (nouvelle architecture cible)

### Fonctionnel
- Liste des projets s'affiche avec données PROPS
- Navigation ↑/↓ pour sélectionner un projet
