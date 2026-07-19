---
name: new-archi-causes-echecs-tests
description: Ne pas imputer la cause d'un échec de test à une seule source par défaut — trois causes possibles, toujours équiprobables a priori
metadata:
  type: feedback
---

Face à un test qui échoue pendant la reconstruction, NE PAS présumer une cause plutôt qu'une autre. Trois sources possibles, à considérer à égalité :

1. **Le test ne respecte pas la nouvelle architecture** — notamment : (a) au niveau des classes CSS, (b) au niveau des keyboard events (dans l'ancienne archi, TOUT était géré au niveau de la page/window ; dans la nouvelle, chaque item/lister gère ses propres événements — cf. [[nouvelle-archi-difference]]).
2. **Le code a des imperfections résiduelles de l'ancienne architecture** — portage incomplet, oubli de nettoyage.
3. **Une fonction de l'ancienne architecture n'a pas encore été importée/portée** — cf. [[pas-de-bug-mais-implementation]].

**Why:** Dit explicitement pour éviter que je saute trop vite sur une explication (ex. "le test est juste obsolète") alors que la cause réelle peut être ailleurs.

**How to apply:** Devant un échec, examiner ces trois pistes avant de conclure. Ne pas qualifier par défaut un test d'"obsolète" ni le code de "buggé" sans avoir vérifié les trois.
