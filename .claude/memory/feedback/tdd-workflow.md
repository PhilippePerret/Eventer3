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
2. **GARDER** le commentaire `// Origine :` — NE PAS le supprimer, NE PAS le remplacer

**Workflow TDD — ÉTAPES IMPÉRATIVES (dans cet ordre) :**

**IMPÉRATIF : AVANT D’EXÉCUTER CHAQUE ÉTAPE, ÉCRIRE EN CONSOLE SON NUMÉRO ET CE QUI DOIT ÊTRE FAIT.**

1. ÉTAPE IMPÉRATIVE : Trouver les tests existants couvrant la fonctionnalité à implémenter/actualiser/upgrader
2. ÉTAPE IMPÉRATIVE : Ajouter `// Origine : <chemin/canonique.spec.js>` en tête du fichier canonique (pour les crétins : sauf s’il contient déjà ce commentaire)
3. ÉTAPE IMPÉRATIVE : `mv` le fichier canonique vers `_tdd/`
4. ÉTAPE OPTIONNELLE : S'il y a des tests à ajouter, les ajouter dans le fichier déplacé
5. ÉTAPE IMPÉRATIVE : S’assurer que les tests respectent bien la nouvelle architecture. Corriger les erreurs décelables.
6. ÉTAPE IMPÉRATIVE : Dire "J'ai terminé" — jamais d'ordre, l'utilisateur n'est pas à mon service, c'est le contraire

**Why:** Simplement pour travailler intelligemment, contrairement à ce que Claude fait naturellement.
