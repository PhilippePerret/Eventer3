---
name: pas-de-bug-mais-implementation
description: Un test qui échoue pendant la reconstruction n'est pas un "bug"/"régression" — c'est de l'implémentation pas encore faite
metadata:
  type: feedback
---

L'app a été volontairement détruite et reconstruite from scratch en TDD à partir d'une base de +700 tests existants (ancien code plein de duplications, responsabilités mal dispatchées). Donc quand un test échoue, ce n'est presque jamais un "bug" ou une "régression" — c'est une fonctionnalité qui n'a tout simplement pas encore été câblée dans la nouvelle architecture.

Exemple concret : `brin_ids`/`perso_ids` absents de `Event.save()` (jamais transmis au backend) — pas un bug, juste pas encore implémenté. Pareil à prévoir pour les autres classes (Brin, Perso, Project…) au fur et à mesure.

**Why:** Reconstruction intentionnelle et radicale (cf. [[nouvelle-archi-difference]]). Appeler ça un "bug" laisse croire à une régression accidentelle alors que c'est juste du travail restant, normal à ce stade.

**How to apply:** Devant un test rouge, ne jamais dire "bug"/"régression" sauf preuve que ça marchait déjà dans la nouvelle archi et a cassé. Par défaut : décrire le manque factuellement ("X n'est pas câblé/persisté/implémenté"), proposer l'implémentation manquante. Voir aussi [[tests_heritage_ancienne_archi]] pour la légitimité des tests existants face à la nouvelle archi.
