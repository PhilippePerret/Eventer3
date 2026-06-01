---
name: project-defauts-live
description: Liste des défauts trouvés en test live (2026-06-01), à corriger un par un après que les tests correspondants sont écrits
metadata:
  type: project
---

Défauts à corriger un par un (dans cet ordre suggéré) :

1. **brin-nouveau-selection** — Nouveau brin ne se sélectionne pas à la création ; son affichage est cassé (classes CSS manquantes `panel-row brin-row`)
   - Test : `tests/specs/e2e/brin/brin-nouveau.spec.js`

2. **brin-couleur-creation** — Nouveau brin a la même couleur que le précédent à la création (corrigé seulement à la réouverture du panneau)
   - Test : `tests/specs/e2e/brin/brin-nouveau.spec.js`

3. **brin-form-edition** — Formulaire d'édition des brins est visuellement cassé (inputs remplacent des divs stylés, mise en page détruite)
   - Test : `tests/specs/e2e/brin/brin-edition-form.spec.js`

4. **event-state-popup-vide** — Popup de sélection d'état des events semble vide visuellement (options dans DOM mais peut-être invisibles CSS)
   - Test : `tests/specs/e2e/event/event-state-popup-visible.spec.js`

5. **footer-aide** — Aucune aide dans le footer (shortcuts) sauf dans le panneau brins
   - Test : `tests/specs/e2e/ui/footer-aide.spec.js`

6. **cmd-n-en-dessous** — Cmd+n devrait créer l'item EN DESSOUS de la sélection (pour tous les listers)
   - Test : `tests/specs/e2e/keyboard-cmd-n.spec.js`

7. **brin-texte-trop-petit** — Texte des brins trop petit (probablement idem pour persos)
   - Correction CSS directe, pas de test Playwright

8. **projet-edition-hauteur** — Formulaire d'édition projet plus haut que l'affichage normal (moche)
   - Correction CSS directe, pas de test Playwright

**Why:** Bugs découverts en test live après que les 82 tests e2e passent.
**How to apply:** Traiter UN défaut à la fois. Écrire le test d'abord (TDD), le faire passer, puis passer au suivant.
