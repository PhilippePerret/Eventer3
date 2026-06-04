import { raise } from '../../system/Error.js'

export default class ListerRepository {

  static async loadDefinition(lister) {
    const response = await fetch(`/api/listers/${lister.id}`)
    if (!response.ok) return
    const data = await response.json()
    if (data.item_ids)       lister.item_ids       = data.item_ids
    if (data.brins_lister_id) lister.brins_lister_id = data.brins_lister_id
  }

  static async loadItems(lister) {
    const response = await fetch(`/api/listers/${lister.id}/items`)
    if (!response.ok) return {}
    return await response.json()
  }

  static async loadItemLister(itemId) {
    const response = await fetch(`/api/items/${itemId}/lister`)
    if (!response.ok) return null
    return await response.json()
  }

  static async save(lister) {
    const response = await fetch(`/api/listers/${lister.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_ids: lister.item_ids })
    })
    if (!response.ok) raise(`Impossible de sauver ${lister.id}`)
  }

  static async saveItems(lister) {
    for (const item of lister.items) {
      await ListerRepository.saveItem(item, {
        title:    item.title,
        type:     item.type,
        color:    item.color,
        checked:  item.checked,
        duration: item.duration,
        badge:    item.badge,
        brin_ids: item.brin_ids,
      })
    }
  }

  static async saveItem(item, fields, { oldId } = {}) {
    const urlId = oldId ?? item.id
    const response = await fetch(`/api/items/${urlId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    if (!response.ok) raise(`Impossible de sauver l'item ${urlId}`)
  }

  static async createItem(listerId, fields) {
    const response = await fetch(`/api/listers/${listerId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    if (!response.ok) raise(`Impossible de créer un item dans ${listerId}`)
    return await response.json()
  }

  static async deleteItem(lister, item) {
    const response = await fetch(`/api/listers/${lister.id}/items/${item.id}`, {
      method: 'DELETE'
    })
    if (!response.ok) raise(`Impossible de supprimer l'item ${item.id}`)
  }

  static async createLister(fields) {
    const response = await fetch('/api/listers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    if (!response.ok) raise(`Impossible de créer le lister`)
    return await response.json()
  }

}
