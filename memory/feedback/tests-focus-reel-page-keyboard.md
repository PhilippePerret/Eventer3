---
name: tests-focus-reel-page-keyboard
description: Tests e2e — touches via page.keyboard (focus réel), jamais locator.press qui masque les bugs de focus
metadata:
  type: feedback
---

Dans les tests e2e Playwright, envoyer les touches via **`press(page, key)`**
(= `page.keyboard.press`, dans `__setup__.js`) → la touche va à l'élément
**réellement focusé**. **Ne PAS utiliser `locator('…').press(key)`.**

**Why:** `locator.press` **force** le focus sur la cible avant de taper → si
l'app focus mal, le test passe quand même (cible explicite) → **faux positif**,
tout casse en live. `page.keyboard.press` tape sur le focus réel → si l'app
focus mal, le test **échoue** → test honnête. Préférence forte de l'utilisateur :
ne jamais « faker » un point essentiel de l'implémentation.

**Vérifié 2026-06-28** (test SONDE) : l'app focus l'item sélectionné du panneau
actif à CHAQUE transition. Chaîne réelle :
- `goto` → `.project-item.selected`
- `→` (entrée projet) → `.event-item.selected`
- `b` → `.brin-item.selected`
- `p` → `.perso-item.selected`
Mécanique : `Lister.render()` → `focusSelected()` → `item.el.focus()` ; les
listeners clavier sont par item (`KeyDispatcher` sur `el`).

**How to apply:**
- Touches : toujours `press(page, key)`.
- Pour prouver le focus n'importe où : `await hasFocus(page, '<selector>')`
  (assertion qui échoue si le focus est ailleurs/absent — zéro faux positif).
- Pour découvrir/logguer le focus réel : `await focusInfo(page)`.
- Les 3 helpers sont dans `tests/specs/e2e/__setup__.js`.

Lié à [[project_persos_marks_refresh]].
