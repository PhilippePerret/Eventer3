---
name: project-etat-avancement
description: État d'avancement Eventer3 — dernière session et prochaines étapes
metadata:
  type: project
---

Session 2026-06-15 : mode LEVEL fonctionnel, 2 régressions à corriger.

**Implémenté (session 2026-06-15) :**
- Mode LEVEL : `_isManLister()`, `_collectItemsAtDepth()`, `_renderLevelMode()` — 12 tests verts dans `_tdd/`
- `leaveToParent()` override en LEVEL mode → `navigateToItem(selectedItem.id)` (Bug 2b)
- `toggleDisplayMode()` : LEVEL→NESTING appelle `navigateToItem` + `StatusBar.suppressUpdates` (Bug 2)
- data_ini_state : 2e projet ajouté (UUID 00000000-0000-0000-0000-000000000002)
- Fixtures : `man-level-mode` (e99 feuille), `man-nature-explicit`

**Régressions en cours (laissées dans _tdd/) :**
1. `consolidate-level.spec.js` — race condition : StatusBar.suppressUpdates ajouté mais a introduit un autre bug, laissé en _tdd
2. `shortcuts-panel.spec.js (_tdd/)` — `?` remplacé par `Meta+?`, mais test encore à vérifier

**Prochaine feature :**
- Mode TREE : afficher TOUS les events du projet avec indentation (profondeur), comme macOS liste vue tout déplié
- Cmd+m → PopupSelect 3 modes (NESTING / LEVEL / TREE)
- Cmd+← en mode TREE : fold/collapse lister (persisté en DB, colonne `collapsed` dans listers)
- Navigation TREE : items visibles uniquement (fold + filtre respectés)
- Partie "left" des events à la demande (item sélectionné uniquement, touche TBD)

**Why:** Analyse trop longue sur la race condition (20+ min) → session interrompue avant d'aborder TREE.
**How to apply:** TDD strict. Reprendre régressions AVANT d'implémenter TREE.
