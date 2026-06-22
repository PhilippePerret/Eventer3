# CHANGELOG — Eventer3

## 2026-06-22

### Suppression projet — confirmation cascade
- `ConfirmDialog` : paramètre générique `expectedValue` (input à valider avant confirmation)
- `ListerRepo.countDescendants(item)` : `GET /api/listers/:id/items/:item_id/descendants/count?project_id=`
- `Lister.deleteSelected()` : si `cascadeCount > 0`, ouvre `ConfirmDialog` avec `expectedValue: cascadeCount`
- `DB::Repo.collect_descendants_in_db` : détection UUID vs e{N}, requêtes ciblées par étape (plus de SELECT * FROM listers)
- `project_meta` : colonne `id` (pas `item_id`) — corrigé dans la query initiale
- Tests : `project/project-keyboard-delete.spec.js` (11 tests verts dont 5 cascade)

### Lister — navigation circulaire
- `selectPrev()` : ArrowUp sur premier item → sélectionne le dernier
- `selectNext()` : ArrowDown sur dernier item → sélectionne le premier

### ListerDom — attach() séparé du render()
- `render()` : suppression de `this.lister.Listener.attach(container)` — n'appartient pas au rendu
- `ProjectLister.init()` : ajout explicite de `lister.Listener.attach(lister.Dom.container)` après `render()`
- Corrige : ArrowUp/ArrowDown sautait de 2 en 2 après création/import projet (double listener)

### FilePicker — "Choisir" non cliquable
- `_selectBtn` : `button` → `span`, suppression du listener `click`
- `styles.css` `.file-picker__select-btn` : `cursor: pointer` → `cursor: default`

### ProjectLister — focus après annulation ConfirmDialog
- `createNew()` : `if (!choice) return` → `if (!choice) { this.Dom.focusSelected(); return }`

## 2026-06-21 (suite 2)

### FilePicker — refactoring conformité règles

- `Escape` ne ferme plus le picker en mode normal (reste valide pendant création dossier)
- Tab cycle : Liste → `.file-picker__path` (menu chemin) → faux-btn `Annuler` → Liste
  - `_focusableItems` avec `focusClass` dédié par élément (`file-picker__path--focused` / `ftpanel-btn--focused`)
  - `file-picker--btns-focused` sur `_el` quand un bouton est focusé → liste visuellement inactive (opacity 0.45)
- Bouton `↩︎` → "Choisir" repositionné au-dessus de la liste (à droite) dans `.file-picker__header`
- `<kbd>␛</kbd>` remplacé par faux-btn `Annuler` (`span.ftpanel-btn`) dans footer
- `.file-picker__path` : affiche le nom du dossier courant, ouvre `PopupSelect` (`showSearch:false`) sur Enter ou ArrowDown
- `_pathMenuEl` maison supprimé — tout passe par `PopupSelect`
- Bouton "Récents" supprimé
- Titre fixe "Choisir un dossier" dans titlebar
- ArrowLeft/Right bloqués quand `_focusIdx >= 0` (chemin ou Annuler focusé)
- `n` et `N` créent un nouveau dossier dans le picker
- `ProjectLister.createNew()` : appelle `this.Dom.focusSelected()` après annulation
- 4 règles CSS ajoutées : focus path, select-btn à droite, liste inactive, selected grisé
- `_tdd/filepicker.spec.js` réécrit — 31 tests verts

### ListerListener — N = n
- `N: { nokey: 'createNew' }` ajouté explicitement

## 2026-06-21 (suite)

### KeyboardablePanel — focus à l'ouverture
- `open()` : ajout de `this._el.focus()` après attachment du listener — sans ça, les keydown (Tab, Enter) n'arrivaient jamais à l'élément KP en situation réelle

### KeyboardablePanel — cycle Tab deux cas
- `open()` : `_footerFocusIdx = _getItemCount() > 0 ? -1 : 0` (cas A items / cas B sans items)
- `_handleKey Tab` : wrap vers `-1` (cas A) ou `0` (cas B) selon `_getItemCount()`

### ListerRepo — méthodes statiques createLister / createItem
- `static async createLister(fields)` : `POST /api/listers`
- `static async createItem(listerId, fields, { project_id })` : `POST /api/listers/:id/items`

### Tests _tdd/open-existing-project
- Test "confirmer l'ouverture" séparé en deux : import seul / ArrowRight → event-list

## 2026-06-21

### Rationalisation CSS panneaux — ftpanel/kpanel
- Toutes les classes `.floating-panel` et `__*` renommées en `.ftpanel` et `__*`
- `.ftpanel__zone` → `.ftpanel__body` (padding 2em inclus)
- Suppression de l'élément `__separator` (filet assuré par `border-bottom` du titre et `border-top` du footer)
- Tout le bloc `.confirm-dialog` et `__*` supprimé (CSS mort ou doublon)
- `.panel-btn` et variantes → `.ftpanel-btn`, `.ftpanel-btn--danger`, `.ftpanel-btn--cancel`
- Clé `variant` → `type` dans les objets bouton
- `primary`/`secondary` supprimés : seuls `danger` et `cancel` existent comme types
- Bouton focusé par défaut à l'ouverture : `_footerFocusIdx = 0` dans `open()` → `_updateFooterFocus()`
- Ordre boutons = droite à gauche (index 0 = droite = focusé par défaut)
- Variables : `--dialog-font-size`, `--panel-title-font-size`, `--panel-btn-font-size`, `--ftpanel-padding-x` ; `--btn-danger-*` remplace `--btn-secondary-*`
- `ProjectLister` : boutons réordonnés (Importer, Détruire, Annuler) avec types corrects
- `app-frame.html` : `#constants-panel` → classe `ftpanel`

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
