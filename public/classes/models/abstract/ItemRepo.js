export default class ItemRepo {
  constructor(item) { this.item = item }

  async save() {
    const payload = {}
    for (const field of (this.item.PROPS ?? [])) payload[field.name] = this.item[field.name]
    const pid   = this.item.project_id ?? this.item.parentLister?.project_id
    const query = pid ? `?project_id=${pid}` : ''
    await fetch(`/api/items/${this.item.id}${query}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    })
  }
}
