# Refactor TargetsPanel → KeyboardablePanel (session 2026-06-16)

TargetsPanel a été refactorisé pour hériter de KeyboardablePanel.

**Avant :** TargetsPanel avait sa propre gestion DOM (_buildDOM, _render, pushMode manuel)
**Après :** TargetsPanel étend KeyboardablePanel — élément créé dynamiquement, classe `kpanel` automatique

**Raison :** MOVABLE_PANEL_IDS utilise `.kpanel` comme sélecteur générique.
Tous les panneaux déplaçables DOIVENT avoir cette classe, donc DOIVENT étendre KeyboardablePanel.

**Panels concernés :** ToolsPanel ✓, TargetsPanel ✓ (refactorisé ce jour)
**Panels futurs :** aide contextuelle et tout nouveau panneau flottant clavier → doit étendre KeyboardablePanel
