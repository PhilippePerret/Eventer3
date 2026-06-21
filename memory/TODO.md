# TODO — Eventer3

<a name="current"></a>

## En cours

### FilePicker — corrections et conformité aux règles

**Plan de bataille :**
1. [x] `mv _tdd/new-project-existing-db|initial-data|under-selection|open-existing-project` → `e2e/project/` *(à reprendre, non verts — voir ci-dessous)*
2. [x] `mv filesystem/filepicker.spec.js` → `_tdd/filepicker.spec.js`
3. [ ] Modifier `_tdd/filepicker.spec.js` pour comportement attendu → RED
4. [ ] Confirmer RED
5. [ ] Corriger FilePicker → GREEN

**Violations FilePicker à corriger :**
- `Escape` ferme le FilePicker → INTERDIT (`Escape` = annuler édition seulement — reste valide en mode création dossier)
- Tab = cycle : Liste → faux-bouton Arborescence (`ftpanel-btn--focused`) → faux-bouton Fermer → Liste
  - Enter sur Arborescence focusée → ouvre PopupSelect (liste dossiers parents, `showSearch:false`)
  - Enter sur Fermer focusé → ferme FilePicker
- Arborescence = `PopupSelect` (remplacer `_pathMenuEl` maison) — `showSearch: false`
- Bouton `↩︎` → renommer "Choisir" + remonter AU-DESSUS de la liste (à droite, pas dans footer) — pas dans cycle Tab, activé par Enter quand dossier sélectionné dans liste
- Bouton "Fermer" = faux-bouton `<span class="ftpanel-btn">` dans footer (remplace `<kbd>␛</kbd>`) — CSS ajoute ⇥/↩︎ automatiquement
- **Focus restauré : `ProjectLister` passe `restoreFocusTo: element` à `FilePicker.open()`** — `_close()` appelle `this._restoreFocusTo?.focus()` — JAMAIS `document.activeElement`
- Même pattern `restoreFocusTo` pour `KeyboardablePanel.open()` / `close()`

**Fichiers `e2e/project/` à reprendre :**
- `new-project-existing-db.spec.js`
- `new-project-initial-data.spec.js`
- `new-project-under-selection.spec.js`
- `open-existing-project.spec.js`

### Bugs navigation (après FilePicker)

**Bug 1 — Annuler coupe toutes les touches**  
Après fermeture via bouton Fermer : focus perdu, plus aucune touche ne répond.  
Fix : FilePicker (et KP) sauvegarde l'élément focusé avant ouverture, restaure à la fermeture.

**Bug 2 — Flèches sautent de 2 en 2 après choix projet**  
Après création/import d'un projet, ArrowUp/ArrowDown saute deux items à la fois.  
Cause probable : `ListerDom.render()` appelle `Listener.attach(container)` à chaque rendu sans retirer l'ancien.  
Fix attendu : `attach()` retire l'ancien listener, OU `render()` vérifie si déjà attaché.

<a name="todo"></a>

## À faire

- [ ] Implémenter ArrowRight → event-list (EventLister à créer dans nouvelle archi)
- [ ] `⌘↓` / `⌘↑` pour déplacer les projets
- [ ] `Enter` pour éditer les évènements (event)

<a name="done"></a>

## Fait

- [x] 2026-06-21 — KeyboardablePanel.open() : `this._el.focus()` pour recevoir les keydown
- [x] 2026-06-21 — Test open-existing-project : séparé en 2 tests distincts (import / ArrowRight)
- [x] 2026-06-21 — Rationalisation CSS panneaux : ftpanel/kpanel, suppression confirm-dialog, bouton focusé par défaut
- [x] 2026-06-21 — KeyboardablePanel.js : bouton focusé à l'ouverture (index 0)
- [x] 2026-06-21 — KeyboardablePanel.js : listener keydown corrigé (bon élément)
- [x] 2026-06-20 — FilePicker : bug frappe nouveau dossier
- [x] 2026-06-20 — FilePicker : portage nouvelle architecture (tabindex, createNew, project_order)
- [x] 2026-06-20 — Édition projet : Correction bugs relevés en live
- [x] 2026-06-19 — Liste des projets s'affiche au lancement avec données leurs PROPS
- [x] 2026-06-19 — Navigation ↑/↓ pour sélectionner un projet
