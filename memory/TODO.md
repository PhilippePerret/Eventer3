# TODO — Eventer3

<a name="current"></a>

## En cours

### Chantier centralisation Project courant (27/06)

**Principe :** le Project courant est central. `project.listerBrins` /
`project.listerPersos` = listers uniques (instanciés une fois, tous les
brins / persos). On transmet `project` (l'objet), jamais `project_id`. Les
panneaux s'ouvrent/ferment via **`openPanel(item)` / `closePanel()`** portés
sur `ListerBrin` / `ListerPerso` (cf. `feedback_panel_methods`).
**Point de nommage acté par l'utilisateur (28/06) :** méthodes relais `openBrinPanel()` /
`openPersoPanel()` portées sur `Item` (abstrait, donc Event/Brin/Project sans duplication),
déléguant à `this.project.listerBrins.openPanel(this)` / `listerPersos.openPanel(this)`.
Appelées par le dispatcher via LISTENERS (`b`/`p` nokey).

**À faire tout de suite — Refonte render/activate/panels (29/06) :**

- [x] `dom/Lister.js` : `render()` — retiré `attach()`, `focusSelected()`, `classList.remove('hidden')`
- [x] `dom/Lister.js` : `_ensureContainer()` — `attach()` une seule fois à la création
- [x] `dom/Lister.js` : ajouté `activate()`, `hideContainer()`, `hide()` simplifié
- [x] `abstract/Lister.js` : ajouté `closePanel()`, `onPanelClosed()` stub
- [x] `abstract/Item.js` : ajouté `focus()` ; `_enterChildLister` : `child` → `childLister`, `attach` → `activate()`
- [x] `core/ListerBrin.js` : retiré `closePanel()` + `detach()` ; `openPanel()` render-once + activate ; `onPanelClosed()` stub /* à implémenter */
- [x] `core/ListerPerso.js` : retiré `detach()` + bloc mort ; `openPanel()` même pattern

1. **[FAIT 2026-06-28] Bugs objectifs restants** (variables mortes après le passage `project_id`→`project`) :
   - [x] `repo/Lister.js:22` (`countDescendants`) : `project` → `pid` (const ligne 21).
   - [x] `repo/Lister.js` (`save`) : déjà `?project_id=${this.project.id}`.
   - [x] `ListerBrin.js:80` (`deleteItem`) : `?project_id=${this.project.id}`.

2. **[FAIT 2026-06-28] `ListerBrin`** : migration refaite proprement (après rollback initial).
   - [x] `open(eventItem)` → `openPanel(contextItem)` + `closePanel()` ; `contextItem` = item d'ouverture.
   - [x] Suppression `listerEvent` / `selectedEvent` / override `_fetchData`.
   - [x] Brins = refresh **direct** au toggle (`_afterToggle` → `_refreshEventMarks`) — conservé.
   - [x] `static pool` **supprimé** au profit d'une table d'instance `this.brins` ({id → brin}).
   - [x] Getter `projectBrins` ajouté dans `abstract/Item.js` (= `this.project.listerBrins.brins`).
   - [x] `dom/Event.js` (`persosMarks`/`brinsMarks`) lit `this.projectBrins` (import `ListerBrin` viré).

3. **[FAIT 2026-06-28] `ListerPerso.openPanel(contextItem)`** :
   - [x] `contextItem` getter corrigé (`_contextItem`).
   - [x] `openPanel` pose `_directIds` / `_inheritedIds` (Event = direct + hérités des brins via
     `itemsById['brins']`, distinction par `contextItem.minClass === 'event'`) avant `_syncChecked()`.
   - [x] `_afterToggle` = `ctx.refreshPersosMarks()` (refresh direct de l'item contexte).

3bis. **Invariant direct ∩ brins = ∅** (cf. [feedback/project_persos_marks_refresh.md]) :
   - [x] Ajout perso direct à l'event : déjà garanti structurellement (perso d'un brin = `inherited`
     dans `_syncChecked` → verrouillé par `_canToggle`). Pas d'alerte explicite (silencieux).
   - [x] Choix d'un brin pour l'event : `ListerBrin._afterToggle` retire de `ev.perso_ids` les persos
     portés par le brin coché. Test : `tests/specs/unit/models/brin/brin-invariant-direct-persos.test.js` (vert).

4. **[FAIT 2026-06-28] `Item` / `dom/Item.js`** :
   - [x] `toggleChecked` recâblé : générique via `parentLister` (`_canToggle`, `CHECK_KEY`,
     écrit `ctx[CHECK_KEY]`, `_afterToggle`, `ctx.scheduleSave()`). `ctx` = `parentLister.contextItem`.
   - [x] Méthodes relais `openBrinPanel`/`openPersoPanel` sur `Item` (typo `listerPerso`→`listerPersos`
     corrigée, `openBrinPanel` ajouté).

5. **[FAIT 2026-06-29] Refresh différé des marques persos** à la **fermeture du panneau brins** — **PERSOS UNIQUEMENT**.
   - [x] Tests cas 1/2/3 + sonde focus : tous verts. Fichier déplacé → `tests/specs/e2e/event/brin-perso-propagation.spec.js`.
   - [x] `ListerBrin.markForCheck(brin)` + `_afterStartEditing` hook + snapshot `initialData` → comparaison à `onPanelClosed()`.
   - [x] `_afterToggle` : refresh immédiat brin marks + perso marks sur l'event unique (pas de goulot).

6. **[NOUVEAU — au fil des passages au vert] Migrer `locator.press` → `press(page,key)`**
   dans les tests e2e, **fichier par fichier** à mesure qu'on les fait passer.
   - Raison : app **zéro-souris** → aucun élément ne prend le focus autrement que par une
     touche qu'on gère → `page.keyboard` (focus réel) est toujours valide ET honnête.
     `locator.press` force le focus → masque les bugs de focus → faux positif.
   - ~85 fichiers e2e concernés. NE PAS faire en sweep global — un fichier à la fois.
   - **NE PAS migrer en avance** : on migre PENDANT qu'on fait passer les tests du fichier, pas avant.
   - `perso-panel.spec.js` (contient les commentaires « POURRI » = le refrain) : à corriger
     **directement** (chantier courant), prévu **demain**.
   - Cf. [feedback/tests-focus-reel-page-keyboard.md].

**Plan de la suite (après stabilisation panels) :** reprendre les tests `_tdd/`
listés plus bas (brins-panel, brin-edition-form, keyboard-delete, brin-nouveau,
brins-selection, perso-panel…), puis revenir au chantier clipboard + badges
ci-dessous, puis repenser `App.navigateToItem` (iframes) selon la nouvelle archi.

### Chantier clipboard + badges (en cours 2026-06-27)

**Contexte :** déviation depuis test 13 de `contextual-help.spec.js` (`⌘+v apparaît si clipboard compatible`).
Test 13 est en `test.only` — en attente de l'implémentation clipboard.

**Fait :**
- `public/classes/models/abstract/Clipboard.js` créé (singleton)
- `tests/specs/unit/_tdd/brin-badge.test.js` déplacé
- `oncreating`/`onchange` posés dans `Brin.PROPS` et `Perso.PROPS` (stubs en place)
- `patronyme` ajouté à `Perso.PROPS` + constructor
- `generateUniqueBadge` / `generateBadge` implémentés dans `Brin.js` et `Perso.js`
- `unique: true` dans `Brin.PROPS.badge` et `Perso.PROPS.badge`

**À faire dans l'ordre :**

#### Câblage `oncreating` / `onchange` — `dom/Item.js`
1. Modifier `collectValues()` : après `this[field.name] = newVal`, si `field.oncreating` ET `!field._curvalue` ET `newVal` ET `!this.badge` → `this[field.oncreating](newVal)` ; sinon si `field.onchange` ET `newVal !== field._curvalue` → `this[field.onchange](newVal)`

#### Implémentation méthodes badge — `core/Brin.js`
2. Implémenter `setBadgeOnCreating(val)` : si `!val?.trim()` ou `this.badge` → return ; `this.badge = Brin.generateUniqueBadge(this)` ; mettre à jour `this.el?.querySelector('[data-field="badge"]')?.textContent`
3. Implémenter `checkBadgeValue(val)` : si vide → `this.badge = null` ; construire `Set` des badges siblings (items sans self) ; si pris → `Notification.show(...)` + revert via `this.PROPS.find(f => f.name === 'badge')._curvalue`

#### Implémentation méthodes badge — `core/Perso.js`
4. Implémenter `setBadgeOnCreating(val)` : même logique que Brin mais `Perso.generateUniqueBadge(this)`
5. Implémenter `checkBadgeValue(val)` : même logique Brin (siblings sans self)

#### Tests unitaires — `tests/specs/unit/_tdd/`
6. Réécrire `brin-badge.test.js` : faux brin+lister (objet avec `parentLister.existingBadges`) ; tester `generateUniqueBadge(brin)` ; tester `setBadgeOnCreating` (badge null → généré, badge déjà set → inchangé) ; tester `checkBadgeValue` (unique → OK, dupliqué → revert + notification)
7. Créer `perso-badge.test.js` : même structure ; tester `generateBadge(patronyme, title)` ; `generateUniqueBadgeFromPatronyme` vs `FromPseudo` ; `badgePerDepit`

#### Clipboard (suite)
8. `Item.toClipboardData()` dans `abstract/Item.js` : `PROPS.filter(f => !f.unique).map(f => [f.name, this[f.name]])`
9. `Lister.copySelectedItem()` dans `abstract/Lister.js` + import `Clipboard`
10. `c: { meta: 'copySelectedItem' }` dans `listen/Lister.js`
11. `ContextualHelp._buildShortcuts()` : vérifier `Clipboard.isCompatible(this._item.minClass)` → ajouter `⌘+v` si oui

**Après tout ça :** retirer `test.only` du test 13, vérifier qu'il passe, puis enchaîner test 15.

> **[LIRE TOUJOURS AVANT TOUT TRAVAIL SUR LES TESTS]**
> - Déplacer les tests dans `e2e/_tdd/` avant de travailler dessus
> - S’inspirer de `public-old` pour le fonctionnement anciennement implémenté (ne pas hésiter à reprendre du code, si valide, surtout s’il ne concerne pas la gestion des keyboard events, radicalement différente dans la nouvelle architecture).
> - Les tests existants, malgré les nombreuses migrations déjà effecutées, ne respectent peut-être pas nouvelle architecture — les corriger au besoin.
> - **IMPÉRATIF** : si on rencontre le même échec **après trois essais de correction**, ON MET DES LOG(s) pour voir où ça coince.

- **Éliminer BrinPanel / PersoPanel** — remplacer par système générique KeyDispatcher/LISTENERS
  - **Principe fondamental** : tous les Listers (Project, Event, Brin, Perso) ont STRICTEMENT le MÊME fonctionnement — ne diffèrent que par l'aspect (CSS) et quelques comportements spécifiques
  - Refonte terminée (`dom/Lister.js` : render idempotent, `_ensurePanelStructure`, `this.attach(this.container)`)
  - **Suite** : 
    1. Rapatrier `ListerBrin.LISTENERS` + keyboard logic du `ui/BrinPanel.js` vers `core/ListerBrin.js`
    2. Rapatrier `ListerPerso.LISTENERS` vers `core/ListerPerso.js` (même pattern)
    3. Supprimer `ui/BrinPanel.js` et `ui/PersoPanel.js` entièrement
    4. Mettre à jour `models/dom/DomMethods.js` : `openBrinPanel(item)` → `item.parentLister.enterInside()` / `openPersoPanel(item)` → `item.parentLister.enterInside()`
  - Fichiers à tester après refonte :
    - `tests/specs/e2e/event/brin-badges-display.spec.js`
    - `tests/specs/e2e/brin/brin-edition-form.spec.js`
    - `tests/specs/e2e/brin/brin-init.spec.js`
    - `tests/specs/e2e/brin/keyboard-delete.spec.js`
    - `tests/specs/e2e/brin/brin-nouveau.spec.js`
    - `tests/specs/e2e/brin/brins-panel.spec.js`
    - `tests/specs/e2e/brin/brin-persistence.spec.js`
    - `tests/specs/e2e/brin/brins-selection.spec.js`
    - `tests/specs/e2e/keyboard/keyboard-alt-n.spec.js`

<a name="todo-after"></a>

## À faire après

### Fichiers `e2e/project/` à reprendre (non verts)
- `new-project-existing-db.spec.js`
- `new-project-initial-data.spec.js`
- `new-project-under-selection.spec.js`
- `open-existing-project.spec.js`

- [ ] `⌘↓` / `⌘↑` pour déplacer les projets ou les events
- [ ] `Enter` pour éditer les évènements (event)

## Réflexions

- [ ] **RÉFLEXION — Majuscule = minuscule dans BaseListener** (`public/classes/models/abstract/BaseListener.js`) : actuellement les touches majuscules doivent être dupliquées explicitement dans chaque LISTENERS (ex: `n` ET `N` dans ListerListener). Réfléchir à un système "majuscule fallback sur minuscule SAUF si la majuscule est explicitement définie dans LISTENERS". Exemple actuel : `ListerListener.js` ligne 13 `N: { nokey: 'createNew' }`.

<a name="done"></a>

## Fait

- [x] 2026-06-28 — Tests e2e : approche **focus honnête**. Helpers `press`/`hasFocus`/`focusInfo`
  dans `__setup__.js` ; `brin-perso-propagation.spec.js` migré ; test SONDE vert (chaîne focus
  project→event→brin→perso vérifiée). `page.keyboard` > `locator.press` (anti faux-positif). Cf. CHANGELOG.
- [x] 2026-06-28 — Purge définitive de 2 fichiers `/export` de l'historique git (amend + `git filter-repo`,
  force-push). Tous SHA réécrits.
