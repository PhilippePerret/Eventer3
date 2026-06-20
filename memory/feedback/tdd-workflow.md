---
name: feedback_tdd_workflow
description: TDD pendant refactorisation majeure — tests dans _tdd/, déplacement avec mv, Claude remet en place quand vert
metadata:
  type: feedback
---

Pendant refactorisation de grande ampleur : tout fichier de test va dans `tests/specs/e2e/_tdd/`.

**Règle de déplacement vers _tdd** : TOUJOURS `mv` (Bash). Jamais Write+rm (risque de doublon si rm oublié). Jamais git checkout.

**Commentaire d'origine** : ajouter `// Origine : <chemin/canonique.spec.js>` en tête du fichier déplacé vers `_tdd/`.

**Fichiers canoniques** : ne plus exister tant que la refactorisation est en cours.

**Quand les tests _tdd passent** : CLAUDE (pas l'utilisateur) :
1. `mv` vers l'emplacement canonique
2. Supprimer le commentaire `// Origine :` 
3. Ajouter en tête : `// Refactorisé — nouvelle architecture (YYYY-MM-DD)`

**Workflow réimplémentation fonctionnalité (depuis 2026-06-20) :**
1. Trouver le test existant qui couvre la fonctionnalité
2. `mv` vers `_tdd/` + ajouter `// Origine : <chemin canonique>`
3. Corriger tous les `body.press()` → cibler l'élément réel (nouvelle architecture)
4. Annoncer "Prêt pour RED" — l'utilisateur lance les tests, pas Claude

**Why:** L'utilisateur ne veut pas déplacer 300 fichiers lui-même. Write+rm crée des doublons si rm raté. La marque de refactorisation indique que le fichier a été traité pour la nouvelle architecture.

**How to apply:** Toujours `mv source destination` en une seule commande Bash. Toujours ajouter la marque de refactorisation dans le fichier canonique.
