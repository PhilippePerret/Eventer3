import test from 'node:test'
import assert from 'node:assert/strict'

import Lister from '../../../../public/classes/models/Lister.js'

// Mock fetch pour loadItems
function makeFetchMock(itemsData = {}) {
  global.fetch = async (url) => ({
    ok: true,
    json: async () => itemsData
  })
}

test('Lister accepte project_id dans le constructeur', () => {
  const lister = new Lister({ id: 10, project_id: 'roman-1' })
  assert.equal(lister.project_id, 'roman-1')
})

test('Lister.project_id vaut null par défaut', () => {
  const lister = new Lister({ id: 10 })
  assert.equal(lister.project_id, null)
})

test('loadItems propage project_id sur les items créés', async () => {
  const lister = new Lister({ id: 10, project_id: 'roman-1', item_ids: ['e1'] })

  makeFetchMock({ e1: { id: 'e1', title: 'Event test' } })
  await lister.loadItems()

  assert.equal(lister.items.length, 1)
  assert.equal(lister.items[0].project_id, 'roman-1')
})

test('loadItems ne propage pas project_id si absent', async () => {
  const lister = new Lister({ id: 10, item_ids: ['e1'] })

  makeFetchMock({ e1: { id: 'e1', title: 'Event test' } })
  await lister.loadItems()

  assert.equal(lister.items[0].project_id, null)
})