- [x] 2026-06-28 — Lancement/navigation projets↔évènemenciers réparé (4 tests verts `project/open-existing-project.spec.js`) : `Project.project=this`, `Lister.hide()`, `_initDefaultBrin` (parentLister+badge), `ListerPerso._syncChecked` tolérant. Cf. CHANGELOG.
  - RESTE à creuser : `createItem` renvoie un brin sans `badge` ; tests unitaires `brin-badge` rouges (`parentLister.existingBadges` en contexte unitaire) ; point 5 `brin-perso-propagation` (WIP `e2e/_tdd/`).
- [x] 2026-06-28 — Généralisation `byId` dans la base `Lister` + `Project.itemsById` (concept utilisateur) ; suppression `this.brins`/`static pool`/legacy `ListerEvent.brins`. Cf. CHANGELOG.
- [x] 2026-06-28 — Point 1 (bugs `project_id`→`project`) + Point 2 (`ListerBrin` migration `openPanel`/`closePanel`, `contextItem`). Cf. CHANGELOG.

- [x] 2026-06-26 — 60 tests `_tdd/` verts : brin-panel, brin-persistence, brin-keyboard-delete, brins-selection, keyboard-alt-n, open-existing-project, start-up
- [x] 2026-06-26 — `#main-panel` corrigé dans tous les fichiers tests → `#projects-panel` / `#events-panel`
- [x] 2026-06-25 — `enterChildren` renommé `enterInside`, `Project` découplé (charge ListerBrin/ListerPerso/ListerEvent via son propre `lister_id`), pools `ListerBrin.pool`/`ListerPerso.pool`, fix import LOG manquant dans `abstract/Lister.js`
- [x] 2026-06-23 — `_tdd/` : 21 tests verts (keyboard-alt-n, keyboard-cmd-n, new-event, new-event-titre-vide, new-event-virtual-lister, open-existing-project, project-navigation-lister)
- [x] 2026-06-23 — `createNewBefore()` / `_createAt()` + ListerListener ˜/alt+n + ItemListener guard édition
- [x] 2026-06-23 — Navigation projets → events → sous-events → retour (`keyboard/navigation-basique.spec.js` vert)
- [x] 2026-06-23 — ArrowUp/Down bloqués pendant édition titre + titre persisté mémoire/DB (`event/edit-event-title.spec.js` vert)
- [x] 2026-06-22 — Suppression projet en cascade : ConfirmDialog.expectedValue, countDescendants, collect_descendants_in_db corrigé
- [x] 2026-06-22 — Navigation circulaire : ArrowUp sur premier → dernier, ArrowDown sur dernier → premier
- [x] 2026-06-22 — Bug flèches 2 en 2 : attach() retiré de ListerDom.render(), appelé une seule fois dans ProjectLister.init()
- [x] 2026-06-22 — FilePicker "Choisir" : button → span (pas de click souris)
- [x] 2026-06-22 — ProjectLister.createNew() : focus restauré après annulation ConfirmDialog
- [x] 2026-06-21 — FilePicker : refactoring complet conformité règles (Escape, Tab cycle, PopupSelect ancêtres, Choisir, Annuler, focus restauré, N=n)
- [x] 2026-06-21 — FilePicker tests : `_tdd/filepicker.spec.js` réécrit (31 tests verts)
- [x] 2026-06-21 — ListerListener : `N` explicite = `n` (createNew)
- [x] 2026-06-21 — KeyboardablePanel.open() : `this._el.focus()` pour recevoir les keydown
- [x] 2026-06-21 — Test open-existing-project : séparé en 2 tests distincts (import / ArrowRight)
- [x] 2026-06-21 — Rationalisation CSS panneaux : ftpanel/kpanel, suppression confirm-dialog, bouton focusé par défaut
- [x] 2026-06-21 — KeyboardablePanel.js : bouton focusé à l'ouverture (index 0)
- [x] 2026-06-21 — KeyboardablePanel.js : listener keydown corrigé (bon élément)
- [x] 2026-06-20 — FilePicker : bug frappe nouveau dossier
- [x] 2026-06-20 — FilePicker : portage nouvelle architecture (tabindex, createNew, project_order)
- [x] 2026-06-20 — Édition projet : Correction bugs relevés en live
- [x] 2026-06-19 — Liste des projets s'affiche au lancement avec données leurs PROPS
- [x] 2026-06-19 — Navigation ↑/↓ pour sélectionner un projet
