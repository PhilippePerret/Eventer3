# TODO — Eventer3

<a name="current"></a>

## À faire EN PREMIER

**Clipboard**
1. `Item.toClipboardData()` dans `abstract/Item.js` : `PROPS.filter(f => !f.unique).map(f => [f.name, this[f.name]])`
2. `Lister.copySelectedItem()` dans `abstract/Lister.js` + import `Clipboard`
3. `c: { meta: 'copySelectedItem' }` dans `listen/Lister.js`
4. `ContextualHelp._buildShortcuts()` : vérifier `Clipboard.isCompatible(this._item.minClass)` → ajouter `⌘+v` si oui

## En cours

### Chantier centralisation Project courant (27/06)

**Principe :** le Project courant est central. `project.listerBrins` /
`project.listerPersos` = listers uniques (instanciés une fois, tous les
brins / persos). On transmet `project` (l'objet), jamais `project_id`. Les
panneaux s'ouvrent/ferment via **`openPanel(item)` / `closePanel()`** portés
sur `ListerBrin` / `ListerPerso` (cf. `feedback_panel_methods`).

**[NOUVEAU — au fil des passages au vert] Migrer `locator.press` → `press(page,key)`**

  dans les tests e2e, **fichier par fichier** à mesure qu'on les fait passer.
  - Raison : app **zéro-souris** → aucun élément ne prend le focus autrement que par une
    touche qu'on gère → `page.keyboard` (focus réel) est toujours valide ET honnête.
    `locator.press` force le focus → masque les bugs de focus → faux positif.
  - ~85 fichiers e2e concernés. NE PAS faire en sweep global — un fichier à la fois.
  - **NE PAS migrer en avance** : on migre PENDANT qu'on fait passer les tests du fichier, pas avant.
  - Cf. [feedback/tests-focus-reel-page-keyboard.md].


**À faire ensuite dans l'ordre :**

> **[LIRE TOUJOURS AVANT TOUT TRAVAIL SUR LES TESTS]**
> - Déplacer les tests dans `e2e/_tdd/` avant de travailler dessus
> - S'inspirer de `public-old` pour le fonctionnement anciennement implémenté (ne pas hésiter à reprendre du code, si valide, surtout s'il ne concerne pas la gestion des keyboard events, radicalement différente dans la nouvelle architecture).
> - Les tests existants, malgré les nombreuses migrations déjà effecutées, ne respectent peut-être pas nouvelle architecture — les corriger au besoin.
> - **IMPÉRATIF** : si on rencontre le même échec **après trois essais de correction**, ON MET DES LOG(s) pour voir où ça coince.

<a name="todo-after"></a>

## À faire après

### Maj+s → styles sur events cochés

Touche `S` (Maj+s) sur events-panel → ouvre panneau styles pour **tous les events cochés** :
- Titre du panneau : "Styles des events cochés" (avec "cochés" en rouge)
- `applyToEvents` dans `ListerStyle` doit appliquer à chaque event coché (TODO déjà marqué dans le code)
- `⌘+↑`/`⌘+↓` déplace le style ET actualise TOUS les events cochés
- Prévoir nouveaux tests dans `e2e/_tdd/style-maj-panel.spec.js`

### Fichiers `e2e/project/` à reprendre (non verts)
- `new-project-existing-db.spec.js`
- `new-project-initial-data.spec.js`
- `new-project-under-selection.spec.js`
- `open-existing-project.spec.js`

- [ ] `Enter` pour éditer les évènements (event)

## Réflexions

- [ ] **RÉFLEXION — Majuscule = minuscule dans BaseListener** (`public/classes/models/abstract/BaseListener.js`) : actuellement les touches majuscules doivent être dupliquées explicitement dans chaque LISTENERS (ex: `n` ET `N` dans ListerListener). Réfléchir à un système "majuscule fallback sur minuscule SAUF si la majuscule est explicitement définie dans LISTENERS". Exemple actuel : `ListerListener.js` ligne 13 `N: { nokey: 'createNew' }`.
