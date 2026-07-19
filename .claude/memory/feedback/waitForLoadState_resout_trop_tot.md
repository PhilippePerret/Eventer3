---
name: waitForLoadState-resout-trop-tot
description: page.waitForLoadState('networkidle') résout immédiatement si la frame est déjà idle — utiliser toHaveCount à la place
metadata:
  type: feedback
---

`page.waitForLoadState` est surchargé dans `tests/specs/e2e/__setup__.js` pour appeler `pane1Frame.waitForLoadState('networkidle')`. Si la frame est déjà en état networkidle depuis le chargement initial, la promesse se résout IMMÉDIATEMENT, avant que les fetch lancés par l'action testée (pasteItem, _reloadAt…) ne complètent.

**Why:** Découvert sur les tests 11+12 (copy-cut-paste ListerProject). DOM correct dans le browser (confirmé par LOGs), test lisait quand même l'ancien DOM.

**How to apply:** Jamais `await page.waitForLoadState('networkidle')` pour attendre qu'une action async modifie le DOM. Utiliser `await expect(locator).toHaveCount(n)` ou `toHaveText(...)` qui pollent jusqu'à ce que le DOM soit à jour.

Lié à [[tests-focus-reel-page-keyboard]].
