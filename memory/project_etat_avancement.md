---
name: project_etat_avancement
description: État d'avancement Eventer3 — fonctionnalités complètes et prochaine étape
metadata:
  type: project
---

Session 2026-06-16 : toutes les régressions résolues. 642 e2e + 101 unit tests verts.

Fonctionnalités complètes :
- Mode LEVEL (affichage par profondeur) ✓
- Mode NESTING (imbriqué) ✓
- Consolidation de niveau (⌘⇧C, panneau outils) ✓
- KeyboardablePanel (panneaux flottants clavier, déplaçables) ✓
- TargetsPanel refactorisé → hérite KeyboardablePanel ✓
- MOVABLE_PANEL_IDS → `.keyboardable-panel` générique ✓
- Fixture `consolidate-level` dédiée au module _tdd (évite interférence avec depth-move) ✓

**Prochaine étape : mode TREE**

**Why:** progression naturelle après LEVEL — prochain mode d'affichage à implémenter.
**How to apply:** démarrer par les specs dans _tdd/, TDD strict.
