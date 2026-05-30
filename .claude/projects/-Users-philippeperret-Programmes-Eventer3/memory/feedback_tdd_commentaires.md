---
name: feedback-tdd-commentaires
description: TDD : écrire les tests AVANT le code, ne jamais implémenter sans tests qui passent d'abord en rouge
metadata:
  type: feedback
---

Toujours écrire les tests en premier (RED), puis implémenter le code (GREEN). Ne jamais écrire du code de production avant d'avoir les tests correspondants.

**Why:** L'utilisateur suit une démarche TDD stricte. Implémenter sans tests d'abord est une violation du processus et produit des faux positifs.

**How to apply:** Pour chaque nouvelle feature : 1) créer le fichier de test avec les cas, 2) s'arrêter et attendre que l'utilisateur les lance (ils doivent être RED), 3) implémenter le code pour les faire passer (GREEN). Ne jamais sauter l'étape RED.
