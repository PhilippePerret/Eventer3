# CHANGELOG

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
