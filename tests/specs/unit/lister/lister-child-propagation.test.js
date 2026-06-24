import test from 'node:test'
import assert from 'node:assert/strict'

import Lister from '../../../../public/classes/models/Lister.js'
import ListerProject from '../../../../public/classes/models/ListerProject.js'
import Item from '../../../../public/classes/models/Item.js'

test('Lister._childListerData propage project_id depuis le lister parent', () => {
  const lister = new Lister({ id: 10, project_id: 'roman-1' })
  const item = new Item({ id: 'e1', lister_id: 5 })

  const data = lister._childListerData(item)

  assert.equal(data.project_id, 'roman-1')
  assert.equal(data.id, 5)
  assert.equal(data.parentItem, item)
})

test('Lister._childListerData sans project_id — project_id null dans le child', () => {
  const lister = new Lister({ id: 10 })
  const item = new Item({ id: 'e1', lister_id: 5 })

  const data = lister._childListerData(item)

  assert.equal(data.project_id, null)
})

test('ListerProject._childListerData utilise item.id comme project_id', () => {
  const projectLister = new ListerProject({ id: 1 })
  const projectItem = new Item({ id: 'roman-1', lister_id: 2 })

  const data = projectLister._childListerData(projectItem)

  assert.equal(data.project_id, 'roman-1')
})
