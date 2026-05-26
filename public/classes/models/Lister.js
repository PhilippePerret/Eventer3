// Prononcer "Listeur", c'est un listeur de liste
export default class Lister {
  constructor(data = {}) {
    this.id          = data.id ?? null
    this.active      = data.active ?? true
    this.type        = data.type ?? null
    this.nature      = data.nature ?? 'none'
    this.scale       = data.scale ?? null
    this.item_ids    = data.item_ids ?? []
    this.brin_ids    = data.brin_ids ?? []
    this.perso_ids   = data.perso_ids ?? []
    this.lasts_id    = data.lasts_id ?? { item: 0, brin: 0, perso: 0 }
    this.options     = data.options ?? { colorizeItemsWithFirstBrin: false }
    this.breadcrumbs = data.breadcrumbs ?? []
    this.path        = data.path ?? null
    this.created_at  = data.created_at ?? null
    this.updated_at  = data.updated_at ?? null
  }

  sortItems(items = []) {
    return items.sort((itemA, itemB) => {
      const posA = Number(itemA?.pos ?? 0)
      const posB = Number(itemB?.pos ?? 0)
      return posA - posB
    })
  }
}
