import test from 'node:test'
import assert from 'node:assert/strict'

import Lister from '../../../../../public/classes/models/Lister.js'
import Item from '../../../../../public/classes/models/Item.js'

test('Lister peut être instancié', () => {
  const lister = new Lister()
  assert.ok(lister)
})

test('Lister peut être utilisé comme classe abstraite', () => {
  class TestLister extends Lister {}
  const testlister = new TestLister()
  assert.ok(testlister)
})

test('Lister peut classer les items', () => {
  class TestLister extends Lister {}
  const obj = new TestLister()
  const itA = new Item({id:'i1', title: "Premier", pos: 100})
  const itB = new Item({id:'i2', title: "Second", pos: 200})
  const itC = new Item({id:'i3', title: "Troisième", pos: 300})
  var itemsIni = [itB, itC, itA]
  const newOrder = obj.sortItems(itemsIni)
  assert.equal(newOrder, [itA, itB, itC] )
})
