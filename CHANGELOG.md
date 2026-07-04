# CHANGELOG

## 2026-07-04

### PULL ConfirmDialog + NaturePanel man_depth (confirm-dialog-tab)

- `ConfirmDialog` : suppression de `static open()` — instantiation directe avec boutons `{ label, type, action }` (callbacks)
- `KeyboardablePanel` : `open()` sauvegarde le focus précédent, `close()` le restaure (fix ⌘↩ sans résolution de Promise)
- `NaturePanel` : suppression du chemin `isProject` — panneau exclusivement pour ListerEvent ; boutons avec callbacks directs
- `NaturePanel._apply()` : `lister.project.man_depth` propagé en mémoire (évite race condition API sur le sibling)
- `ListerEvent._isManLister()` : fallback sur `project?.man_depth` (sibling visible immédiatement sans attendre la sauvegarde API)
- `ListerEvent._updateMainPanelClass()` : suppression du `console.log` de debug
- `ListerProject` : refactoring `createNew()` — logique extraite dans `_importProject`, `_destroyAndCreate`, `_createProject`
- `Lister.deleteSelected()` : extraction dans `_doDeleteItem()` ; `Lister.checkDataConflicts()` : Promise locale avec callbacks
- Fixture `depth-move` : `project_meta.nature = 'roman'` ; navigation `openManDepthConfirm` simplifiée (plus de navigation popup projet)
- 7 tests verts (confirm-dialog-tab)

## 2026-07-03

### PULL Filtre (filter-bar, filter-text, filter-brin, filter-ux)

- `:` ouvre/ferme la barre de filtre dans tout Lister (base class `openFilterBar()`)
- Barre de filtre : widget titre (`.panel-search`, filtrage live) + widgets menu (état/météo/effet/brins)
- Tab cycling dans la barre entre widgets, ArrowDown sur widget → ouvre PopupSelect
- PopupSelect : `loadOptions` (chargement lazy) + `onEmpty` callback pour brins vides
- Brins : chargement dynamique via `import('./ListerBrin.js')` (évite import circulaire), `live: false` → filtre sur Enter
- `_filterMenuWidgets()` hook : override dans ListerEvent (état/météo/effet/brins)
- `_filterMatches()` hook : override pour logique spéciale brins (brin_ids)
- `StatusBar.setFilterState('mode'|'active'|'none')` : badge FILTRE vert/rouge/absent
- `:` une 2e fois efface tous les filtres et ferme la barre
- Navigation ↓/↑ saute les items masqués par le filtre
- Suppression complète de `Meta+:` (Cmd+:) de tout le code et des tests
- 42 tests verts (filter-bar 24, filter-brin 4, filter-text 4, filter-ux 10)

## 2026-07-03

- Panneau styles : `s` ferme le panneau depuis n'importe quelle lettre sans item correspondant (fix ListerStyle.onkeydown)
- Badge perso (RO) sur brin : fix ordre de chargement dans Project.enterInside (persos chargés avant build des brins)
- Ctrl+Shift+Arrow : déplace le panneau actif (style, outils…) — KeyDispatcher + ListerLi + panelMove.js
- Panneau outils : port depuis ancienne architecture, ouverture via ⌘+t (niveau application), déplacement Ctrl+Shift+Arrow
- Suppression de `#shortcuts-panel` (remplacé par l'aide contextuelle)
- panel-search.spec.js : tests skippés (fonctionnalité à fusionner avec filtre)

## 2026-07-02

- Amélioration de l'affichage des propriétés d'events
- Gestion titre vide event : notification + blocage Escape sur lister virtuel
- Gestion coche (Space) : toggle visuel CSS + persistance PATCH
- Tab navigation en édition : Tab après popup-select va au champ suivant
- ⌘+c/⌘+x/⌘+v : copier/couper/coller items (events, projets) avec persistance
- Annulation Enter accidentel : Escape sur lister virtuel à depth>1 → leaveToParent
- ⌥↓/⌥↑ dans panneau brins/persos : navigation event/brin de fond, rafraîchissement coches, mise à jour titre panneau
- Delete dans panneau brins : suppression brin + retrait badge event + persistance (brin_ids mis à jour et sauvegardés)
- Coches brins : sélection cochée correspond aux brin_ids de l'event courant
- Lister._panelTitle() : méthode de base retourne contextItem.title (évite duplication dans sous-classes)
