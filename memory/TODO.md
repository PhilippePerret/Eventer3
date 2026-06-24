# TODO — Eventer3

<a name="current"></a>

## En cours

> **[LIRE TOUJOURS AVANT TOUT TRAVAIL SUR LES TESTS]**
> - Déplacer les tests dans `e2e/_tdd/` avant de travailler dessus
> - S'inspirer de `public-old` pour le fonctionnement anciennement implémenté (ne pas hésiter à reprendre du code, si valide, surtout s’il ne concerne pas la gestion des keyboard events, radicalement différente dans la nouvelle architecture).
> - Les tests existants, malgré les nombreuses migrations déjà effecutées, ne respectent peut-être pas nouvelle architecture — les corriger au besoin.
> - **IMPÉRATIF** : si on rencontre le même échec **après trois essais de correction**, ON MET DES LOG(s) pour voir où ça coince.

- **BrinPanel** (`#brin-panel`) — 3/22 tests verts (`brin-badges-display` ✓). 19 échecs restants : tous bloqués sur `b` qui n’ouvre pas `#brin-panel`.

  **Architecture décidée (pas encore codée) :**
  - `EventItemListener extends ItemListener` avec LISTENERS mergés : `{ ...ItemListener.LISTENERS, b: { nokey: ‘openBrinPanel’ }, p: { nokey: ‘openPersoPanel’ } }`
  - `Event` override `get Listener()` → `EventItemListener`
  - `openBrinPanel()` dans `dom/Event.js` (injecté via `Object.assign`)
  - `BrinLister extends Lister` (core/BrinLister.js)
  - `BrinPanel extends KeyboardablePanel` (ui/BrinPanel.js) — wraps BrinLister, rendu dans `#brin-panel`

  

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
