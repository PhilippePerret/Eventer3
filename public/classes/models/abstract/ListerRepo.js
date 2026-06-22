export default class ListerRepo {
  constructor(lister) { this.lister = lister }

  async load() {
    const id  = this.lister.id
    const def = await fetch(`/api/listers/${id}`, { cache: 'no-store' }).then(r => r.json())
    this.lister.item_ids = def.item_ids ?? []

    const data = await fetch(`/api/listers/${id}/items`, { cache: 'no-store' }).then(r => r.json())
    const Cls  = this.lister.constructor.ITEM_CLASS
    this.lister.items = this.lister.item_ids
      .map(id => data[id] ? new Cls({ ...data[id], id }) : null)
      .filter(Boolean)
  }

  async deleteItem(item) {
    const resp = await fetch(`/api/listers/${this.lister.id}/items/${item.id}`, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  }

  static async createLister(fields) {
    const resp = await fetch('/api/listers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer le lister`)
    return await resp.json()
  }

  static async createItem(listerId, fields, { project_id } = {}) {
    const query = project_id ? `?project_id=${project_id}` : ''
    const resp  = await fetch(`/api/listers/${listerId}/items${query}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer un item dans ${listerId}`)
    return await resp.json()
  }
}