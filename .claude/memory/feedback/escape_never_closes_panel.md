---
name: escape-never-closes-panel
description: Escape ne ferme JAMAIS un panneau — ni dans le code ni dans les tests
metadata:
  type: feedback
---

INTERDIT d'utiliser Escape pour fermer un panneau, que ce soit dans le code applicatif OU dans les tests.

**Why:** Règle fondamentale de l'architecture. L'utilisateur l'a dit explicitement et énergiquement.

**How to apply:** Pour fermer un panneau, utiliser la touche dédiée au panneau (ex: `p` pour ListerPerso, `b` pour ListerBrin). Ne JAMAIS ajouter `Escape` dans les LISTENERS pour fermer. Ne JAMAIS écrire `press(page, 'Escape')` pour fermer un panneau dans les tests.
