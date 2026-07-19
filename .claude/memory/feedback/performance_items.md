---
name: feedback-performance-items
description: Items peuvent être par million, touches jouées en rafale — jamais re-render complet pour une opération unitaire
metadata:
  type: feedback
---

NE JAMAIS perdre de vue : les items peuvent être par million ET les touches peuvent être jouées en rafale.

**Why:** Re-render complet du DOM pour chaque Delete = catastrophique en cascade sur gros volumes.

**How to apply:**
- Opération unitaire (delete, add, move) → manipuler UN seul élément DOM, pas `Dom.render()`
- Jamais `array.filter(id => id !== item.id)` quand on connaît l'index → `splice(idx, 1)`
- Jamais `import()` dynamique pour une dépendance toujours nécessaire → import statique en tête de fichier
