// Prononcer "Listeur", c'est un listeur de liste
export default class Lister {

  constructor(data = {}) {
    this.id          = data.id ?? null
    this.title       = data.title ?? '---titre manquant---'
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

  get itemClass() {
    return this._itemClass || null
  }

  set itemClass(value) {
    this._itemClass = value
  }
  
  async loadItems() {

    this.items = []

    const folder = this.breadcrumbs.length
      ? `${this.breadcrumbs.join('/')}/${this.id}/`
      : `${this.id}/`

    for (const itemId of this.item_ids) {

      const response = await fetch(
        `/data/${folder}${itemId}.json`
      )

      if (!response.ok) continue

      const itemData = await response.json()

      if (itemData.active === false) continue

      const ItemClass = this.itemClass

      const item = ItemClass
        ? new ItemClass(itemData)
        : itemData

      this.items.push(item)

    }

    this.items = this.sortItems(this.items)

  }

  render() {
    const listing = document.createElement('div')

    listing.classList.add(`${this.type}-listing`)

    this.items.forEach(item => {
      const div = document.createElement('div')

      div.classList.add('item')
      div.classList.add(`${this.type}-listing__item`)

      if (typeof item.render === 'function') {
        item.render(div)
      } else {
        this.renderItemContent(div, item)
      }
      
      listing.appendChild(div)
    })

    const mainPanel = document.querySelector('#main-panel')

    mainPanel.classList.add(
      `${this.type}s-listing`
    )

    return listing
  }

  // Doit être surclassé par chaque classe spécialisée, 
  // à savoir Project, Event, Brin, Perso.
  renderItemContent(div, item) {
    div.innerText = item.title
  }
}