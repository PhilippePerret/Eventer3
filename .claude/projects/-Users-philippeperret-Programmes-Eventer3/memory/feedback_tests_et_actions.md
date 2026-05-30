---
name: feedback-tests-et-actions
description: Ne jamais lancer les tests ni toucher les données sans permission explicite de l'utilisateur
metadata:
  type: feedback
---

Ne jamais lancer les tests (npm test, playwright test, node --test, etc.) ni modifier les données sans permission explicite.

**Why:** L'utilisateur lance toujours les tests lui-même. Claude doit s'arrêter après avoir écrit le code et les tests, et attendre.

**How to apply:** Après avoir écrit le code et les tests, stopper et informer l'utilisateur de ce qui a été fait. Ne pas lancer de commandes de test automatiquement. Exception tolérée : les tests unitaires Node (node --test) car ils ne touchent pas les données ni le serveur — mais même ceux-là, demander d'abord si non explicitement autorisés.
