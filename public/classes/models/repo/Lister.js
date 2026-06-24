export default {

  async load() {
    const id    = this.id
    const pid   = this.project_id
    const query = pid ? `?project_id=${pid}` : ''
    const def   = await fetch(`/api/listers/${id}${query}`, { cache: 'no-store' }).then(r => r.json())
    if (!def) return
    this._missing = def.missing === true
    if (def.id != null) this.id = def.id
    this.item_ids = def.item_ids ?? []

    const data = await fetch(`/api/listers/${id}/items${query}`, { cache: 'no-store' }).then(r => r.json())
    const Cls  = this.constructor.ITEM_CLASS
    this.items = this.item_ids
      .map(id => data[id] ? new Cls({ ...data[id], id }) : null)
      .filter(Boolean)
    this.selectedIndex = this.items.length ? 0 : -1
  },

  async deleteItem(item) {
    const resp = await fetch(`/api/listers/${this.id}/items/${item.id}`, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  },

  async countDescendants(item) {
    const project_id = this.project_id ?? item.id
    const query = project_id ? `?project_id=${project_id}` : ''
    const resp = await fetch(`/api/listers/${this.id}/items/${item.id}/descendants/count${query}`, { cache: 'no-store' })
    if (!resp.ok) return 0
    const data = await resp.json()
    return data.count ?? 0
  },

  async save() {
    const query = this.project_id ? `?project_id=${this.project_id}` : ''
    await fetch(`/api/listers/${this.id}${query}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ item_ids: this.item_ids }),
      cache:   'no-store',
    })
  },

  async createItem(fields) {
    const query = this.project_id ? `?project_id=${this.project_id}` : ''
    const resp  = await fetch(`/api/listers/${this.id}/items${query}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer un item dans ${this.id}`)
    return await resp.json()
  },

}
