# Architecture cible — Eventer3

Décisions prises lors des sessions du 2026-06-17 et 2026-06-19.

---

## ⚠️ À LIRE IMPÉRATIVEMENT — Organisation des dossiers et délégation

### CE N'EST PAS ça

```js
// ❌ PAS de classe imbriquée / DomClass statique
class Item {
  static DomClass = ItemDom
  get Dom() { return new this.constructor.DomClass(this) }
}

// ❌ PAS d'imports circulaires (Item → ItemDom → Item)

// ❌ PAS de prototype sur un getter d'instance (Dom = getter → undefined au niveau classe)
ProjectLister.Dom.prototype.method = ...

// ❌ PAS de classe avec méthodes d'instance dans dom/
export default class ProjectListerDom {
  method(lister, params){ }  // inaccessible via ProjectListerDom.method()
}
```

### C'EST ça

**Organisation par dossiers :**
- `abstract/` — base classes communes (Item, Lister, ItemDom, ListerDom, ItemRepo, ListerRepo, ItemListener, ListerListener)
- `core/` — classes domaine (Project, ProjectLister, Event, EventLister…)
- `dom/` — **objet plain** avec fonctions DOM spécifiques à chaque classe domaine
- `repo/` — fonctions repo spécifiques
- `listener/` — fonctions listener spécifiques

**Pattern délégation fonctionnelle :**

```js
// dom/ProjectLister.js — OBJET PLAIN (export default {})
export default {
  methodSpecifique(projectLister, params) {
    // projectLister = instance explicite, pas this
  }
}

// core/ProjectLister.js — wrapper de délégation
import ProjectListerDom from '../dom/ProjectLister.js'

export default class ProjectLister extends Lister {
  methodSpecifique(params) {
    return ProjectListerDom.methodSpecifique(this, params)
  }
}
```



