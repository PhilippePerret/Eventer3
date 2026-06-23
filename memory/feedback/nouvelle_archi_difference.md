---
name: nouvelle-archi-difference
description: La seule différence entre ancienne et nouvelle archi concerne le focus/keyboard — tout le reste se reprend tel quel
metadata:
  type: feedback
---

LA SEULE DIFFÉRENCE entre ancienne et nouvelle architecture joue au niveau du **focus** et de la **responsabilité de chaque élément pour les keyboard events**.

- Ancien : keyboard manager centralisé sur window
- Nouveau : chaque item/lister gère ses propres keydown via ItemListener/ListerListener

**TOUT LE RESTE** — backend, fonctions métier, méthodes, logique de réordonnancement, etc. — se reprend presque tel quel depuis `public-old`.

**Why:** Éviter de réinventer ce qui existe. Quand quelque chose manque dans la nouvelle archi, chercher d'abord dans `public-old`.

**How to apply:** Avant d'écrire du code nouveau, regarder `public-old` pour voir si la logique existe déjà. Ne changer que ce qui concerne focus/keyboard.
