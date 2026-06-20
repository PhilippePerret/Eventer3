---
name: feedback_panel_btn_labels
description: Labels des panel-btn = texte simple, sans ↩︎ ni ⇥ — le CSS les gère automatiquement
metadata:
  type: feedback
---

Les boutons dans les footers de panels (`panel-btn`) ont TOUJOURS leurs préfixes gérés par CSS :
- `panel-btn::before` → affiche `⇥ ` (indicateur Tab) sur tous les boutons
- `panel-btn--focused::before` → remplace par `↩︎ ` quand le bouton est focusé (Tab cycle)

**Why:** Le CSS fait ce travail automatiquement. Mettre `↩︎ Utiliser` dans le label crée un doublon affreux "⇥ ↩︎ Utiliser". L'utilisateur a été furieux plusieurs fois pour cette erreur.

**How to apply:** Labels toujours simples : `'Annuler'`, `'Utiliser'`, `'Confirmer'`, `'Détruire'`. JAMAIS de `↩︎` ou `⇥` dans les labels. Et TOUJOURS un titre passé à KeyboardablePanel (paramètre `title`).
