import { ItemDataMapper } from '../repositories/Mapper.js'
import { raise } from '../../system/Error.js'

export default class ListerRepository {

  static async create(lister) {
    const response = await fetch(`/data/${lister.contextPath}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: [], perso_ids: [] })
    })
    if (!response.ok) raise(`Impossible de créer ${lister.contextPath}`)
  }

  static async save(lister) {
    const response = await fetch(`/data/${lister.contextPath}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: lister.item_ids, lasts_id: lister.lasts_id })
    })
    if (!response.ok) raise(`Impossible de sauver ${lister.id}`)
  }

  static async saveItems(lister) {
    const hash = {}
    lister.items.forEach(item => { hash[item.id] = ItemDataMapper.toPersistence(item) })
    const response = await fetch(`/data/${lister.contextPath}/__items.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hash)
    })
    if (!response.ok) raise(`Impossible de sauver les items de ${lister.contextPath}`)
  }

  static async saveItem(item, fields, { oldId } = {}) {
    const payload = { id: item.id }
    if (oldId && oldId !== item.id) payload.old_id = oldId
    Object.entries(fields).forEach(([longKey, value]) => {
      const shortKey = ItemDataMapper.TO_PERSISTENCE[longKey]
      if (shortKey) payload[shortKey] = value
    })
    const filename = item.parentLister.itemsFilename ?? '__items.json'
    const response = await fetch(`/data/${item.parentLister.contextPath}/${filename}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) raise(`Impossible de sauver l'item ${item.id}`)
  }

}
