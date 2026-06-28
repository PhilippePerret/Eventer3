# FilePicker — Documentation

`public/classes/ui/FilePicker.js`

Composant modal keyboard-driven pour sélectionner un dossier (ou fichier) sur le filesystem local. Style macOS Finder. Réutilisable partout dans l'app.

---

## Usage

```js
import FilePicker from '../ui/FilePicker.js'

const folder_path = await FilePicker.open({
  mode: 'folder',              // 'folder' | 'file'
  keyboardController,          // instance KeyboardController courante
})

if (folder_path === null) {
  // annulé par l'utilisateur
} else {
  // folder_path = chemin absolu du dossier choisi
}
```

`FilePicker.open()` retourne une Promise. Résout avec le chemin absolu (string) ou `null` si annulé.

---

## Intégration KeyboardController

FilePicker pousse le mode `file-picker` sur le modeStack de KeyboardController pendant son cycle de vie :

```
modeStack avant : [item-edition]   ← ou vide
modeStack pendant picker : [item-edition, file-picker]
modeStack après _close() : [item-edition]   ← restauré
```

- `pushMode({ type: 'file-picker', onKeyDown })` à l'ouverture
- `popMode()` à la fermeture (sélection ou annulation)

**Important** : appeler `FilePicker.open()` AVANT tout `pushMode('item-edition')` ou AVANT `super.commitNewItem()` pour que l'ordre de la pile soit correct.

---

## Routes backend utilisées

| Méthode | Route | Usage |
|---|---|---|
| `GET` | `/api/fs?path=<path>` | Lister le contenu d'un dossier (tri alphabétique pur, insensible à la casse) |
| `POST` | `/api/fs/mkdir` | Créer un nouveau dossier (`{ path: "/chemin/complet" }`) |
| `GET` | `/api/settings/last_path` | Récupérer le dernier dossier parcouru |
| `PATCH` | `/api/settings/last_path` | Sauvegarder le dossier parcouru à la fermeture |
| `GET` | `/api/settings/recent_paths` | Récupérer le JSON des chemins récemment choisis |
| `PATCH` | `/api/settings/recent_paths` | Mettre à jour les chemins récents (JSON, max 10) |

`last_path` = dossier courant à l'ouverture du picker.  
`recent_paths` = dossiers effectivement **choisis** (pas juste parcourus), JSON array.

---

## Raccourcis clavier

### Mode normal (liste des entrées)

| Touche | Action |
|---|---|
| `↑` / `↓` | Naviguer dans la liste |
| `→` | Entrer dans le dossier sélectionné |
| `←` | Remonter au dossier parent |
| `n` | Créer un nouveau dossier (input inline) |
| `Tab` | Ouvrir/fermer le menu d'arborescence |
| `Enter` | Choisir le dossier sélectionné (si dossier ; inactif sur fichier en mode `folder`) |
| `Esc` | Annuler — résout la Promise avec `null` |

### Mode menu arborescence (Tab actif)

| Touche | Action |
|---|---|
| `↑` / `↓` | Naviguer dans les ancêtres |
| `Enter` | Naviguer vers l'ancêtre sélectionné |
| `Tab` / `Esc` | Fermer le menu |

### Mode création de dossier (input `n` visible)

Le focus passe à l'input. Les touches `Enter` et `Esc` de l'input ont `stopPropagation()` — elles n'atteignent pas le KeyboardController.

| Touche | Action |
|---|---|
| `Enter` | POST `/api/fs/mkdir`, re-navigate, sélectionner le nouveau dossier |
| `Esc` | Annuler la création, retirer l'input |

---

## Structure DOM

```
.file-picker-overlay                  ← fond semi-transparent (z-index: 900)
  .file-picker[data-current-path]     ← fenêtre principale ; attribut mis à jour à chaque navigation
    .file-picker__titlebar            ← barre macOS
      .file-picker__lights            ← boutons trafic (.--close / --minimize / --maximize)
      .file-picker__folder-name       ← nom du dossier courant (pas le chemin complet)
    .file-picker__header
      .file-picker__recents-btn       ← bouton "Récents ▾" (ouvre _recentsPanel via click)
    .file-picker__recents[hidden]     ← panel récents (caché par défaut, toggle via click bouton)
    .file-picker__path-menu[hidden]   ← menu arborescence (toggle via Tab)
      .file-picker__path-menu-item    ← un ancêtre (data-path = chemin absolu)
    .file-picker__entries
      .file-picker__entry[data-type][data-path]   ← data-type: "directory" | "file"
        .file-picker__entry-icon      ← icône CSS (dossier bleu ou page grise, pas d'emoji)
        .file-picker__entry-name
      .file-picker__new-folder-input  ← inséré au début si 'n' pressé
    .file-picker__footer
      .file-picker__cancel-key        ← "␛" (gauche)
      .file-picker__nav-hints         ← raccourcis contextuels (HTML avec <kbd>)
      .file-picker__select-btn        ← "↩︎" vert ; classe .disabled si fichier sélectionné en mode folder
```

---

## Sélecteurs Playwright

| Élément | Locator |
|---|---|
| Picker visible | `.file-picker` |
| Chemin courant | `.file-picker[data-current-path="<path>"]` |
| Entrées | `.file-picker__entry` |
| Entrée sélectionnée | `.file-picker__entry.selected` |
| Nom d'entrée | `.file-picker__entry-name` |
| Bouton sélection | `.file-picker__select-btn` |
| Bouton désactivé | `.file-picker__select-btn.disabled` |
| Menu arborescence | `.file-picker__path-menu` |
| Item arborescence | `.file-picker__path-menu-item` |
| Input nouveau dossier | `.file-picker__new-folder-input` |
| Touche annuler | `.file-picker__cancel-key` |

Helper de test pour attendre une navigation :

```js
async function waitForPath(page, expectedPath) {
  await expect(page.locator('.file-picker')).toHaveAttribute('data-current-path', expectedPath)
}
```

---

## Exemple d'intégration (ProjectLister)

```js
// createNewItemAfter() dans ProjectLister — ouvrir picker puis commit direct sans éditeur
async createNewItemAfter() {
  const folder_path = await FilePicker.open({ mode: 'folder', keyboardController: this.keyboardController })
  if (!folder_path) return

  this._pendingFolderPath = folder_path
  const folderName = folder_path.split('/').at(-1)

  // Créer item dans DOM (sans éditeur)
  // ...
  await this.commitNewItem(item, itemElement, insertionIndex)
}

// commitNewItem() — lire _pendingFolderPath, créer les sous-listers, sauver db_path
async commitNewItem(item, itemElement, insertionIndex) {
  const folder_path = this._pendingFolderPath ?? null
  this._pendingFolderPath = null
  await super.commitNewItem(item, itemElement, insertionIndex)
  if (!folder_path) return
  const db_path = folder_path + '/eventer.db'
  // ... createLister / createItem / saveItem({ db_path, folder_path })
}
```

---

## Notes

- `last_path` stocke le **dossier parcouru** (pas le dossier choisi). Permet de rouvrir le picker au même endroit.
- `recent_paths` stocke les dossiers **choisis** (sélectionnés via Enter). Max 10. Dédupliqués.
- Ordre des entrées : alphabétique pur insensible à la casse (fichiers et dossiers mélangés).
- Icônes : CSS pur, pas d'emoji. Dossier = rectangle bleu `#4db1ff` avec onglet. Fichier = page grise avec coin plié.
