export default {

  async save() {
    const payload = {}
    for (const field of (this.PROPS ?? [])) payload[field.name] = this[field.name]
    const pid   = this.project_id ?? this.parentLister?.project_id
    const query = pid ? `?project_id=${pid}` : ''
    await fetch(`/api/items/${this.id}${query}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      cache:   'no-store',
    })
  },

}
