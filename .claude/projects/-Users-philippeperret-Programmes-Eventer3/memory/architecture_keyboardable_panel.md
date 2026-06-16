---
name: architecture-keyboardable-panel
description: TAB cycle et KeyboardablePanel — pattern clavier générique pour tous les panneaux EventerX
metadata:
  type: project
---

`KeyboardablePanel` = classe abstraite (`public/classes/ui/KeyboardablePanel.js`) pour tous les panneaux flottants EventerX.

## TAB cycle (TOUJOURS ce pattern)
1. Panneau s'ouvre → premier item sélectionné (selectedIndex=0)
2. ArrowDown/Up → navigation dans les items
3. Enter → `_onEnterItem(selectedIndex)` (action de l'item courant)
4. TAB → passe au premier faux-bouton footer ("↩︎ Exécuter")
5. Enter → action du faux-bouton
6. TAB → faux-bouton suivant ("↩︎ Fermer")
7. Enter → action
8. TAB → retour items (selectedIndex conservé)

## CSS
- `↩︎` apparaît automatiquement via `.panel-btn--focused::before` (CSS géré)
- `⇥` visible quand bouton non-focusé
- Faux-boutons = `<span class="panel-btn panel-btn--{variant}">` — AUCUN event souris

## Structure DOM
```
.floating-panel .{nom}-panel
  .floating-panel__title     ← border-bottom (1er filet)
  .floating-panel__separator ← (2e filet = double filet)
  .floating-panel__zone      ← items navigables
  .floating-panel__footer    ← faux-boutons TAB cycle
```

## Méthodes abstraites à implémenter
- `_renderContent(zone)` — rend les items dans la zone
- `_getItemCount()` — nombre d'items
- `_onEnterItem(index)` — action Enter sur item
- `_getFooterButtons()` — `[{label, variant, action}]`

**Why:** Demande récurrente depuis plusieurs sessions. Évite duplication dans NaturePanel, ToolsPanel, etc.

**How to apply:** Tout nouveau panneau flottant hérite de KeyboardablePanel, jamais de duplication du TAB cycle.
