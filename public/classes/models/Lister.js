import LOG from '../../system/LOG.js'
import { raise } from '../../system/Error.js'
import Item from './Item.js'
import ListerRepository from '../repositories/ListerRepository.js'

export default class Lister {

  constructor(data = {}) {
    this.id = data.id ?? null
    this.title = data.title ?? '---titre manquant---'
    this.active = data.active ?? true
    this.type = data.type ?? null
    this.nature = data.nature ?? 'none'
    this.scale = data.scale ?? null
    this.item_ids = data.item_ids || raise('Lister: data.item_ids missing', data)
    this.brin_ids = data.brin_ids ?? []
    this.perso_ids = data.perso_ids || raise('Lister: data.perso_ids missing', data)
    this.lasts_id = data.lasts_id ?? { item: 0, brin: 0, perso: 0 }
    this.options = data.options ?? { colorizeItemsWithFirstBrin: false }
    this.path = data.path ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.keyboardController = data.keyboardController ?? null
    // -- Ajouté au runtime --
    this.parentItem = data.parentItem ?? null
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

  get contextPath() {
    if (this.parentItem) return `${this.parentItem.parentLister.contextPath}/lof-${this.parentItem.id}`
    return `lof-${this.id}`
  }

  get childListerClass() {
    return null
  }

  async loadItems() {
    this.items = []
    LOG.m(3, 'LOAD ITEMS URL', `/data/${this.contextPath}/__items.json`)
    const response = await fetch(`/data/${this.contextPath}/__items.json`)
    if (!response.ok) return
    const itemsData = await response.json()
    LOG.m(1, 'ITEMS DATA', itemsData)
    itemsData.forEach(itemData => this.items.push(new this.itemClass({ ...itemData, parentLister: this })))
  }

  async enterSelectedItem() {
    if (!this.childListerClass) return
    const item = this.items[this.selectedIndex]
    if (!item) return
    const childLister = new this.childListerClass({
      item_ids: [],
      perso_ids: [],
      keyboardController: this.keyboardController,
      parentItem: item
    })
    await childLister.loadItems()
    childLister.render()
  }
  
  render() {
    const mainPanel = document.querySelector('#main-panel')
    mainPanel.innerHTML = ''
    mainPanel.className = `${this.itemClass.name.toLowerCase()}-list`
    this.domItems = []
    const activeItems = this.items.filter(item => item.active !== false)
    activeItems.forEach((item, itemIndex) => {
      const itemElement = item.createElement(this.type)
      if (itemIndex === this.selectedIndex) itemElement.classList.add('selected')
      if (typeof item.render === 'function') item.render(itemElement)
      this.domItems.push(itemElement)
      mainPanel.appendChild(itemElement)
    })
    if (this.keyboardController) this.keyboardController.register(this)
    return mainPanel
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
    if (targetIndex >= this.domItems.length) return
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
    this.scheduleItemsSave() // voir plus tard, mais certainement que ce sont les données du Lister seulement qu'il faudra sauver
  }


  scheduleItemsSave() {
    clearTimeout(this.itemsSaveTimer)
    this.itemsSaveTimer = setTimeout(() => { void this.saveItems() }, 300)
  }

  createNewItem() {
    LOG.m(2, 'Lister.createNewItem', { lister: this.id, type: this.type, selectedIndex: this.selectedIndex, hasKeyboardController: Boolean(this.keyboardController) })
    if (!this.keyboardController) throw new Error('Lister.createNewItem: keyboardController missing')
    const insertionIndex = this.selectedIndex
    const currentItemElement = this.domItems[insertionIndex]
    this.itemClass.create({
      type: this.type,
      lister: this,
      keyboardController: this.keyboardController,
      insertionIndex,
      currentItemElement
    })
    LOG.m(2, 'Lister.createNewItem.done', { items: this.items.length, domItems: this.domItems.length })
  }

  async save() {
    await ListerRepository.save(this)
  }

  async saveItems() {
    await ListerRepository.saveItems(this)
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    LOG.m(2, 'Lister.commitNewItem', { itemId: item.id, insertionIndex, before: [...this.item_ids] })
    this.items.splice(insertionIndex, 0, item)
    this.item_ids.splice(insertionIndex, 0, item.id)
    LOG.m(2, 'Lister.commitNewItem.afterInsert', { after: [...this.item_ids] })
    this.domItems.splice(insertionIndex, 0, itemElement)
    await ListerRepository.saveItems(this)
    await ListerRepository.save(this)
    LOG.m(2, 'Lister.commitNewItem.saved', { item_ids: [...this.item_ids] })
  }

  selectElement(domElement) {
    const current = this.domItems[this.selectedIndex]
    if (current) current.classList.remove('selected')
    domElement.classList.add('selected')
  }

  clearSelection() {
    this.domItems.forEach(itemElement => itemElement.classList.remove('selected'))
  }

}
