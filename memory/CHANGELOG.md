# CHANGELOG — Eventer3 refactoring

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
