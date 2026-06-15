import { raise } from '../../system/Error.js'

export default class ListerRepository {

  static _projectQuery(obj) {
    return obj?.project_id ? `?project_id=${obj.project_id}` : ''
  }

  static async loadDefinition(lister) {
    if (!lister.id) { lister.__isVirtual = true; return }
    const response = await fetch(`/api/listers/${lister.id}${ListerRepository._projectQuery(lister)}`, { cache: 'no-store' })
    if (!response.ok) return
    const data = await response.json()
    if (!data || data.virtual) { lister.__isVirtual = true; return }
    if (data.id != null)        lister.id                = data.id
    if (data.item_ids)          lister.item_ids          = data.item_ids
    if (data.brins_lister_id)   lister.brins_lister_id   = data.brins_lister_id
    if (data.persos_lister_id)  lister.persos_lister_id  = data.persos_lister_id
    if (data.link_targets)      lister.link_targets      = data.link_targets
    if (data.project_item_id)   lister.project_item_id   = data.project_item_id
  }

  static async loadItems(lister) {
    if (!lister.id) return {}
    const response = await fetch(`/api/listers/${lister.id}/items${ListerRepository._projectQuery(lister)}`, { cache: 'no-store' })
    if (!response.ok) return {}
    return await response.json()
  }

  static async save(lister) {
    const response = await fetch(`/api/listers/${lister.id}${ListerRepository._projectQuery(lister)}`, {
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
    const response = await fetch(`/api/items/${urlId}${ListerRepository._projectQuery(item)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    if (!response.ok) raise(`Impossible de sauver l'item ${urlId}`)
  }

  static async createItem(listerId, fields, { project_id } = {}) {
    const query = project_id ? `?project_id=${project_id}` : ''
    const response = await fetch(`/api/listers/${listerId}/items${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    if (!response.ok) raise(`Impossible de créer un item dans ${listerId}`)
    return await response.json()
  }

  static async deleteItem(lister, item) {
    const response = await fetch(`/api/listers/${lister.id}/items/${item.id}${ListerRepository._projectQuery(lister)}`, {
      method: 'DELETE'
    })
    if (!response.ok) raise(`Impossible de supprimer l'item ${item.id}`)
  }

  static async countDescendants(lister, item) {
    const q = ListerRepository._projectQuery(lister)
    const resp = await fetch(`/api/listers/${lister.id}/items/${item.id}/descendants/count${q}`, { cache: 'no-store' })
    if (!resp.ok) return 0
    const data = await resp.json()
    return data.count ?? 0
  }

  static async fetchAncestors(projectId, itemId) {
    const response = await fetch(
      `/api/items/${itemId}/ancestors?project_id=${projectId}`,
      { cache: 'no-store' }
    )
    if (!response.ok) return null
    const data = await response.json()
    return data.ancestors ?? []
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
