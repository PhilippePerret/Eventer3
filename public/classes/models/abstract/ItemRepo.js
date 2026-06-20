export default class ItemRepo {
  constructor(item) { this.item = item }

  async save() {
    const payload = {}
    for (const field of (this.item.PROPS ?? [])) payload[field.name] = this.item[field.name]
    await fetch(`/api/items/${this.item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    })
  }
}
