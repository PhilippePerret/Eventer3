import test from 'node:test'
import assert from 'node:assert/strict'

import ListerRepository from '../../../../public/classes/repositories/ListerRepository.js'

function makeFetchMock(responseData = {}) {
  const calls = []
  const mock = async (url, opts) => {
    calls.push({ url, opts })
    return { ok: true, json: async () => responseData }
  }
  mock.calls = calls
  return mock
}

test('loadDefinition sans project_id — URL sans query param', async () => {
  const fetchMock = makeFetchMock({ item_ids: ['e1'] })
  global.fetch = fetchMock

  const lister = { id: 42 }
  await ListerRepository.loadDefinition(lister)

  assert.ok(fetchMock.calls[0].url.includes('/api/listers/42'))
  assert.ok(!fetchMock.calls[0].url.includes('project_id'))
})

test('loadDefinition avec project_id — URL contient ?project_id=xxx', async () => {
  const fetchMock = makeFetchMock({ item_ids: ['e1'] })
  global.fetch = fetchMock

  const lister = { id: 42, project_id: 'roman-1' }
  await ListerRepository.loadDefinition(lister)

  assert.ok(fetchMock.calls[0].url.includes('project_id=roman-1'), `URL: ${fetchMock.calls[0].url}`)
})

test('loadItems avec project_id — URL contient ?project_id=xxx', async () => {
  const fetchMock = makeFetchMock({})
  global.fetch = fetchMock

  const lister = { id: 42, project_id: 'roman-1' }
  await ListerRepository.loadItems(lister)

  assert.ok(fetchMock.calls[0].url.includes('project_id=roman-1'), `URL: ${fetchMock.calls[0].url}`)
})

test('saveItem avec project_id — URL PATCH contient ?project_id=xxx', async () => {
  const fetchMock = makeFetchMock({})
  global.fetch = fetchMock

  const item = { id: 'e1', project_id: 'roman-1' }
  await ListerRepository.saveItem(item, { title: 'Test' })

  assert.ok(fetchMock.calls[0].url.includes('project_id=roman-1'), `URL: ${fetchMock.calls[0].url}`)
})

test('createItem avec project_id — URL POST contient ?project_id=xxx', async () => {
  const fetchMock = makeFetchMock({ id: 'e2' })
  global.fetch = fetchMock

  await ListerRepository.createItem(42, { title: 'Nouvel event' }, { project_id: 'roman-1' })

  assert.ok(fetchMock.calls[0].url.includes('project_id=roman-1'), `URL: ${fetchMock.calls[0].url}`)
})

test('save avec project_id — URL PATCH lister contient ?project_id=xxx', async () => {
  const fetchMock = makeFetchMock({})
  global.fetch = fetchMock

  const lister = { id: 10, project_id: 'roman-1', item_ids: ['e1'] }
  await ListerRepository.save(lister)

  assert.ok(fetchMock.calls[0].url.includes('project_id=roman-1'), `URL: ${fetchMock.calls[0].url}`)
})
