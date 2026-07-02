export default {

  scheduleSave() {
    clearTimeout(this._saveTimer)
    this._saveTimer = setTimeout(() => this.save(), 300)
  },

  async save() {
    const payload = { checked: this.checked }
    for (const field of (this.PROPS ?? [])) payload[field.name] = this[field.name]
    const pid   = (this.project ?? this.parentLister?.project).id
    const query = pid ? `?project_id=${pid}` : ''
    await fetch(`/api/items/${this.id}${query}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      cache:   'no-store',
    })
  },

}
