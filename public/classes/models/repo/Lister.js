export default {

  async _fetchData() {
    const id    = this.id
    const pid   = this.project.id
    const query = pid ? `?project_id=${pid}` : ''
    const def   = await fetch(`/api/listers/${id}${query}`, { cache: 'no-store' }).then(r => r.json())
    if (!def) return null
    this._missing = def.missing === true
    if (def.id             != null) this.id             = def.id
    if (def.man_depth      != null) this.man_depth      = def.man_depth
    if (def.nature         != null) this.nature         = def.nature
    if (def.project_nature != null) this.project_nature = def.project_nature

    this.item_ids = def.item_ids ?? []
    return await fetch(`/api/listers/${id}/items${query}`, { cache: 'no-store' }).then(r => r.json())
  },

  async deleteItem(item) {
    const qs_pid = this.project === 'none' ? '' : `?project_id=${this.project.id}`
    const resp   = await fetch(`/api/listers/${this.id}/items/${item.id}${qs_pid}`, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  },

  async countDescendants(item) {
    const pid = this.project.id ?? item.id
    const query = pid ? `?project_id=${pid}` : ''
    const resp = await fetch(`/api/listers/${this.id}/items/${item.id}/descendants/count${query}`, { cache: 'no-store' })
    if (!resp.ok) return 0
    const data = await resp.json()
    return data.count ?? 0
  },

  async save() {
    const qs_pid = this.project === 'none' ? '' : `?project_id=${this.project.id}`
    await fetch(`/api/listers/${this.id}${qs_pid}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ item_ids: this.item_ids }),
      cache:   'no-store',
    })
  },

  async saveNature() {
    const pid = this.project?.id
    if (!pid) return
    await fetch(`/api/listers/${this.id}?project_id=${pid}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nature: this.nature }),
      cache:   'no-store',
    })
  },

  async saveProjectMeta(fields) {
    const pid = this.project?.id
    if (!pid) return
    await fetch(`/api/projects/${pid}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
      cache:   'no-store',
    })
  },

  async createItem(fields) {
    const qs_pid = this.project === 'none' ? '' : `?project_id=${this.project.id}`
    const resp  = await fetch(`/api/listers/${this.id}/items${qs_pid}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer un item dans ${this.id}`)
    return await resp.json()
  },

}
