---
name: feedback_tests_heritage_ancienne_archi
description: Les tests E2E existants sont des héritages de l'ancienne architecture — ne pas les prendre au pied de la lettre
metadata:
  type: feedback
---

Les tests E2E existants (dans `tests/specs/e2e/`) sont des héritages de l'ANCIENNE architecture. Ils ne reflètent pas forcément le comportement attendu de la NOUVELLE architecture.

**Why:** La refacto est radicale (rewrite complet). Les tests ont été écrits pour l'ancien code. Certains testent des comportements aujourd'hui interdits (ex: Escape pour fermer un panel, sélecteurs CSS obsolètes, etc.).

**RÈGLE ABSOLUE :** En cas de divergence ancienne/nouvelle archi, la **nouvelle archi a TOUJOURS raison**. Jamais l'inverse.

**How to apply:** Quand un test existant contredit une règle de la nouvelle architecture (doc/BIBLE/Architecture-cible.md, MEMORY.md), c'est le TEST qui a tort, pas la règle. Corriger le test, pas contourner la règle. Ne jamais implémenter du code pour faire passer un test hérité sans vérifier que ce comportement est toujours valide dans la nouvelle architecture.
