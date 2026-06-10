# Architecture Brief — Eventer3

> Lire en début de séance. Toute l'info nécessaire pour coder sans re-explorer.

---

## Entrypoints

| Fichier | Rôle |
|---|---|
| `app.rb` | Sinatra ; routes `GET/PATCH /data/*` ; `Bootstrap.ensure_initial_data!` sur chaque requête |
| `public/app.js` | `App.start()` → `ProjectLister.init()` |
| `public/config.js` | `window.APP_UI_MODES` (raccourcis footer) + `window.APP_CONFIG` (brinTypes, brinColors) |
| `public/index.html` | Structure DOM : `#main-panel`, `#shortcuts-footer`, `#shortcuts-panel`, `#notification`, `#brin-panel`, `#panel-overlay>#panel` |
| `public/constants.js` | ES module — `export const SHORTCUTS` (format doc, 4 contextes) — chargé comme `<script type="module">` |
| `public/config.js` | **Script classique** (pas `type="module"`) — `window.APP_UI_MODES` + `window.APP_CONFIG` — NE PAS y mettre `export` |
| `public/KeyboardController.js` | Switch central `onKeyDown` ; `pushMode/popMode` pour modaux |
| `public/classes/ui/ShortcutsPanel.js` | Lit `window.APP_UI_MODES` (pas SHORTCUTS), affiche dans `#shortcuts-panel`, navigation par contextes |
| `public/classes/models/Lister.js` | Classe de base : `render()`, `selectItemAt()`, `moveSelectedItem()`, `createNewItem()`, `stopEditing()`, `commitNewItem()` |
| `public/classes/models/Item.js` | Classe de base item |
| `public/classes/ui/FooterHelp.js` | `FooterHelp.update(modes)` → lit `APP_UI_MODES[mode]` → écrit dans `#shortcuts-footer` |
| `public/classes/repositories/ListerRepository.js` | PATCH/PUT vers le serveur ; `loadDefinition`, `loadItems`, `save`, `saveItems`, `createItem`, `createLister` |

---

## Héritage des classes

```
Lister
├── ProjectLister   (uiModes: ['projects']) ???
├── EventLister     (uiModes: ['listerRoot','eventsRoot']) childListerClass: EventLister ???
└── BrinLister      (uiModes: ['listerRoot','modalPanel'])  ??? rendu dans #brin-panel, pas #main-panel

Lister
├── ProjectLister    items: Project
├── EventLister      items: Event
├── BrinLister       items: Brin
└── PersoLister      items: Perso

Item
├── Project    idPrefix: null  (id = slug du titre)
├── Event      idPrefix: 'e'   (e1, e2…)
├── Brin       idPrefix: 'b'   (b1, b2…)
└── Perso      idPrefix: 'c'   (p1, p2…)
```

---

## KeyboardController — dispatch (mode normal)

Cf. [Specs-Keyboard.md](../Specs-Keyboard.md)

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
| <span style="white-space:nowrap;">`two-projects-events`</span> | project-a (e1/e2/e3 lister_id=2), project-b (e4/e5 lister_id=3) — pour tests cross-panel paste |

---

## Sélecteurs Playwright fréquents

| Élément | Locator |
|---|---|
| Panel principal | `#main-panel` |
| Liste projets active | `#main-panel.project-list` |
| Liste events active | `#main-panel.event-list` |
| Items projets | `.project-item` |
| Items events | `.event-item` |
| Event sélectionné | `.event-item.selected` |
| Panneau brins | `#brin-panel` |
| Items brins | `.brin-item` |
| Titre brin | `.brin-item__title` |
| Badge brin dans event | `.event-brins-badges .badge.brin` |
| Brin sélectionné | `.brin-item.selected` |
| Footer raccourcis | `#shortcuts-footer` |
| Badge brin | `.brin-item__badge` |
| Item id (sur chaque item) | `[data-id]` ex: `.event-item[data-id="e1"]` |
| Notification | `#notification` (géré par `public/classes/ui/Notification.js`) |
| Panneau raccourcis | `#shortcuts-panel` (géré par `ShortcutsPanel.js`) |

---

## Conventions ID

- Project : slug du titre (`mon-projet`) ou `p1`, `p2`… lors de copies.
- Event : `e1`, `e2`…
- Brin : `b1`, `b2`…
- Perso : `c1`, `c2`…

---

## Règles de dev à respecter

- **TDD strict** : test → RED → code → GREEN
- on crée d’abord le test dans le dossier `_tdd` qui existe pour chaque cas (tests e2e, ruby, unit). Et lorsqu’il passe au vert, on demande à l’utilisateur de le déplacer vers son dossier canonique (ni `mv`, ni `cp`).
- Import tests : toujours depuis `__setup__.js`, jamais `@playwright/test`
- `installFixtures('nom')` dans `beforeEach` ou au niveau module
- `Lister`/`Item` : ne jamais dupliquer dans une sous-classe ce qui existe ou devrait exister dans la base
- Le `type` d’un `Item` (`Project`, `Event`, `Brin`, `Perso`, `Script`) n’est JAMAIS la classe spécialisée minorisée de l’item. Le type de `Project` n’est JAMAIS `perso`, le `type` d’un `Event` n’est JAMAIS `event`, le `type` d’un `Perso` n’est JAMAIS `perso`. Voir les [types possibles](../dev/Specs-modeles.md#item-types) dans le document des modèles.
- Loi de Déméter : déléguer via méthode statique, ne pas câbler les détails d'une autre classe
- Séparation des responsabilités : FooterHelp, PopupSelect, ShortcutsPanel, Notification = classes dédiées
- `lister_id` d'un Item = id de son Lister enfant, PAS son appartenance (appartenance = `item_ids` du Lister parent)
- `commitNewItem` : après `item.id = created.id`, appeler `item.render(itemElement)` pour afficher l'id généré par le serveur
- Notification titre vide : dans `handleEditionKeyDown`, Enter/Escape sur item temporaire sans titre → `Notification.show(...)` + `return` (garder l'éditeur ouvert)
- Lister virtuel vide : `cancelEditor` sur lister avec `domItems.length === 0` → notification au lieu d'écran blanc
- `config.js` est un script **classique** (sans `type="module"`) — mettre `export` dedans casse tout → `APP_UI_MODES` undefined
- Pas de commentaires sauf WHY non-obvious

---

## État courant (2026-06-04)

- Tests : tous verts (108+)
- **Implémenté** : panneau raccourcis (`?` / `⌘Enter` / `⌘↑↓`), notifications titre vide, fix 404 `/api/items/:id/lister`
- En cours : `Delete` pour supprimer un item (keyboard-delete.spec.js — phase RED)
- À faire : Persos, Options, CSS brins/projet, ⌘+c/⌘+x/⌘+v
