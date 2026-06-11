import { test } from 'node:test'
import assert from 'node:assert/strict'
import Texte from '../../../../public/system/Texte.js'

// toggleMark(val, start, end, before, after?)
// Returns { value, selStart, selEnd }

test('pas de marque → ajoute *', () => {
  // 'hello world', sélection "world" (6..11)
  const r = Texte.toggleMark('hello world', 6, 11, '*')
  assert.equal(r.value,    'hello *world*')
  assert.equal(r.selStart, 7)
  assert.equal(r.selEnd,   12)
})

test('sélection inclut *...* → supprime (cas 1)', () => {
  // '*world*', sélection tout [0..7]
  const r = Texte.toggleMark('*world*', 0, 7, '*')
  assert.equal(r.value,    'world')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   5)
})

test('sélection dans *...* → supprime (cas 2)', () => {
  // '*world*', sélection inner [1..6]
  const r = Texte.toggleMark('*world*', 1, 6, '*')
  assert.equal(r.value,    'world')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   5)
})

test('sélection inclut **...** → supprime (cas 1)', () => {
  // '**world**', sélection tout [0..9]
  const r = Texte.toggleMark('**world**', 0, 9, '**')
  assert.equal(r.value,    'world')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   5)
})

test('sélection dans **...** → supprime (cas 2)', () => {
  // '**world**', sélection inner [2..7]
  const r = Texte.toggleMark('**world**', 2, 7, '**')
  assert.equal(r.value,    'world')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   5)
})

test('[***text***] avec * → retire outer → **text**', () => {
  // '***text***': *(0)*(1)*(2)t(3)e(4)x(5)t(6)*(7)*(8)*(9) length=10
  const r = Texte.toggleMark('***text***', 0, 10, '*')
  assert.equal(r.value,    '**text**')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   8)
})

test('**[text]** dans ***text*** avec * → retire inner * → **text**', () => {
  // sélection "text" [3..7]
  const r = Texte.toggleMark('***text***', 3, 7, '*')
  assert.equal(r.value,    '**text**')
  assert.equal(r.selStart, 2)
  assert.equal(r.selEnd,   6)
})

test('[***text***] avec ** → retire outer ** → *text*', () => {
  const r = Texte.toggleMark('***text***', 0, 10, '**')
  assert.equal(r.value,    '*text*')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   6)
})

test('*[**text**]* dans ***text*** avec ** → retire inner ** → *text*', () => {
  // sélection [1..9] = "**text**"
  const r = Texte.toggleMark('***text***', 1, 9, '**')
  assert.equal(r.value,    '*text*')
  assert.equal(r.selStart, 1)
  assert.equal(r.selEnd,   5)
})

test('[~~text~~] avec ~~ → supprime (cas 1, marqueur 2 chars)', () => {
  // '~~text~~': ~(0)~(1)t(2)e(3)x(4)t(5)~(6)~(7) length=8
  const r = Texte.toggleMark('~~text~~', 0, 8, '~~')
  assert.equal(r.value,    'text')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   4)
})

test('~~text~~ sélection inner avec ~~ → supprime (cas 2)', () => {
  const r = Texte.toggleMark('~~text~~', 2, 6, '~~')
  assert.equal(r.value,    'text')
  assert.equal(r.selStart, 0)
  assert.equal(r.selEnd,   4)
})
