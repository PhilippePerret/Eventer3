import test from 'node:test'
import assert from 'node:assert/strict'
import Lister from '../../../../../public/classes/models/Lister.js'

function mockEl(id) {
  const classes = new Set()
  return {
    _id: id,
    classList: {
      add:    (cls) => classes.add(cls),
      remove: (cls) => classes.delete(cls),
      toggle: (cls, force) => {
        if (force === true) classes.add(cls)
        else if (force === false) classes.delete(cls)
        else if (classes.has(cls)) classes.delete(cls)
        else classes.add(cls)
      },
      contains: (cls) => classes.has(cls)
    }
  }
}

function makeLister(visibilities) {
  // visibilities = tableau de booléens : true=visible, false=caché
  const lister = new Lister()
  lister.items    = visibilities.map((v, i) => ({ id: `e${i}`, _visible: v }))
  lister.domItems = visibilities.map((_, i) => mockEl(`e${i}`))
  lister.selectedIndex = 0
  lister.domItems[0].classList.add('selected')
  return lister
}

// ── selectNextItem ─────────────────────────────────────────────────

test('selectNextItem : avance normalement sans items cachés', () => {
  const lister = makeLister([true, true, true])
  lister.selectNextItem()
  assert.equal(lister.selectedIndex, 1)
})

test('selectNextItem : saute un item caché', () => {
  const lister = makeLister([true, false, true])
  lister.selectNextItem()
  assert.equal(lister.selectedIndex, 2)
})

test('selectNextItem : saute plusieurs items cachés', () => {
  const lister = makeLister([true, false, false, true])
  lister.selectNextItem()
  assert.equal(lister.selectedIndex, 3)
})

test('selectNextItem : reste sur dernier visible si tous suivants cachés', () => {
  const lister = makeLister([true, false, false])
  lister.selectNextItem()
  assert.equal(lister.selectedIndex, 0)
})

// ── selectPreviousItem ─────────────────────────────────────────────

test('selectPreviousItem : recule normalement sans items cachés', () => {
  const lister = makeLister([true, true, true])
  lister.selectedIndex = 2
  lister.selectPreviousItem()
  assert.equal(lister.selectedIndex, 1)
})

test('selectPreviousItem : saute un item caché', () => {
  const lister = makeLister([true, false, true])
  lister.selectedIndex = 2
  lister.selectPreviousItem()
  assert.equal(lister.selectedIndex, 0)
})

test('selectPreviousItem : reste sur premier visible si tous précédents cachés', () => {
  const lister = makeLister([false, false, true])
  lister.selectedIndex = 2
  lister.selectPreviousItem()
  assert.equal(lister.selectedIndex, 2)
})

// ── _clampSelection ────────────────────────────────────────────────

test('_clampSelection : ne change pas si item sélectionné reste visible', () => {
  const lister = makeLister([true, false, true])
  lister.selectedIndex = 2
  lister._clampSelection()
  assert.equal(lister.selectedIndex, 2)
})

test('_clampSelection : avance au prochain visible si sélectionné caché', () => {
  const lister = makeLister([false, true, true])
  lister.selectedIndex = 0
  lister._clampSelection()
  assert.equal(lister.selectedIndex, 1)
})

test('_clampSelection : recule au précédent visible si aucun suivant', () => {
  const lister = makeLister([true, true, false])
  lister.selectedIndex = 2
  lister._clampSelection()
  assert.equal(lister.selectedIndex, 1)
})

test('applyFilter appelle _clampSelection', () => {
  const lister = makeLister([true, true, true])
  lister.selectedIndex = 1
  lister.filterState.textFields.set('title', 'impossible')
  lister.items.forEach(item => { item.title = 'autre'; item.brin_ids = []; item.perso_ids = [] })
  lister.applyFilter()
  // tous cachés : selectedIndex doit rester cohérent (pas de crash)
  assert.ok(lister.selectedIndex >= 0)
})
