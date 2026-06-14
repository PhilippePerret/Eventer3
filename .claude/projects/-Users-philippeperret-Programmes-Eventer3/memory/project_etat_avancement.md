---
name: project-etat-avancement
description: État d'avancement Eventer3 — dernière session et prochaines étapes
metadata:
  type: project
---

Session 2026-06-14 : tout vert (576 tests).

**Implémenté cette session :**
- ConstantsPanel UI : footer boutons bordurés, header "Constante/Remplacer par…", Shift+Tab, Cmd+Enter ferme
- `Texte.replaceTokens` : constantes normales (literal) + regex (`/pattern/`) + badges (`\b`) — `_replaceConstants` et `_replaceBadges` séparés
- Token replacement dans TOUS les items (Event, Brin, Perso) via `Lister._loadTokens` + `_renderTokens` + `item._tokens`
- Panneau brins/persos : headers avec tokens
- Post-ConstantsPanel : load tokens AVANT de cacher le panneau
- Fix Tab navigation édition : `triggerElement.focus()` dans `_openPopupSelect.onSelect`
- Fix cut/paste race condition : `_performDelete()` helper synchrone dans Lister
- Fix brin/perso delete persistance : `_countCascade` override → 0 dans BrinLister + PersoLister

**Prochaines features (split-pane suite, cf. mémoire project_split_pane_suite.md) :**
1. Cmd+2 popup vertical/horizontal
2. Focus visible pane actif
3. Cible dans autre pane

**Why:** Ces features étaient listées comme prochaines avant le travail constants/tokens de cette session.
**How to apply:** Reprendre avec TDD depuis split-pane-suite.
