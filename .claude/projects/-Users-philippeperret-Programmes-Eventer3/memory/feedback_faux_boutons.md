---
name: feedback-faux-boutons
description: Les boutons footer dans EventerX sont des FAUX-BOUTONS — zéro interaction souris
metadata:
  type: feedback
---

EventerX = ZÉRO SOURIS. Les "boutons" footer dans les panneaux sont des faux-boutons visuels :
- Créés avec `<span>`, jamais `<button>`
- Aucun `addEventListener('click', ...)` ni `onclick`
- Navigation uniquement clavier (TAB cycle)
- PAS d'Escape pour fermer les panneaux

**Why:** App 100% keyboard-driven. La souris ne doit jamais fonctionner sur ces éléments.

**How to apply:** Toute implémentation de footer panel → span + user-select:none, aucun event souris.
