---
name: project_filtrage_design
description: Design du système de filtrage — décisions validées session 2026-06-06, à reprendre pour TDD+implémentation
metadata:
  type: project
---

# Design filtrage Eventer3 — décisions validées

**Why:** Filtrage = raison d'être d'Eventer. Perf critique (listes jusqu'à 5000 items). Session 2026-06-06 a produit le design complet mais PAS le code. Reprendre avec TDD.

**How to apply:** Ne pas dévier de ces décisions sans en reparler avec l'utilisateur.

---

## 1. SelectorPanel (générique)

Un seul composant configuré par injection, sert pour TOUS les pickers :

```js
new SelectorPanel({
  items,
  isChecked:  (item) => Boolean,   // état coché
  onToggle:   (item) => void,      // action sur toggle
  renderItem: (item) => String     // HTML ligne
})
```

- Brin **assignation** → `isChecked = event.brin_ids.has(id)`, `onToggle = saveToDb`
- Brin **filtre** → `isChecked = filterState.brinIds.has(id)`, `onToggle = applyFilter()`
- Perso filtre → idem, autre Set
- Météo, lieu, effet → idem, valeurs fixes

`BrinLister.open()` passe juste une config différente selon le mode. Zéro duplication, zéro régression.

---

## 2. FilterState

Porte toutes les conditions actives :
- `textFields: Map<fieldName, query>` (title, effet, lieu, météo…)
- `brinIds: Set`
- `persoIds: Set`
- `isEmpty()`, `clear(condition?)`, `matches(item)` (pour le filtre texte O(n))

---

## 3. DOM strategy — CRITIQUE

**Règle absolue : le DOM est une sortie, jamais une source d'état.**

- `render()` crée TOUS les éléments DOM une seule fois → stockés dans `this.domItems[]` (parallèle à `this.items[]`)
- `item._visible = true` initialisé sur chaque item au render
- Pas de `visibleItems[]` ni `visibleDomItems[]` — état porté par `item._visible`

---

## 4. applyFilter(changedConditionType, changedId)

**Ne touche le DOM QUE si l'état change :**

```js
// Pour filtre brin/perso (O(items_affectés)) :
const indices = this._itemsByBrin[changedId] ?? []  // index pré-construit
indices.forEach(i => {
  const newVisible = this.filterState.matches(this.items[i])
  if (newVisible !== this.items[i]._visible) {
    this.items[i]._visible = newVisible
    this.domItems[i].classList.toggle('hidden', !newVisible)
  }
})

// Pour filtre texte (O(n) inévitable) :
this.items.forEach((item, i) => {
  const newVisible = this.filterState.matches(item)
  if (newVisible !== item._visible) {
    item._visible = newVisible
    this.domItems[i].classList.toggle('hidden', !newVisible)
  }
})
```

**Index pré-construits au `render()` :**
```js
this._itemsByBrin  = {}  // brinId  → [indices dans this.items]
this._itemsByPerso = {}  // persoId → [indices dans this.items]
```

---

## 5. Navigation

`selectedIndex` = index dans `this.items[]` complet. Navigation saute les `!item._visible` :

```js
selectNextItem() {
  let i = this.selectedIndex + 1
  while (i < this.items.length && !this.items[i]._visible) i++
  if (i < this.items.length) this.selectItemAt(i)
}
```

`_clampSelection()` appelé après `applyFilter()` pour recentrer si item sélectionné devient caché.

---

## 6. Clavier

`:` → push mode `filter-sequence` dans `keyboardController.modeStack`.

Dans ce mode :
- `t` → active champ texte (input event → `applyFilter` texte)
- `b` → ouvre SelectorPanel brins filtre
- `p` → ouvre SelectorPanel persos filtre
- `:` → flag `cancelNext = true`, prochain `t/b/p` annule cette condition
- `:::` → `filterState.clear()` + exit mode
- `Escape` → exit sans reset

---

## 7. Barre de filtre

Affichée au-dessus de `#main-panel` quand filtre actif. Contient :
- `<input>` par champ texte actif
- badges brins/persos actifs (cliquables pour annuler)
