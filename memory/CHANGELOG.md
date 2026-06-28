# CHANGELOG — Eventer3

## 2026-06-28 — Panneau persos : openPanel, toggle générique, marques factorisées

- **`ListerPerso.openPanel(contextItem)`** implémenté : pose `_directIds` (= `contextItem.perso_ids`)
  et `_inheritedIds` (Event seulement : union des `perso_ids` des brins via `itemsById['brins']`,
  distinction `contextItem.minClass === 'event'`), `load` si besoin, `_syncChecked`, detach appelant, render.
  Invariant noté : persos directs d'un Event ∩ persos de ses brins = ∅ (pas de guard).
- **`dom/Item.js toggleChecked`** recâblé (était cassé, `ctx` undefined) — **générique** pour tous les
  panneaux : `parentLister._canToggle(this)`, écrit `ctx[parentLister.CHECK_KEY]` (`brin_ids`/`perso_ids`),
  `parentLister._afterToggle(this, ctx)`, `ctx.scheduleSave()`. `ctx = parentLister.contextItem`.
- **Marques persos factorisées** (zéro duplication) : `persosMarks()` + `refreshPersosMarks()` partagés
  dans `dom/Item.js` ; seul l'ensemble d'ids diffère via `_persoIdsForMarks()` (défaut = `perso_ids` pour
  Brin ; Event override = direct + hérités). Lookup `this.project.itemsById['persos']`, marque via
  `p.markOf?.()` (méthode d'instance) → **aucun import circulaire**.
- **`ListerPerso._afterToggle`** = `ctx.refreshPersosMarks()` (refresh direct, responsabilité à l'item) ;
  l'ancien bloc « MERDIQUE » (sélecteur `.event-persos-marks` codé en dur, `_contextBrin` fantôme) supprimé.

## 2026-06-28 — Généralisation `byId` / `Project.itemsById` (concept utilisateur)

- **Table `{id → item}` centralisée dans la base `Lister`** (`abstract/Lister.js`), nom uniforme `byId`.
  Tenue à jour génériquement : init au constructeur, construction en bloc dans `load()`, ajout unitaire
  dans `_afterCreate(result)` (appelé via `Item.js` à la création), suppression dans `deleteSelected`.
  → Plus aucune duplication par sous-type de Lister.
- **`ListerBrin`** : suppression de la table d'instance `this.brins` et de son `_afterCreate`/`_afterLoad`
  spécifiques (la base gère `byId`). `_refreshEventMarks` lit `this.byId`.
- **`ListerPerso`** : suppression du `static pool` et du peuplement dans `_afterLoad` (base gère `byId`).
- **`Project.itemsById`** : getter `{ brins: listerBrins.byId, persos: listerPersos.byId }` — **seul point**
  à maintenir si on ajoute une classe d'item.
- **`abstract/Item.js`** : suppression du getter `projectBrins` (remplacé par `this.project.itemsById[type]`).
- **`dom/Event.js`** (`persosMarks`/`brinsMarks`) : lit `this.project.itemsById['brins'|'persos']`.
- **Suppression du legacy `ListerEvent.brins`** : `ListerEvent._afterLoad` faisait un fetch séparé de tous
  les brins du projet (doublon de `listerBrins.byId`, chargé par `enterInside` avant les events) ; le
  fallback `rawBrins` dans `persosMarks` qui le lisait a aussi été retiré.

## 2026-06-28 — Stabilisation après tentative point-2 ratée

- **`repo/Lister.js` `countDescendants`** : `const query = project ? ...` référençait
  `project` non déclaré (crash `ReferenceError`) → corrigé en `pid` (la const ligne au-dessus,
  `this.project.id ?? item.id`). Rôle de la méthode : compter les descendants côté serveur
  (`/api/listers/:id/items/:item_id/descendants/count?project_id=…`) pour l'avertissement de
  destruction en cascade dans `Lister.deleteSelected`. Le fallback `item.id` couvre `ListerProject`
  (pas de projet parent : le projet supprimé EST l'item).
- **`core/ListerBrin.js`** : la migration point-2 (`open(eventItem)` → `openPanel`/`closePanel`,
  suppression `listerEvent`) avait introduit des régressions (`deleteSelected` cassé, `_afterToggle`
  supprimé à tort, refresh-fermeture appliqué aux brins par erreur) → **rollback** vers `bc7f487`
  (`git checkout`, commit `a6a5946 "Récupération du fichier"`), **puis refaite proprement** :
  - `open(eventItem)` → `openPanel(contextItem)` + `closePanel()` ; `contextItem` = item d'ouverture.
  - Suppression `listerEvent` / `selectedEvent` / override `_fetchData`.
  - Brins = refresh **direct** au toggle (`_afterToggle` → `_refreshEventMarks`) — conservé.
- **Suppression de `ListerBrin.pool`** (static partagé : risque de clobber multi-projet + doublon de
  `this.items`) → table d'**instance** `this.brins` ({id → brin}), peuplée dans `_afterLoad` /
  `_afterCreate` / `_initDefaultBrin`, nettoyée dans `deleteSelected`.
- **Getter `projectBrins`** ajouté dans `abstract/Item.js` (= `this.project.listerBrins.brins`).
  `dom/Event.js` (`persosMarks`/`brinsMarks`) lit désormais `this.projectBrins` (import `ListerBrin` retiré).
- **Correctif de compréhension** : le rafraîchissement des marks à la fermeture du panneau =
  **persos uniquement**. Les brins se rafraîchissent en **direct** au toggle.
- **`package.json`** déplacé à la racine → `public/` (committé avant cette session). Rappel : sert
  uniquement à `"type":"module"` pour que les tests `node --test` importent les `.js` de `public/`
  comme modules ES.

## 2026-06-27 — Centralisation sur le Project courant

> ⚠️ Avant cette session, beaucoup de travail avait déjà été fait sur cette
> centralisation (refonte panels, `enterInside`, pools, etc.) mais n'avait pas
> été tracé et a été en partie oublié. Cette entrée ne couvre que ce qui a été
> repris/constaté pendant la session du 27/06.

### Principe acté
- Le **Project courant est au cœur du runtime** une fois choisi.
- Il possède **un seul `ListerBrin`** (tous les brins, instancié une fois) et
  **un seul `ListerPerso`** (tous les persos, instancié une fois), exposés par
  les getters lazy `Project.listerBrins` / `Project.listerPersos`.
- `Project` (l'objet, pas son id) est transmis au constructeur des listers et
  des items.

### Fait pendant la session
- **Suppression** de `ui/BrinPanel.js`, `ui/PersoPanel.js`, `models/dom/DomMethods.js`
  (wrappers + singletons qui instanciaient un `ListerBrin`/`ListerPerso` à chaque
  ouverture — contournaient le lister unique du Project).
- **`App.js`** : retrait de l'import `DomMethods` ; `navigateToItem` mis en
  commentaire (référençait `keyboardController`/`activeLister`/`enterSelectedItem`
  d'une ancienne architecture clavier supprimée — à repenser pour les iframes).
- **Abandon de la propriété `project_id`** sur les objets : on ne garde que
  `project` (l'objet) ; l'id se dérive via `this.project.id`. Le paramètre d'URL
  `?project_id=` reste (contrat serveur). Corrigé presque partout par l'utilisateur.
- **`abstract/Item.js`** : ajout `this.project` dans le constructeur ; suppression
  de `project_id`.
- **`abstract/Lister.js`** : `_instantiateItems` transmet `project: this.project`
  aux items.
- **`core/Brin.js`** : `static LISTENERS = { ...Item.LISTENERS, ...BrinLi }` ;
  nouveau fichier `listen/Brin.js` (`BrinLi = { p: openPersoPanel }`).
- **`core/ListerPerso.js`** : constructeur aligné sur `ListerBrin` (reçoit
  `project`, `raise(3000)` si absent, `id = project.id + '-persos'`) ; squelette
  `openPanel(contextItem)` posé (corps à écrire).
- **`ERRORS.js` / `Texte.js`** : ajustements (codes d'erreur badge/lister).

### Constats / décisions de nommage de l'utilisateur
- Le bon point d'entrée est **`project.listerBrins.openPanel(item)`** (et
  `listerPersos.openPanel(item)`), pas un wrapper `openBrinPanel()` sur l'item.
- Méthodes panel : **`openPanel()` / `closePanel()`** uniquement sur
  `ListerBrin` / `ListerPerso` (voir règle mémoire `feedback_panel_methods`).

## 2026-06-26

### Tests _tdd/ — 60 tests verts

- **`Brin.js`** : `static generateBadge(title)` ajouté (copie old arch) + constructeur : `this.badge = data.badge || Brin.generateBadge(this.title)`
- **`dom/Lister.js`** : `render()` ajoute `${minClass}-list` au container → `#projects-panel.project-list`, `#events-panel.event-list`
- **`abstract/Item.js`** : `_enterChildLister` reset `child.selectedIndex = 0` avant render
- **`core/ListerBrin.js`** : `static LISTENERS = { ...Lister.LISTENERS, ' ': { nokey: 'toggleChecked' } }` + `deleteSelected` await `ev.save()`
- **`ui/BrinPanel.js`** : `HANDLED_KEYS` réduit à `Enter` + `b` (ArrowUp/Down/Delete/Space/n délégués au KeyDispatcher de ListerBrin)
- **`tests/brins-selection.spec.js`** : attente `nth(0).toHaveClass(/selected/)` après ArrowRight avant press('b')
- **`tests/brin-persistence.spec.js`** : `[data-field="badge"]` → `.brin-badge`
- Suppression de tous les `console.log` explicites dans les fichiers de test

### Tests — #main-panel → #projects-panel / #events-panel

- Tous les `locator('#main-panel')` dans les fichiers de tests corrigés vers `#projects-panel` (ListerProject) ou `#events-panel` (ListerEvent) selon contexte

## 2026-06-25 (suite 2)

### Refonte render() — idempotence et unification Lister

**`public/classes/models/dom/Lister.js`**
- Ajout `_ensurePanelStructure(container)` : crée `.lister-panel > header/body/footer` une seule fois via `querySelector`, jamais redétruit
- `render()` refactorisé :
  - `this.container = this._ensureContainer()` (le conteneur principal, reçoit l'écoute clavier)
  - Appel `_ensurePanelStructure(this.container)` pour trouver/créer la structure stable
  - Vidage UNIQUEMENT de `.lister-panel__body` (pas du conteneur entier)
  - Ajout `this.attach(this.container)` pour enregistrer le listener KeyDispatcher
  - Suppression `return this.container` (propriété d'instance suffit)
- Clarification : `this.container` = l'élément racine qui reçoit clavier (pas une "panel" physique pour Events, mais logiquement le panneau)

**`public/classes/ui/BrinPanel.js`**
- Changement : listener keydown attaché à `this._listerBrin.container` au lieu de `document.getElementById(listerEvent.constructor.PANEL_ID)` — corrige le problème où BrinPanel écoutait `#events-panel` (frère) au lieu de `#brins-panel` (le vrai conteneur)
- **À faire (suite 3)** : Cette classe UI séparate devient inutile — tous les Listers (Project, Event, Brin, Perso) doivent fonctionner identiquement via le système KeyDispatcher/LISTENERS. BrinPanel et PersoPanel à fusionner dans `ListerBrin`/`ListerPerso` directement.

## 2026-06-25

### Refonte enterInside / découplage Project / pools brins-persos

**`public/classes/models/abstract/Item.js`**
- `enterChildren()` → `enterInside()`, simplifié (`project_id` lu directement, plus de repli `?? this.id`)
- Extraction `_enterChildLister(ChildClass, childId, project_id)` — logique partagée création/chargement/rendu d'un lister, réutilisable par `Project` sans passer par `enterInside`

**`public/classes/models/listen/Item.js`**
- `ArrowRight: { nokey: 'enterChildren' }` → `'enterInside'`

**`public/classes/models/core/Project.js`**
- `enterInside()` dédié (jamais de `super.enterInside()`) : charge `ListerBrin`/`ListerPerso` (project_id explicite) puis son `ListerEvent` via `this.lister_id` (entier réel, plus jamais `this.id`)
- `onCreated()` : `parent_item_id` → `itemId` dans l'appel à `Lister.createLister`

**`public/classes/models/core/ListerBrin.js`** / **`ListerPerso.js`**
- `static pool = {}`, peuplé dans `_afterLoad()`
- `ListerBrin` : constructeur accepte `project_id` direct (plus seulement via `listerEvent`), `_fetchData()` retombe sur le fetch générique si pas de `listerEvent`

**`public/classes/models/dom/Event.js`** / **`dom/Brin.js`**
- `brinsMarks()`/`persosMarks()` retournent leur propre conteneur (`class="brins-marks ${minClass}-brins-marks"`), découplé du `:name` du champ PROPS
- Délégation du calcul de la marque à `Brin.markOf`/`Perso.markOf`

**`public/classes/models/core/Brin.js`** / **`Perso.js`**
- `Brin` : `this.persos` → `this.perso_ids` (cohérent avec PROPS), `static markOf(data) { return data.badge }`
- `Perso` : `this.avatar`, `this.badge`, `static markOf(data) { return data.avatar || data.badge }`

**`lib/db/repo.rb`**
- `_fetch_project_items` + boucle `active` : ajout `lister_id` (depuis `project_meta`)
- `find_lister_by_id` / `find_items_by_lister_id` : suppression du cas spécial mort `id == project_id`
- `create_item` (branche events) : `lister_id.to_i` pour cohérence avec `delete_item` (sans impact réel, SQLite gère déjà l'affinité)
- `create_lister` : paramètre `parent_item_id:` → `item_id:`

**`app.rb`**
- `POST /api/listers` : payload `parent_item_id` → `itemId`

**Bug trouvé et corrigé — cause probable de la régression BrinPanel** : `abstract/Lister.js` n'importait jamais `LOG`, utilisé dans `_createAt()`. `ReferenceError` silencieuse (promesse rejetée non gérée, pas de `pageerror` dans les tests concernés) empêchant `startEditing()` de jamais s'exécuter après création d'un item via `n`/`createNew()` — touche aussi bien `ListerEvent` que `ListerBrin`.

**Tests** : `_tdd/start-up.spec.js`, `_tdd/project-navigation-lister.spec.js`, `_tdd/open-existing-project.spec.js` (nouveau test marques brins/persos via fixture `with-brins-and-persos`) — tous verts, remis à leur emplacement canonique.

## 2026-06-24

Rien de fonctionnel livré. Régression introduite sur la création de brin (`startEditing` non fonctionnel après `_reloadAt`). Tests supprimés (couleur brin, Escape ferme panneau). LOGs de diagnostic en place.

## 2026-06-23 (suite 3)

### Brins marks dans EventLister + pattern dom/ injection

**`public/classes/models/dom/Event.js`** *(nouveau)*
- Objet plain exporté : `brinsMarks()`, `persosMarks()` (stub)
- Injecté dans `Event.prototype` via `Object.assign(Event.prototype, EventDom)`

**`public/classes/models/core/Event.js`**
- `constructor` : `this.brin_ids`, `this.perso_ids`
- PROPS : ajout `{ name:'brins-marks', type:'no-edit', warper:'marks', value:'brinsMarks' }` et `persos-marks`
- Warpers `left-col` → `edits`

**`public/classes/models/core/EventLister.js`**
- `EventListerRepo extends ListerRepo` (local) : `load()` fetch aussi `/${pid}-brins/items` → `this.lister.brins`
- `get Repo()` → `EventListerRepo`

**`public/classes/utils/DOM.js`**
- `buildNoEditField(field, item)` : appelle `item[field.value]?.()`, innerHTML
- `buildField` + `buildEditField` : cas `'no-edit'`

**Warpers renommés — tous les core/**
- `left-col` → `edits` (Event, Project)
- `left` → `edits` (Brin color/badge/type, Perso)
- `left` → `marks` (Brin persos)

**`public/styles.css`**
- `.item-left-col` → `.item-edits`

**Tests**
- `_tdd/brin-badges-display.spec.js` : `.event-brins-badges` → `.event-brins-marks` — 3 tests verts

## 2026-06-23 (suite 2)

### createNewBefore + keyboard + guards édition

**`public/classes/models/abstract/Lister.js`**
- `_createAt(insertIdx)` : logique commune extraite de `createNew()`
- `createNew()` → `_createAt(selectedIndex + 1)` ; `createNewBefore()` → `_createAt(selectedIndex)`

**`public/classes/models/abstract/ListerListener.js`**
- `n: { nokey: 'createNew', alt: 'createNewBefore' }` ; `N:` supprimé (toLowerCase gère la majuscule)
- `'˜': { nokey: 'createNewBefore' }` — vraie touche Mac ⌥n

**`public/classes/models/abstract/BaseListener.js`**
- `onkeydown` : `LISTENERS[ev.key] ?? LISTENERS[ev.key.toLowerCase()]` — fallback insensible à la casse

**`public/classes/models/abstract/ItemListener.js`**
- `onkeydown` : si `item.editing` et touche absente de LISTENERS → `stopEvent(ev)` — empêche les touches de remonter jusqu'à ListerListener pendant l'édition

**`public/classes/models/abstract/ListerDom.js`**
- `LOG.on(2)` retiré

**`public/classes/models/abstract/Item.js`**
- `LOG.on(2)` retiré de `cancelEdit()`

**Tests `_tdd/`**
- Sélecteurs corrigés : `#main-panel.press('ArrowRight')` → `.project-item.selected.press('ArrowRight')` (5 fichiers)
- `input[name="title"]` → `[data-field="title"]` (keyboard-alt-n, new-event-virtual-lister)
- `#main-panel.press('Enter')` → `.event-item.selected.press('Enter')` (new-event-virtual-lister)
- `pressAltNMac` : dispatch sur `#main-panel` au lieu de `document`
- `page.keyboard.type()` supprimé partout → `locator.fill()`

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
