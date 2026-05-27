export default class Lister {
  constructor(data = {}) {
    this.id = data.id ?? null
    this.title = data.title ?? '---titre manquant---'
    this.active = data.active ?? true
    this.type = data.type ?? null
    this.nature = data.nature ?? 'none'
    this.scale = data.scale ?? null
    this.item_ids = data.item_ids ?? data.items ?? []
    this.brin_ids = data.brin_ids ?? data.brins ?? []
    this.perso_ids = data.perso_ids ?? data.persos ?? []
    this.lasts_id = data.lasts_id ?? { item: 0, brin: 0, perso: 0 }
    this.options = data.options ?? { colorizeItemsWithFirstBrin: false }
    this.breadcrumbs = data.breadcrumbs ?? []
    this.path = data.path ?? null
    this.created_at = data.updated_at ?? null
    this.updated_at = data.updated_at ?? null
    this.keyboardController = data.keyboardController ?? null
    this.items = []
    this.domItems = []
    this.selectedIndex = 0
    this.saveTimers = {}
  }

  get itemClass() {
    return this._itemClass || null
  }

  set itemClass(value) {
    this._itemClass = value
  }

  get dataFolder() {
    return this.breadcrumbs.length ? `${this.breadcrumbs.join('/')}/${this.id}` : this.id
  }

  sortItems(items = []) {
    return items.sort((itemA, itemB) => Number(itemA?.pos ?? 0) - Number(itemB?.pos ?? 0))
  }

  async loadItems() {
    this.items = []
    for (const itemId of this.item_ids) {
      const response = await fetch(`/data/${this.dataFolder}/${itemId}.json`)
      if (!response.ok) continue
      const itemData = await response.json()
      if (itemData.active === false) continue
      const ItemClass = this.itemClass
      const item = ItemClass ? new ItemClass(itemData) : itemData
      this.items.push(item)
    }
    this.items = this.sortItems(this.items)
  }

  render() {
    const listElement = document.createElement('div')
    listElement.classList.add(`${this.type}-list`)
    this.domItems = []
    this.items.forEach((item, itemIndex) => {
      const itemElement = document.createElement('div')
      itemElement.classList.add('item')
      itemElement.classList.add(`${this.type}-item`)
      if (itemIndex === this.selectedIndex) itemElement.classList.add('selected')
      if (typeof item.render === 'function') item.render(itemElement)
      else this.renderItemContent(itemElement, item)
      this.domItems.push(itemElement)
      listElement.appendChild(itemElement)
    })
    const mainPanel = document.querySelector('#main-panel')
    mainPanel.classList.add(`${this.type}-list`)
    if (this.keyboardController) this.keyboardController.register(this)
    return listElement
  }

  selectItemAt(itemIndex) {
    if (itemIndex < 0) return
    if (itemIndex >= this.domItems.length) return
    const currentItemElement = this.domItems[this.selectedIndex]
    const nextItemElement = this.domItems[itemIndex]
    if (currentItemElement) currentItemElement.classList.remove('selected')
    nextItemElement.classList.add('selected')
    this.selectedIndex = itemIndex
  }

  selectNextItem() {
    this.selectItemAt(this.selectedIndex + 1)
  }

  selectPreviousItem() {
    this.selectItemAt(this.selectedIndex - 1)
  }

  moveSelectedItemDown() {
    this.moveSelectedItem(1)
  }

  moveSelectedItemUp() {
    this.moveSelectedItem(-1)
  }

  moveSelectedItem(direction) {
    const currentIndex = this.selectedIndex
    const targetIndex = currentIndex + direction
    if (targetIndex < 0) return
    if (targetIndex >= this.items.length) return
    const movedItem = this.items[currentIndex]
    const movedItemElement = this.domItems[currentIndex]
    const targetItemElement = this.domItems[targetIndex]
    this.items.splice(currentIndex, 1)
    this.domItems.splice(currentIndex, 1)
    this.items.splice(targetIndex, 0, movedItem)
    this.domItems.splice(targetIndex, 0, movedItemElement)
    if (direction > 0) targetItemElement.after(movedItemElement)
    else targetItemElement.before(movedItemElement)
    movedItem.pos = this.positionForItemAt(targetIndex)
    this.selectedIndex = targetIndex
    this.saveItemLater(movedItem)
  }

  positionForItemAt(itemIndex) {
    const previousItem = this.items[itemIndex - 1] ?? null
    const nextItem = this.items[itemIndex + 1] ?? null
    let previousPosition
    let nextPosition
    if (!previousItem) {
      previousPosition = 0
      nextPosition = Number(nextItem.pos)
    } else if (!nextItem) {
      previousPosition = Number(previousItem.pos)
      nextPosition = previousPosition + 50
    } else {
      previousPosition = Number(previousItem.pos)
      nextPosition = Number(nextItem.pos)
    }
    return (previousPosition + nextPosition) / 2
  }

  saveItemLater(item) {
    if (this.saveTimers[item.id]) clearTimeout(this.saveTimers[item.id])
    this.saveTimers[item.id] = setTimeout(() => this.saveItem(item), 500)
  }

  saveItem(item) {
    fetch(`/data/${this.dataFolder}/${item.id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pos: item.pos })
    })
  }

  renderItemContent(itemElement, item) {
    itemElement.innerText = item.title
  }
}