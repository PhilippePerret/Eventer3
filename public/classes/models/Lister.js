import Item from './Item.js'
import LOG from '../../system/LOG.js'

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
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.keyboardController = data.keyboardController ?? null
    this.items = []
    this.domItems = []
    this.selectedIndex = 0
  }

  get itemClass() {
    return this._itemClass || Item
  }

  set itemClass(value) {
    this._itemClass = value
  }

  get dataFolder() {
    if (this.breadcrumbs.length === 0) return this.id
    return `${this.breadcrumbs.join('/')}/${this.id}`
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
      this.items.push(new this.itemClass(itemData))
    }
    this.items = this.sortItems(this.items)
  }

  render() {
    const listElement = document.createElement('div')
    listElement.classList.add(`${this.type}-list`)
    this.domItems = []
    this.items.forEach((item, itemIndex) => {
      const itemElement = item.createElement(this.type)
      if (itemIndex === this.selectedIndex) itemElement.classList.add('selected')
      if (typeof item.render === 'function') item.render(itemElement)
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
    this.selectedIndex = targetIndex
  }

  createNewItem() {
    LOG.m(2, 'Lister.createNewItem', { lister: this.id, type: this.type, selectedIndex: this.selectedIndex, hasKeyboardController: Boolean(this.keyboardController) })
    if (!this.keyboardController) throw new Error('Lister.createNewItem: keyboardController missing')
    const newItem = this.itemClass.createEmpty()
    const newItemElement = newItem.createEditorElement(this.type, this.keyboardController)
    const insertionIndex = this.selectedIndex
    const currentItemElement = this.domItems[insertionIndex]
    this.items.splice(insertionIndex, 0, newItem)
    this.domItems.splice(insertionIndex, 0, newItemElement)
    if (currentItemElement) currentItemElement.before(newItemElement)
    else document.querySelector(`#main-panel .${this.type}-list`).appendChild(newItemElement)
    this.clearSelection()
    this.selectItemAt(insertionIndex)
    LOG.m(2, 'Lister.createNewItem.done', { items: this.items.length, domItems: this.domItems.length })
  }

  clearSelection() {
    this.domItems.forEach(itemElement => itemElement.classList.remove('selected'))
  }

}
