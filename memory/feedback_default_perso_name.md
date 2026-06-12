---
name: feedback_default_perso_name
description: Nom par défaut du premier personnage auto-créé
metadata:
  type: feedback
---

Quand PersoLister s'ouvre sans aucun perso défini, il doit auto-créer un perso nommé **"Votre protagoniste"** (comme BrinLister auto-crée "Intrigue principale").

**Why:** Convention symétrique avec les brins

**How to apply:** Dans `PersoLister.open()`, si `items.length === 0` après `loadItems()`, appeler un équivalent de `BrinLister.init()` qui crée ce perso par défaut.
