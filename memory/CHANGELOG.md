# CHANGELOG — Eventer3

## 2026-06-23 (suite)

### Navigation projets → events → sous-events

**`public/classes/models/abstract/Item.js`**
- `enterChildren()` : `project_id = this.project_id ?? this.parentLister?.project_id ?? this.id` — fallback sur `this.id` pour les Project items (leur UUID = project_id de l'EventLister enfant)

**`public/classes/models/abstract/ItemRepo.js`**
- `save()` : ajout `?project_id=` depuis `item.project_id ?? item.parentLister?.project_id` — sans ça, PATCH `/api/items/eN` renvoyait 500

**`public/classes/utils/DOM.js`**
- `_normalizeValues(values)` : normalise `field.values` en `[{value,label}]` quelle que soit la forme (objet plain, tableau de primitifs, tableau `{value,label}`)
- `buildSelect()`, `buildEditSelectField()`, `_applyValuesWidth()` : utilisent `_normalizeValues`
- `BLOCKED_KEYS_IN_CONTENTEDITABLE` + `blockKeysFromContenteditable(e)` : stoppe ArrowUp/ArrowDown dans les champs contenteditable
- `buildEditTextField()` : attache `blockKeysFromContenteditable` sur `keydown`
- `export { stopEvent } from './events.js'` → `import { stopEvent } from './events.js'` (portée locale)

**`public/classes/models/abstract/ItemDom.js`**
- `_buildContent()` : body reçoit la classe `child-indicator` si `item.lister_id` est défini

**Tests**
- `tests/specs/e2e/keyboard/navigation-basique.spec.js` : navigation projets→events→sous-events→retour (vert)
- `tests/specs/e2e/_tdd/arrow-during-title-editing.spec.js` : ArrowUp/Down bloqués pendant édition + titre persisté en mémoire et en DB (4 tests verts)

## 2026-06-23

### Architecture DOM — refonte générique par PROPS + warper

**`public/classes/models/abstract/ItemDom.js`**
- `get minClass()` : getter centralisé `item.constructor.name.toLowerCase()`
- `build()` : crée le div `${minClass}-item` puis délègue à `_buildContent(el)`
- `_buildContent(el)` : génère `item-check-gutter ${minClass}-check-gutter`, `item-body ${minClass}-body`, et sous-groupes `item-${warper} ${minClass}-${warper}` selon `field.warper` dans PROPS. Champs avec `warper:'body'` (ou sans warper) vont directement dans body.
- `startEditing()` : sélecteur CSS via `field.cssClass ?? (field.warper ? \`${minClass}-${field.name}\` : \`${minClass}-item__${field.name}\`)`
- `stopEditing()` : appelle `_buildContent(el)` après `innerHTML = ''`
- Suppression `?? []` sur `this.item.PROPS` (crash volontaire si absent)

**`public/classes/utils/DOM.js`**
- `_fieldEl()` : classe CSS = `field.cssClass ?? (field.warper ? \`${minClass}-${field.name}\` : \`${minClass}-item__${field.name}\`)`
- `buildEditSelectField()` : `multi: field.multiple ?? false` passé à PopupSelect

**`public/classes/models/core/Event.js`**
- PROPS : `warper:'body'` sur title, `warper:'left-col'` sur state/meteo/effet
- `onchange`/`onchoose` sur meteo et effet
- Import `EVENT_STATE` (singulier) au lieu de `EVENT_STATES`

**`public/classes/models/core/Project.js`**
- PROPS : `warper:'body'` sur title, `warper:'left-col'` sur state et type

### CSS — classes génériques item-*

**`public/styles.css`**
- `event-check-gutter` → `item-check-gutter`, `event-check` → `item-check` (génériques)
- `event-body` → `item-body` (générique) ; `.item-body { display:grid; grid-template-columns:1fr auto auto }`
- `event-col2` → `item-left-col` (générique) ; `event-col1` supprimé (orphelin)
- `event-text` → `event-title` (cohérence `${minClass}-${field.name}`)
- `.selected .item-body` et `.editing .item-body` : sélecteurs génériques (plus `event-item.selected`)
- `#main-panel.roman-man/.film-man .selected .item-body` → `#main-panel.man .selected .item-body`
- TODO : appliquer `.man` à `#main-panel` pour tous les listers de type "manuscrit"
- `.project-check-gutter { display:none }`, `.project-body { flex:1 }`
- `.project-item__title` → `.project-title`, `.project-item__id` → `.project-id`

## 2026-06-22 (suite)

### EventLister / Event — squelettes nouvelle archi
- `public/classes/models/core/Event.js` : créé, PROPS `[{ name:'title', type:'text' }]`
- `public/classes/models/core/EventLister.js` : créé, `ITEM_CLASS=Event`, `CHILD_CLASS=EventLister`, `TYPE='events'`

### Item.enterChildren() — auto-create premier item
- Si `child.items.length === 0` après chargement : `await child.createNew()` (un lister ne peut pas être vide)

### Lister.leaveToParent() — guard supprimé
- `if (!parent) return` retiré : `parentLister` est TOUJOURS défini, le guard masquait les bugs silencieusement

### Test project-navigation-lister — réécriture
- Fixture `many-projects` → `two-projects-events` (Projet A : 3 events, Projet B : 2 events)
- `press('ArrowRight')` sur `.project-item.selected` (ItemListener, pas container)
- `press('Enter')` sur `.event-item.selected` (ItemListener, pas container)
- Test toujours en échec : 7 events reçus au lieu de 4 — création d'event non encore implémentée nouvelle archi

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
- `FilePicker._el` listener : `stopEvent` déplacé dans `_handleKey` après guard `_creatingFolder` — le `preventDefault` précoce bloquait la frappe dans l'input
- Test ajouté dans `filesystem/filepicker.spec.js` : `pressSequentially` pour valider la frappe réelle

## 2026-06-20 (suite 2)

### FilePicker — portage nouvelle architecture
- `ui/FilePicker.js` : listener keydown sur `this._el` (tabindex="-1" + focus) — plus de document capture
- `ListerListener` : touche `n` → `createNew()`
- `ProjectLister` (core) : `createNew()` — ouvre FilePicker, crée projet via `POST /api/listers/1/items`, met à jour `project_order`, recharge et sélectionne le nouveau projet
- Tests `filesystem/filepicker.spec.js` et `project/edit-project.spec.js` : 28/28 passent — remis en place depuis `_tdd/` avec marque `// Refactorisé — nouvelle architecture`

## 2026-06-20 (suite)

### Corrections bugs
- `PopupSelect.handleKeyDown` : ArrowDown ne propagait plus vers ListerListener — refacto HANDLED_KEYS / NOT_STOPPED_KEYS / stopEvent
- `DOM._applyValuesWidth` : largeur fixe sur champs select (basée sur le label le plus long) — évite le changement de taille à la sélection

### Nouveaux fichiers
- `utils/events.js` : `stopEvent(event)` extrait de DOM.js (évite import circulaire)
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
