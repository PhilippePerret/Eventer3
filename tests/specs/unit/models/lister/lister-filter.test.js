import test from 'node:test'
import assert from 'node:assert/strict'
import Lister from '../../../../../public/classes/models/Lister.js'
import FilterState from '../../../../../public/classes/system/FilterState.js'

// Mock minimal d'un élément DOM (classList.toggle + classList.contains)
function mockEl() {
  const classes = new Set()
  return {
    classList: {
      toggle(cls, force) {
        if (force === true)       classes.add(cls)
        else if (force === false) classes.delete(cls)
        else if (classes.has(cls)) classes.delete(cls)
        else classes.add(cls)
      },
      contains: (cls) => classes.has(cls)
    }
  }
}

function makeLister(itemsData) {
  const lister = new Lister()
  lister.items = itemsData.map(d => ({ ...d, _visible: true }))
  lister.domItems = itemsData.map(() => mockEl())
  lister.filterState = new FilterState()
  return lister
}

// ── applyFilter — filtre brin ─────────────────────────────────────

test('applyFilter : filtre brin masque les items sans ce brin', () => {
  const lister = makeLister([
    { id: 'e1', title: 'Event 1', brin_ids: ['b1'], perso_ids: [] },
    { id: 'e2', title: 'Event 2', brin_ids: ['b2'], perso_ids: [] },
    { id: 'e3', title: 'Event 3', brin_ids: [],      perso_ids: [] },
  ])
  lister.filterState.brinIds.add('b1')
  lister.applyFilter()

  assert.ok(lister.items[0]._visible,  'e1 (a b1) → visible')
  assert.ok(!lister.items[1]._visible, 'e2 (pas b1) → caché')
  assert.ok(!lister.items[2]._visible, 'e3 (pas de brin) → caché')
  assert.ok(!lister.domItems[1].classList.contains('hidden') === false)
  assert.ok(lister.domItems[1].classList.contains('hidden'), 'e2 DOM .hidden')
  assert.ok(lister.domItems[2].classList.contains('hidden'), 'e3 DOM .hidden')
  assert.ok(!lister.domItems[0].classList.contains('hidden'), 'e1 DOM pas .hidden')
})

test('applyFilter : plusieurs brins filtrés → OR', () => {
  const lister = makeLister([
    { id: 'e1', title: 'E1', brin_ids: ['b1'],       perso_ids: [] },
    { id: 'e2', title: 'E2', brin_ids: ['b2'],       perso_ids: [] },
    { id: 'e3', title: 'E3', brin_ids: ['b1', 'b2'], perso_ids: [] },
    { id: 'e4', title: 'E4', brin_ids: ['b3'],       perso_ids: [] },
  ])
  lister.filterState.brinIds.add('b1')
  lister.filterState.brinIds.add('b2')
  lister.applyFilter()

  assert.ok(lister.items[0]._visible, 'e1 b1 → visible')
  assert.ok(lister.items[1]._visible, 'e2 b2 → visible')
  assert.ok(lister.items[2]._visible, 'e3 b1+b2 → visible')
  assert.ok(!lister.items[3]._visible, 'e4 b3 → caché')
})

// ── applyFilter — filtre texte ────────────────────────────────────

test('applyFilter : filtre texte masque les items non correspondants', () => {
  const lister = makeLister([
    { id: 'e1', title: 'Scène du bal',   brin_ids: [], perso_ids: [] },
    { id: 'e2', title: 'Arrivée à Paris', brin_ids: [], perso_ids: [] },
  ])
  lister.filterState.textFields.set('title', 'bal')
  lister.applyFilter()

  assert.ok(lister.items[0]._visible,  'e1 contient "bal" → visible')
  assert.ok(!lister.items[1]._visible, 'e2 sans "bal" → caché')
})

// ── applyFilter — ET logique ──────────────────────────────────────

test('applyFilter : titre ET brin → ET logique', () => {
  const lister = makeLister([
    { id: 'e1', title: 'Scène du bal',   brin_ids: ['b1'], perso_ids: [] },
    { id: 'e2', title: 'Scène de nuit',  brin_ids: ['b2'], perso_ids: [] },
    { id: 'e3', title: 'Arrivée',        brin_ids: ['b1'], perso_ids: [] },
  ])
  lister.filterState.textFields.set('title', 'scène')
  lister.filterState.brinIds.add('b1')
  lister.applyFilter()

  assert.ok(lister.items[0]._visible,  'e1 titre+brin match → visible')
  assert.ok(!lister.items[1]._visible, 'e2 titre ok mais pas brin → caché')
  assert.ok(!lister.items[2]._visible, 'e3 brin ok mais pas titre → caché')
})

// ── applyFilter — clear ───────────────────────────────────────────

test('applyFilter : après clear, tous les items redeviennent visibles', () => {
  const lister = makeLister([
    { id: 'e1', title: 'E1', brin_ids: ['b1'], perso_ids: [] },
    { id: 'e2', title: 'E2', brin_ids: [],     perso_ids: [] },
  ])
  lister.filterState.brinIds.add('b1')
  lister.applyFilter()
  assert.ok(!lister.items[1]._visible, 'e2 caché avant clear')

  lister.filterState.clear()
  lister.applyFilter()
  assert.ok(lister.items[0]._visible, 'e1 visible après clear')
  assert.ok(lister.items[1]._visible, 'e2 visible après clear')
  assert.ok(!lister.domItems[1].classList.contains('hidden'), 'e2 DOM visible')
})

// ── applyFilter — pas de DOM inutile ─────────────────────────────

test('applyFilter : ne touche pas le DOM si visibilité inchangée', () => {
  const lister = makeLister([
    { id: 'e1', title: 'E1', brin_ids: ['b1'], perso_ids: [] },
  ])
  lister.filterState.brinIds.add('b1')

  let toggleCalls = 0
  lister.domItems[0].classList.toggle = (cls, force) => { toggleCalls++ }

  lister.applyFilter()  // e1 déjà visible, filtre brin b1 → reste visible
  assert.equal(toggleCalls, 0, 'aucun appel DOM si visibilité inchangée')
})
