# Architecture Brief — Eventer3

> Lire en début de séance. Toute l'info nécessaire pour coder sans re-explorer.

---

## Entrypoints

| Fichier | Rôle |
|---|---|
| `app.rb` | Sinatra ; routes `GET/PATCH /data/*` ; `Bootstrap.ensure_initial_data!` sur chaque requête |
| `public/app.js` | `App.start()` → `ProjectLister.init()` |
| `public/config.js` | `window.APP_UI_MODES` (raccourcis footer) + `window.APP_CONFIG` (brinTypes, brinColors) |
| `public/index.html` | Structure DOM : `#main-panel`, `#shortcuts-footer`, `#brin-panel`, `#panel-overlay>#panel` |
| `public/KeyboardController.js` | Switch central `onKeyDown` ; `pushMode/popMode` pour modaux |
| `public/classes/models/Lister.js` | Classe de base : `render()`, `selectItemAt()`, `moveSelectedItem()`, `createNewItem()`, `stopEditing()`, `commitNewItem()` |
| `public/classes/models/Item.js` | Classe de base item |
| `public/classes/ui/FooterHelp.js` | `FooterHelp.update(modes)` → lit `APP_UI_MODES[mode]` → écrit dans `#shortcuts-footer` |
| `public/classes/repositories/ListerRepository.js` | PATCH/PUT vers le serveur ; `loadDefinition`, `loadItems`, `save`, `saveItems`, `createItem`, `createLister` |

---

## Héritage des classes

```
Lister
├── ProjectLister   (uiModes: ['projects'])
├── EventLister     (uiModes: ['listerRoot','eventsRoot'])  childListerClass: EventLister
└── BrinLister      (uiModes: ['listerRoot','modalPanel'])  rendu dans #brin-panel, pas #main-panel

Item
├── Project    idPrefix: null  (id = slug du titre)
├── Event      idPrefix: 'e'   (e1, e2…)
├── Brin       idPrefix: 'b'   (b1, b2…)
└── Perso      idPrefix: 'p'   (p1, p2…)
```

---

## KeyboardController — dispatch (mode normal)

| Touche | Action |
|---|---|
| `Enter` | `activeLister.editSelectedItem()` |
| `n` | `createNewItem()` (avant) / `createNewItemAfter()` si `⌥n` |
| `Space` | `toggleSelectedItemChecked()` |
| `b` | `activeLister.openBrinPanel()` |
| `ArrowRight` | `enterSelectedItem()` |
| `ArrowLeft` | `leaveToParent()` |
| `ArrowDown/Up` | `selectNextItem()` / `selectPreviousItem()` |
| `⌘ArrowDown/Up` | `moveSelectedItemDown/Up()` |
| `Escape` | `activeLister.close()` |
| `⌘Enter` | `activeLister.close()` (global, avant tout) |
| `Delete` | **À implémenter** → `deleteSelectedItem()` |
| `⌘c` | **À implémenter** → copie item sélectionné (sans id) |
| `⌘x` | **À implémenter** → coupe item sélectionné (avec id) ; interdit sur dernier item |
| `⌘v` | **À implémenter** → colle au-dessus sélection ; cross-panel même type OK ; cross-type bloqué |
| `?` | **À implémenter** → ouvre panneau raccourcis |

Modes spéciaux (modeStack) : `item-edition` (champs input/select), `popup-select`.  
Édition contentEditable : `activeLister.editing === true` → `_handleEditingKeyDown`.

---

## APP_UI_MODES (config.js)

| Mode | Utilisé par |
|---|---|
| `projects` | ProjectLister (contient `⌦ supprimer`) |
| `listerRoot` | EventLister, BrinLister (contient `⌦ supprimer`) |
| `eventsRoot` | EventLister en plus de listerRoot (`b`,`p`,`o`) |
| `itemEditing` | pendant l'édition (`⇥`,`⏎`,`␛`) |
| `modalPanel` | BrinLister (`⌘⏎ fermer`) |

---

## Fixtures de test

| Fixture | Contenu |
|---|---|
| `many-projects` | Projet A (idx 0), Projet B (idx 1), Projet C (idx 2) |
| `many-events` | project-a (hl:true, events e1/e2/e3), project-b |
| `with-brins` | project-a, events e1/e2, brins b1 (MON, non-coché) / b2 (AUT, coché pour e1) |
| `deep-events` | events imbriqués (pour tests enter/leave) |
| `projects-edition` | pour tests édition projets |
| `two-projects-events` | project-a (e1/e2/e3 lister_id=2), project-b (e4/e5 lister_id=3) — pour tests cross-panel paste |

---

## Sélecteurs Playwright fréquents

| Élément | Locator |
|---|---|
| Panel principal | `#main-panel` |
| Liste projets active | `#main-panel.project-list` |
| Liste events active | `#main-panel.event-list` |
| Items projets | `.project-item` |
| Items events | `.event-item` |
| Items brins | `.brin-item` |
| Brin sélectionné | `.brin-item.selected` |
| Event sélectionné | `.event-item.selected` |
| Panneau brins | `#brin-panel` |
| Footer raccourcis | `#shortcuts-footer` |
| Badge brin dans event | `.event-brins-badges .badge.brin` |
| Titre brin | `.brin-item__title` |
| Badge brin | `.brin-item__badge` |
| Notification (à créer) | `#notification` |
| Panneau raccourcis (à créer) | `#shortcuts-panel` |

---

## Conventions ID

- Project : slug du titre (`mon-projet`)
- Event : `e1`, `e2`…
- Brin : `b1`, `b2`…
- Perso : `p1`, `p2`…

---

## Règles de dev à respecter

- **TDD strict** : test RED → code → GREEN
- Import tests : toujours depuis `__setup__.js`, jamais `@playwright/test`
- `installFixtures('nom')` dans `beforeEach` ou au niveau module
- `Lister`/`Item` : ne jamais dupliquer dans une sous-classe ce qui existe dans la base
- Loi de Déméter : déléguer via méthode statique, ne pas câbler les détails d'une autre classe
- Séparation des responsabilités : FooterHelp, PopupSelect = classes dédiées
- `lister_id` d'un Item = id de son Lister enfant, PAS son appartenance (appartenance = `item_ids` du Lister parent)
- Pas de commentaires sauf WHY non-obvious

---

## État courant (2026-06-04)

- 97 tests verts
- En cours : `Delete` pour supprimer un item (keyboard-delete.spec.js — phase RED)
- TDD RED écrit : ⌘+c/⌘+x/⌘+v (keyboard-copy-cut-paste.spec.js)
- Skippés pour plus tard : panneau des raccourcis (`?`), Persos, Options, CSS brins/projet