Bien comprendre que les dossiers **ne servent qu’à savoir où se trouvent les choses, où elles sont définies**. Mais pour le reste, les méthodes et les données sont TOUTES définies soit dans `Item` (et ses descendants) pour les objets (event, projet, brin, etc.) soit dans `Lister` (et ses descendants pour les listes d’items.

On ne prémunie des collisions de nom de fonction/variables/constantes/propriétés en dévelopant en TDD.

~~~javascript
// dans repo/Lister.js
export default {
~~~

Et : 

~~~javascript
// dans abstract/Lister.js
import ListerRepo form '../repo/Lister.js

export default class Lister {
  ...
}
  
Object.assign(Lister.prototype, ListerRepo)
~~~

Et la classe descendantes peut hériter de tout ça:

~~~javascript
// Dans core/Event.js

import Item from '../abstract/Item.js'

export default Event extends Item {
  ...
}
~~~

Donc, après ça : 

~~~javascript
event = new Event({...})
                   
event.save() // sauve l'item event
~~~

Les dossiers





---

## Todo (Claude — ne pas effacer)

- [ ] Renommer `KeyboardController` → `AppKeyboardManager` partout (code + commentaires + architecture-brief)
- [ ] Supprimer `Shift+Tab` inter-panes de `KeyboardController.js` lignes 167–176
- [ ] `⌘⇧C` : retirer `consolidateLevel` — réaffecter à "copier tous les items cochés" (`ListerListener`)

---

### Principe
Les tests E2E passent = l'app fonctionne. Avancer fonctionnalité par fonctionnalité jusqu'à ce que toute la suite soit verte.

---

> ⚠️ **Avertissements**
> - **Code ≠ cible** : la refactorisation est en cours. Le code existant peut contredire ce document — c'est ce document qui fait foi.
> - **Architecture-brief ≠ cible** : `BIBLE/_architecture-brief.md` décrit l'ancienne architecture et peut contredire ce document — c'est ce document qui fait foi.

---

## Principe fondamental

Toute donnée est soit un `Item`, soit un `Lister`. Les sous-classes (`Event`, `Project`, `Brin`, `Perso` / `EventLister`, `ProjectLister`…) héritent sans réécrire ce qui existe déjà dans les bases.

---

## Structure des classes de base

Chaque côté (Item / Lister) est composé de 4 couches distinctes :

```
Item                              Lister
────────────────────              ──────────────────────
ItemCore     → données pures      ListerCore   → données pures
ItemRepo     → persistance        ListerRepo   → persistance
ItemDom      → DOM                ListerDom    → DOM (conteneur seul)
ItemListener → clavier            ListerListener → clavier
────────────────────              ──────────────────────
```

### Composition (pas héritage en chaîne)

`Item` hérite de `ItemCore`. Les autres couches sont des **objets délégués**, initialisés à la demande :

```js
class Item extends ItemCore {
  get Dom()      { return this._dom      ?? (this._dom      = new this.constructor.DomClass(this)) }
  get Repo()     { return this._repo     ?? (this._repo     = new this.constructor.RepoClass(this)) }
  get Listener() { return this._listener ?? (this._listener = new this.constructor.ListenerClass(this)) }

  static DomClass      = ItemDom
  static RepoClass     = ItemRepo
  static ListenerClass = ItemListener
}
```

Les sous-classes ne déclarent qu'une ligne pour spécialiser une couche :

```js
class Event extends Item {
  static DomClass = EventDom   // EventDom extends ItemDom
}
```

Idem pour `Lister` / `ListerCore` / `ListerRepo` / `ListerDom` / `ListerListener`.

---

## Séparation des responsabilités

| Couche | Responsabilité | Interdit |
|--------|---------------|---------|
| `ItemCore` | constructeur, propriétés, computed props | DOM, fetch, clavier |
| `ItemRepo` | create, save, delete d'un item | DOM, clavier |
| `ListerRepo` | create, save, delete d'un lister | items (délégué à ItemRepo) |
| `ItemDom` | construire et afficher le DOM d'un item | fetch, logique métier |
| `ListerDom` | conteneur DOM pur (le "dossier") | keyboard, logique |
| `ItemListener` | keydown attaché sur l'élément item | fetch, DOM structurel |

**Note** : `ListerRepository` actuel est renommé `ListerRepo` et ne traite QUE les listers. La gestion des items passe à `ItemRepo`.

---

## Keyboard

- Le `keydown` est attaché **directement sur l'élément DOM de l'item** (`tabindex="-1"`), pas sur `window`.
- Chaque item est autonome : quand il a le focus, il gère ses touches.
- `ListerDom` = conteneur passif. Pas de keyboard sur lui.
- Les raccourcis vraiment globaux (⌘S, ouverture de panneaux…) restent sur `document`.
- `.focus()` est appelé explicitement à chaque activation d'item.

### Principe fondamental du bubbling — NE JAMAIS OUBLIER

**Il n'y a pas de délégation.** Chaque acteur reçoit le `keydown` parce qu'il a le focus (ou parce que l'événement a bubblé jusqu'à lui). Un widget (popup-select, contenteditable…) qui a le focus reçoit le keydown EN PREMIER — il le traite et appelle `stopPropagation()`, ou il ne fait rien et l'événement bulle naturellement vers l'élément parent (item, lister, panneau, window). L'item ne "délègue" rien à son widget : c'est le DOM qui détermine l'ordre de réception.

### Répartition des responsabilités clavier

**`ItemListener`** — tout ce qui relève de l'item seul :
- `↩︎` (display) → bascule en mode édition
- `↩︎` (editing) → confirme et enregistre
- `⎋` (editing) → annule l'édition (UNIQUE usage d'Escape dans l'application — jamais pour fermer un panneau)
- `⎵` (display) → toggle checked
- `⎵` (editing) → le widget actif reçoit en premier (contenteditable = espace ; popup-select = ouvre menu ou coche)
- `⇥` (display) → cycle entre les liens du titre
- `⇥` (editing) → cycle entre les champs PROPS éditables
- `⌦` → suppression (l'event se propage aussi vers `ListerListener`)
- `o` → ouvre le lien focusé ; si aucun lien focusé → notification "aucun lien sélectionné"
- `⌘c` → copie l'item (l'item se connaît lui-même complètement)
- `k` → Item (toutes classes) s'ajoute en tant que cible
- `⌘k` → uniquement si editing ET champ actif = `title` → ouvre panneau des cibles pour insérer un lien
- raccourcis via `PROPS.watchedKeys` (propres à chaque sous-classe) :
  - `b` → Event uniquement → ouvre BrinPanel
  - `s` → Event uniquement → ouvre StylePanel
  - `p` → Event ET Brin → ouvre PersoPanel

**Lien-cible focusé** (élément `.item-link` avec focus DOM) :
- `o` → s'ouvre lui-même (stoppe la propagation)
- `g`, `a`, `c` → actions directes sur le lien (go / split / card)

**`ItemListener`** (base, toutes classes) — navigation structurelle descendante :
- `→` → entre dans le lister enfant de l'item
  - *Note* : c'est l'item qui gère, pas le lister — seul l'item connaît son propre lister enfant (`lister_id`). Le lister ne sait rien de l'enfant de ses items.

**`ListerListener`** — navigation inter-items (bubbling depuis les items) :
- `↑` / `↓` → item précédent / suivant **visible**
- `⌘↑` / `⌘↓` → déplace l'item vers précédent / suivant **visible**
- `n` / `⌥n` → nouvel item après / avant
- `⌘x` → coupe l'item sélectionné
- `⌘⇧x` → coupe tous les items cochés
- `⌘v` → colle
- `←` → remonte vers le lister parent
  - *Note* : c'est le lister qui gère, pas l'item — seul le lister connaît son contexte parent.
- `⌘↩︎` → ferme le panneau (BrinLister / PersoLister / StyleLister uniquement — EventLister ne se ferme pas)
- `⇧⌦` → détruit TOUS les items cochés (après confirmation) — **RÈGLE : seuls les items cochés sont traités ; l'item sélectionné mais non coché est ignoré**
- La clé : `event.target` donne l'item focusé — **pas besoin de `selectedIndex` en cache**

**`BrinListerListener`** (extends `ListerListener`) :
- `⇧p` → ouvre PersoPanel pour TOUS les items cochés
- `⌥↑` / `⌥↓` → sélectionne l'item précédent/suivant dans l'EventLister situé sous le panneau

**`PersoListerListener`** (extends `ListerListener`) :
- `⌥↑` / `⌥↓` → sélectionne dans le `backgroundLister` (référence posée à l'ouverture : EventLister ou BrinLister selon qui a ouvert le panneau)

**`EventListerListener`** (extends `ListerListener`) :
- `⌘M` → bascule le mode d'affichage (imbrication / niveau / total…)
- `⌘t` → ouvre panneau type métier projet + type métier évènemencier (même panneau que `t` sur Project, mais avec type évènemencier visible en plus) — panneau à reprendre
- `⇧b` → ouvre BrinPanel pour TOUS les items cochés
- `⇧p` → ouvre PersoPanel pour TOUS les items cochés
- `⇧s` → ouvre StylePanel pour TOUS les items cochés

**`ProjectListener`** (Project < Item, via `PROPS.watchedKeys`) :
- `t` → choisit le type métier du projet

**Règle générale Shift** : Shift + touche de panneau = même panneau mais opération sur tous les items cochés → responsabilité du ListerListener de la classe concernée, pas de l'ItemListener.

**`KeyboardablePanel`** — tout panneau flottant :
- `Ctrl+Shift+↑↓←→` → le panneau se déplace lui-même (item focusé laisse propager → KeyboardablePanel stoppe)
- `⇥` → cycle item → boutons footer → item (Tab Cycle)
- Héritage obligatoire pour tous les panneaux flottants

**`FilterBar`** :
- `:` → reçoit le focus (déclenché depuis `ListerListener`)
- `⇥` → cycle entre les propriétés de filtre

**`AppKeyboardManager`** (window-level fallback, ex-`KeyboardController`) — globaux uniquement :
- `⌘?` → aide contextuelle (l'acteur actif fournit son contexte via `getHelpContext()`)
- `Alt+1/2/0/R` → contrôle split-window
- `⌘←` / `⌘→` → cycle focus inter-panes (split)
- `q` → ouvre ConstantsPanel (constants du projet actif)
- raccourcis d'application globaux

---

## États CSS

Trois états, gérés exclusivement par CSS :

| Classe | Signification |
|--------|--------------|
| `.selected` | item courant (bleu) |
| `.checked` | item coché |
| `.editing` | item en édition (vert) |

---

## Déclaration des propriétés : PROPS

Chaque sous-classe déclare ses champs via un getter statique `PROPS`. `ItemDom.build()` itère dessus pour construire le DOM et gérer l'édition. Aucune méthode `render()` ni `getEditorFields()` à écrire.

Cette donnée définit aussi les raccourcis clavier qui seront *réactifs* suivant chaque classe.

```js
class Event extends Item {
  static get PROPS() { return [
      { name: 'title',  type: 'text' },
      { name:'state', type: 'select',values: EVENT_STATE },
      { name:'meteo', type: 'select', values: EVENT_METEO,
       		onchange: 'setEffetValuesPerMeteo' },
      { name: 'effet',  type: 'select', values: EVENT_EFFETS,
       		validIf:  'checkEffetValidity' },
      { name: 'lieu', type: 'select', values: EVENT_LIEU },
      { name: 'color',  type: 'color' },
      { name: 'brins-marks',  type: 'no-edit', 
       		editable: false, value: 'brinsBadgeMarks' },
      { name: 'persos-marks', type: 'no-edit', 
       		editable: false, value: 'persosMarks' },
    ]
  }

  setEffetValuesPerMeteo(meteo) { 
    /* restreint les valeurs d'effet */ }
  checkEffetValidity(effet)     { 
    /* valide la compatibilité meteo/effet */ }
  brinsBadgeMarks() { return '<badges des brins>' }
  persosMarks()     { return '<avatars des persos>' }
}
```

### Règles PROPS

- **Toute prop est éditable par défaut.** Seule exception : `editable: false` pour les props display-only.
- `onchange: 'methodName'` → appelé avec la nouvelle valeur dès que le champ change (live sync).
- `validIf: 'methodName'` → validation avant commit.
- `value: 'methodName'` → pour `type:'custom'`, retourne le HTML à afficher.

### Types de champs disponibles

| type | rendu | éditable |
|------|-------|---------|
| `text` | contenteditable | oui (par défaut) |
| `select` / `popup-select` | menu popup | oui |
| `color` | `<input type="color">` | oui |
| `custom` | `item[value]()` → HTML | `editable: false` requis |

D'autres types pourront être ajoutés.

### Live sync

`ItemDom` met à jour `item[prop.name]` immédiatement quand un champ change (avant Enter/commit). Ainsi les callbacks `onchange` et `validIf` lisent directement les propriétés de l'item (`this.meteo`, `this.effet`…) sans API intermédiaire.

---

## `color` est universel

`color` est déjà dans `ItemCore` (constructeur `Item`) et en DB. `type:'color'` dans PROPS fonctionne pour `Event`, `Project`, `Brin`, `Perso` sans rien ajouter. Brin retire sa gestion spécifique de couleur.

---

## Ce qui disparaît

| Actuel | Remplacé par |
|--------|-------------|
| `Item.render()` override | `PROPS` + `ItemDom.build()` |
| `Item.getEditorFields()` | `PROPS` |
| `Item.createInputFromElement()` | `contenteditable` |
| `Item.createEditorElement()` | `ItemDom.edit()` |
| `AppKeyboardManager` sur `window` | `ItemListener` sur chaque item |
| `ListerRepository` (items + listers) | `ItemRepo` + `ListerRepo` séparés |
