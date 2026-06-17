# Architecture cible — Eventer3

Décisions prises lors de la session du 2026-06-17.

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

```js
class Event extends Item {
  static get PROPS() {
    return [
      { name: 'title',  type: 'text' },
      { name: 'state',  type: 'select',       values: EVENT_STATES },
      { name: 'meteo',  type: 'select',       values: EVENT_METEO,  onchange: 'setEffetValuesPerMeteo' },
      { name: 'effet',  type: 'select',       values: EVENT_EFFETS, validIf:  'checkEffetValidity' },
      { name: 'lieu',   type: 'select',       values: EVENT_LIEU },
      { name: 'color',  type: 'color' },
      { name: 'brins-marks',  type: 'custom', editable: false, value: 'brinsBadgeMarks' },
      { name: 'persos-marks', type: 'custom', editable: false, value: 'persosMarks' },
    ]
  }

  setEffetValuesPerMeteo(meteo) { /* restreint les valeurs d'effet */ }
  checkEffetValidity(effet)     { /* valide la compatibilité meteo/effet */ }
  brinsBadgeMarks()             { return '<badges des brins>' }
  persosMarks()                 { return '<avatars des persos>' }
}
```

### Règles PROPS

- **Toute prop est éditable par défaut.** Seule exception : `editable: false` pour les props display-only.
- `onchange: 'methodName'` → appelé avec la nouvelle valeur dès que le champ change (live sync).
- `validIf: 'methodName'` → validation avant commit.
- `value: 'methodName'` → pour `type:'custom'`, retourne le HTML à afficher.

### Types disponibles

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
| `KeyboardController` sur `window` | `ItemListener` sur chaque item |
| `ListerRepository` (items + listers) | `ItemRepo` + `ListerRepo` séparés |
