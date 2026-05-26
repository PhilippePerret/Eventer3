// Prononcer "Listeur", c'est un listeur de liste
export default class Lister {

  constructor(data = {}) {
    this.id          = data.id ?? null
    this.title       = data.title ?? ''
    this.active      = data.active ?? true
    this.type        = data.type ?? null
    this.nature      = data.nature ?? 'none'
    this.scale       = data.scale ?? null
    this.item_ids    = data.item_ids ?? data.items ?? []
    this.brin_ids    = data.brin_ids ?? data.brins ?? []
    this.perso_ids   = data.perso_ids ?? data.persos ?? []
    this.lasts_id    = data.lasts_id ?? { item: 0, brin: 0, perso: 0 }
    this.options     = data.options ?? { colorizeItemsWithFirstBrin: false }
    this.breadcrumbs = data.breadcrumbs ?? []
    this.path        = data.path ?? null
    this.created_at  = data.created_at ?? null
    this.updated_at  = data.updated_at ?? null

    this.items       = []
  }

  sortItems(items = []) {
    return items.sort((itemA, itemB) => {
      const posA = Number(itemA?.pos ?? 0)
      const posB = Number(itemB?.pos ?? 0)
      return posA - posB
    })
  }

  async loadItems() {

    this.items = []

    for (const itemId of this.item_ids) {

      const response = await fetch(
        `/data/${this.id}/${itemId}.json`
      )

      const itemData = await response.json()

      this.items.push(itemData)

    }

    this.items = this.sortItems(this.items)

  }

  render() {

    const listing = document.createElement('div')

    listing.classList.add('listing')

    if (this.type) {
      listing.classList.add(this.type)
    }

    this.items.forEach(item => {

      const div = document.createElement('div')

      div.classList.add('item')

      if (item.type) {
        div.classList.add(item.type)
      }

      div.innerText = item.title

      listing.appendChild(div)

    })

    return listing

  }

}