import test from 'node:test'
import assert from 'node:assert/strict'
import FilterState from '../../../../public/classes/system/FilterState.js'

// ── isEmpty ────────────────────────────────────────────────────────

test('FilterState.isEmpty() : true sans condition', () => {
  const fs = new FilterState()
  assert.ok(fs.isEmpty())
})

test('FilterState.isEmpty() : false si filtre texte actif', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'bal')
  assert.ok(!fs.isEmpty())
})

test('FilterState.isEmpty() : false si filtre brin actif', () => {
  const fs = new FilterState()
  fs.brinIds.add('b1')
  assert.ok(!fs.isEmpty())
})

test('FilterState.isEmpty() : false si filtre perso actif', () => {
  const fs = new FilterState()
  fs.persoIds.add('p1')
  assert.ok(!fs.isEmpty())
})

// ── matches — sans condition ───────────────────────────────────────

test('FilterState.matches() : tout item visible sans condition', () => {
  const fs = new FilterState()
  assert.ok(fs.matches({ title: 'Scène 1', brin_ids: [], perso_ids: [] }))
})

// ── matches — filtre texte ─────────────────────────────────────────

test('FilterState.matches() : filtre titre — contenu (fuzzy)', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'bal')
  assert.ok(fs.matches({ title: 'Scène du bal', brin_ids: [], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Arrivée à Paris', brin_ids: [], perso_ids: [] }))
})

test('FilterState.matches() : filtre titre insensible à la casse', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'BAL')
  assert.ok(fs.matches({ title: 'Scène du bal', brin_ids: [], perso_ids: [] }))
})

test('FilterState.matches() : filtre titre insensible aux accents', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'scene')
  assert.ok(fs.matches({ title: 'Scène du bal', brin_ids: [], perso_ids: [] }))
})

// ── matches — filtre brins ─────────────────────────────────────────

test('FilterState.matches() : filtre brin — item visible si a le brin', () => {
  const fs = new FilterState()
  fs.brinIds.add('b1')
  assert.ok(fs.matches({ title: 'X', brin_ids: ['b1', 'b2'], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Y', brin_ids: ['b3'], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Z', brin_ids: [], perso_ids: [] }))
})

test('FilterState.matches() : filtre brin — item sans champ brin_ids → caché', () => {
  const fs = new FilterState()
  fs.brinIds.add('b1')
  assert.ok(!fs.matches({ title: 'X', perso_ids: [] }))
})

test('FilterState.matches() : plusieurs brins → OR', () => {
  const fs = new FilterState()
  fs.brinIds.add('b1')
  fs.brinIds.add('b2')
  assert.ok(fs.matches({ title: 'X', brin_ids: ['b1'], perso_ids: [] }))
  assert.ok(fs.matches({ title: 'Y', brin_ids: ['b2'], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Z', brin_ids: ['b3'], perso_ids: [] }))
})

// ── matches — filtre persos ────────────────────────────────────────

test('FilterState.matches() : filtre perso — item visible si a le perso', () => {
  const fs = new FilterState()
  fs.persoIds.add('p1')
  assert.ok(fs.matches({ title: 'X', brin_ids: [], perso_ids: ['p1'] }))
  assert.ok(!fs.matches({ title: 'Y', brin_ids: [], perso_ids: ['p2'] }))
})

test('FilterState.matches() : filtre perso — item sans champ perso_ids → caché', () => {
  const fs = new FilterState()
  fs.persoIds.add('p1')
  assert.ok(!fs.matches({ title: 'X', brin_ids: [] }))
})

// ── matches — AND entre conditions ────────────────────────────────

test('FilterState.matches() : titre ET brin → ET logique', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'scène')
  fs.brinIds.add('b1')
  assert.ok(fs.matches({ title: 'Scène du bal', brin_ids: ['b1'], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Scène du bal', brin_ids: ['b2'], perso_ids: [] }))
  assert.ok(!fs.matches({ title: 'Arrivée', brin_ids: ['b1'], perso_ids: [] }))
})

// ── clear ─────────────────────────────────────────────────────────

test('FilterState.clear() : efface tout', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'test')
  fs.brinIds.add('b1')
  fs.persoIds.add('p1')
  fs.clear()
  assert.ok(fs.isEmpty())
})

test('FilterState.clear("title") : efface seulement le titre', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'test')
  fs.brinIds.add('b1')
  fs.clear('title')
  assert.ok(!fs.textFields.has('title'))
  assert.equal(fs.brinIds.size, 1)
})

test('FilterState.clear("brins") : efface seulement les brins', () => {
  const fs = new FilterState()
  fs.textFields.set('title', 'test')
  fs.brinIds.add('b1')
  fs.clear('brins')
  assert.equal(fs.brinIds.size, 0)
  assert.ok(fs.textFields.has('title'))
})

test('FilterState.clear("persos") : efface seulement les persos', () => {
  const fs = new FilterState()
  fs.brinIds.add('b1')
  fs.persoIds.add('p1')
  fs.clear('persos')
  assert.equal(fs.persoIds.size, 0)
  assert.equal(fs.brinIds.size, 1)
})
