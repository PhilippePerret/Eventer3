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
}