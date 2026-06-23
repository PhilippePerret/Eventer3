export default class ListerRepo {
  constructor(lister) { this.lister = lister }

  async load() {
    const id    = this.lister.id
    const pid   = this.lister.project_id
    const query = pid ? `?project_id=${pid}` : ''
    const def   = await fetch(`/api/listers/${id}${query}`, { cache: 'no-store' }).then(r => r.json())
    if (!def) return
    this.lister._missing = def.missing === true
    if (def.id != null) this.lister.id = def.id
    this.lister.item_ids = def.item_ids ?? []

    const data = await fetch(`/api/listers/${id}/items${query}`, { cache: 'no-store' }).then(r => r.json())
    const Cls  = this.lister.constructor.ITEM_CLASS
    this.lister.items = this.lister.item_ids
      .map(id => data[id] ? new Cls({ ...data[id], id }) : null)
      .filter(Boolean)
    this.lister.selectedIndex = this.lister.items.length ? 0 : -1
  }

  async deleteItem(item) {
    const resp = await fetch(`/api/listers/${this.lister.id}/items/${item.id}`, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  }

  async countDescendants(item) {
    const project_id = this.lister.project_id ?? item.id
    const query = project_id ? `?project_id=${project_id}` : ''
    const resp = await fetch(`/api/listers/${this.lister.id}/items/${item.id}/descendants/count${query}`, { cache: 'no-store' })
    if (!resp.ok) return 0
    const data = await resp.json()
    return data.count ?? 0
  }

  async save() {
    const query = this.lister.project_id ? `?project_id=${this.lister.project_id}` : ''
    await fetch(`/api/listers/${this.lister.id}${query}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ item_ids: this.lister.item_ids }),
      cache:   'no-store',
    })
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
