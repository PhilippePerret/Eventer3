import LOG from '../../system/LOG.js'
import { raise } from '../../system/Error.js'
import Item from './Item.js'
import ListerRepository from '../repositories/ListerRepository.js'
import FooterHelp from '../ui/FooterHelp.js'
import Notification from '../ui/Notification.js'


export default class Lister {

  constructor(data = {}) {
    this.id = data.id ?? null
    this.title = data.title ?? '---titre manquant---'
    this.active = data.active ?? true
    this.type = data.type ?? null
    this.nature = data.nature ?? 'none'
    this.scale = data.scale ?? null
    this.item_ids = data.item_ids ?? []
    this.brin_ids = data.brin_ids ?? []
    this.perso_ids = data.perso_ids ?? []
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
    // -- Édition contentEditable --
    this.editing = false
    this.editingElement = null
    this.editingItem = null
    this.editingPropertyIndex = 0
  }

  get itemClass() {
    return this._itemClass || Item
  }

  set itemClass(value) {
    this._itemClass = value
  }

  get uiModes() { return [] }

  get contextPath() {
    if (this.parentItem) return `${this.parentItem.parentLister.contextPath}/lof-${this.parentItem.id}`
    return `lof-${this.id}`
  }

  get childListerClass() {
    return null
  }

  get itemsFilename() {
    return '__items.json'
  }

  async loadDefinition() {
    await ListerRepository.loadDefinition(this)
  }

  async loadItems() {
    this.items = []
    const itemsData = await ListerRepository.loadItems(this)
    this.item_ids.forEach(id => {
      const itemData = itemsData[id]
      if (itemData) this.items.push(new this.itemClass({ ...itemData, parentLister: this }))
    })
  }

  leaveToParent() {
    LOG.m(2, 'Lister.leaveToParent', { hasParentItem: Boolean(this.parentItem) })
    if (!this.parentItem) return
    this.parentItem.parentLister.render()
  }

  async enterSelectedItem() {
    if (!this.childListerClass) return
    const item = this.items[this.selectedIndex]
    if (!item) return
    const listerData = await ListerRepository.loadItemLister(item.id)
    const childLister = new this.childListerClass({
      id: listerData?.id ?? null,
      item_ids: listerData?.item_ids ?? [],
      keyboardController: this.keyboardController,
      parentItem: item
    })
    if (listerData) {
      if (listerData.brins_lister_id) childLister.brins_lister_id = listerData.brins_lister_id
      await childLister.loadItems()
    } else {
      childLister.__isVirtual = true
    }
    childLister.render()
    if (childLister.__isVirtual) childLister.createNewItem()
  }
  
  renderHeader() {
    return null
  }

  render() {
    this.domContainer = document.querySelector('#main-panel')
    this.domContainer.innerHTML = ''
    this.domContainer.className = `${this.itemClass.name.toLowerCase()}-list`
    this.domItems = []
    const header = this.renderHeader()
    if (header) this.domContainer.appendChild(header)
    const activeItems = this.items.filter(item => item.active !== false)
    activeItems.forEach((item, itemIndex) => {
      const itemElement = item.createElement(this.itemClass.name.toLowerCase())
      if (itemIndex === this.selectedIndex) itemElement.classList.add('selected')
      if (typeof item.render === 'function') item.render(itemElement)
      this.domItems.push(itemElement)
      this.domContainer.appendChild(itemElement)
    })
    const canDelete = this.items.filter(item => item.active !== false).length > 1
    FooterHelp.update(this.uiModes, { canDelete })
    if (this.keyboardController) this.keyboardController.register(this)
    return this.domContainer
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
    if (currentIndex < 0) return
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
    this._syncIdsOnMove(currentIndex, targetIndex)
    this.scheduleSave()
  }

  _syncIdsOnMove(currentIndex, targetIndex) {
    const movedId = this.item_ids[currentIndex]
    this.item_ids.splice(currentIndex, 1)
    this.item_ids.splice(targetIndex, 0, movedId)
  }

  scheduleSave() {
    clearTimeout(this.saveTimer)
    this.saveTimer = setTimeout(() => { void this.save() }, 300)
  }

  scheduleItemsSave() {
    clearTimeout(this.itemsSaveTimer)
    this.itemsSaveTimer = setTimeout(() => { void this.saveItems() }, 300)
  }

  editSelectedItem() {
    const item = this.items[this.selectedIndex]
    const itemElement = this.domItems[this.selectedIndex]
    if (!item || !itemElement) return
    item.enterEdition(this.itemClass.name.toLowerCase(), this.keyboardController, itemElement)
  }

  startEditing(property = null) {
    const item = this.items[this.selectedIndex]
    const el = this.domItems[this.selectedIndex]
    if (!item || !el) return
    const props = item.editableProperties?.() ?? []
    const prop = property ?? props[0]
    if (!prop) return
    const propIdx = Math.max(0, props.indexOf(prop))
    const target = el.querySelector(`[data-property="${prop}"]`)
    if (!target) return
    this.editing = true
    this.editingElement = target
    this.editingItem = item
    this.editingPropertyIndex = propIdx
    if (target.tagName === 'SELECT' || target.tagName === 'INPUT') {
      target.focus()
      return
    }
    target.contentEditable = 'true'
    target.spellcheck = false
    target.focus()
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(target)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  stopEditing(shouldSave = true) {
    if (!this.editing) return
    const target = this.editingElement
    const item = this.editingItem
    if (target && item) {
      const prop = target.dataset.property
      if (target.tagName === 'SELECT' || target.tagName === 'INPUT') {
        if (shouldSave) item[prop] = target.value
        else target.value = item[prop] ?? ''
      } else {
        if (shouldSave) item[prop] = target.textContent.trim()
        else target.textContent = item[prop] ?? ''
        target.contentEditable = 'false'
      }
      if (shouldSave) this.onAfterStopEditing(item, prop)
    }
    this.editing = false
    this.editingElement = null
    this.editingItem = null
    if (shouldSave) void this.saveItems()
  }

  onAfterStopEditing(item, prop) {}

  editNextProperty() {
    const item = this.items[this.selectedIndex]
    const props = item?.editableProperties?.() ?? []
    this.stopEditing(true)
    this.editingPropertyIndex = (this.editingPropertyIndex + 1) % props.length
    this.startEditing(props[this.editingPropertyIndex])
  }

  _handleEditingKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      this.editNextProperty()
      return
    }
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault()
      const item = this.editingItem
      const wasNew = item?.__isNew
      const selectedIdx = this.selectedIndex
      const shouldSave = event.key === 'Enter'
      this.stopEditing(shouldSave)
      if (wasNew) {
        if (shouldSave) {
          item.__isNew = false
          void this.save()
        } else {
          this.items.splice(selectedIdx, 1)
          this.domItems[selectedIdx]?.remove()
          this.domItems.splice(selectedIdx, 1)
          this.selectedIndex = Math.max(0, selectedIdx - 1)
          this._onCancelNewItem(selectedIdx)
        }
      }
    }
  }

  _onCancelNewItem(idx) {}

  deleteSelectedItem() {
    const activeItems = this.items.filter(item => item.active !== false)
    if (activeItems.length <= 1) {
      Notification.show('Impossible de supprimer le dernier élément.')
      return
    }
    const idx = this.selectedIndex
    const item = this.items[idx]
    const el = this.domItems[idx]
    if (!item || !el) return
    el.remove()
    this.items.splice(idx, 1)
    this.domItems.splice(idx, 1)
    this.item_ids = this.item_ids.filter(id => id !== item.id)
    const newIdx = Math.min(idx, this.domItems.length - 1)
    this.selectedIndex = newIdx
    if (this.domItems[newIdx]) this.domItems[newIdx].classList.add('selected')
    const canDelete = this.items.filter(i => i.active !== false).length > 1
    FooterHelp.update(this.uiModes, { canDelete })
    this._onAfterDelete(item)
    void ListerRepository.deleteItem(this, item)
  }

  _onAfterDelete(item) {}

  toggleSelectedItemChecked() {
    const item = this.items[this.selectedIndex]
    const el = this.domItems[this.selectedIndex]
    if (!item || !el) return
    const isChecked = this._performToggleChecked(item)
    el.classList.toggle('checked', isChecked)
    void this._saveAfterToggle(item)
  }

  _performToggleChecked(item) {
    item.checked = !item.checked
    return item.checked
  }

  async _saveAfterToggle(item) {
    await this.saveItems()
  }

  close() {}

  createNewItem() {
    LOG.m(2, 'Lister.createNewItem', { lister: this.id, type: this.type, selectedIndex: this.selectedIndex, hasKeyboardController: Boolean(this.keyboardController) })
    if (!this.keyboardController) throw new Error('Lister.createNewItem: keyboardController missing')
    const insertionIndex = this.selectedIndex
    const currentItemElement = this.domItems[insertionIndex]
    this.itemClass.create({
      type: this.itemClass.name.toLowerCase(),
      lister: this,
      keyboardController: this.keyboardController,
      insertionIndex,
      currentItemElement
    })
    LOG.m(2, 'Lister.createNewItem.done', { items: this.items.length, domItems: this.domItems.length })
  }

  createNewItemAfter() {
    if (!this.keyboardController) throw new Error('Lister.createNewItemAfter: keyboardController missing')
    const originalIndex = this.selectedIndex
    const insertionIndex = originalIndex + 1
    const currentEl = this.domItems[originalIndex]
    if (currentEl) currentEl.classList.remove('selected')
    const nextEl = this.domItems[insertionIndex] ?? null
    this.selectedIndex = insertionIndex
    const item = this.itemClass.create({
      type: this.itemClass.name.toLowerCase(),
      lister: this,
      keyboardController: this.keyboardController,
      insertionIndex,
      currentItemElement: nextEl
    })
    item.previousSelectedIndex = originalIndex
  }

  async save() {
    await ListerRepository.save(this)
  }

  async saveItems() {
    await ListerRepository.saveItems(this)
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    if (this.__isVirtual) {
      const newLister = await ListerRepository.createLister({ type: this.type, parent_item_id: this.parentItem.id })
      this.id = newLister.id
      delete this.__isVirtual
    }
    const payload = { title: item.title, type: item.type }
    if (this.itemClass.idPrefix === null) payload.id = item.id
    const created = await ListerRepository.createItem(this.id, payload)
    if (this.itemClass.idPrefix !== null) item.id = created.id
    item.parentLister = this
    LOG.m(2, 'Lister.commitNewItem', { itemId: item.id, insertionIndex })
    this.items.splice(insertionIndex, 0, item)
    this.item_ids.splice(insertionIndex, 0, item.id)
    this.domItems.splice(insertionIndex, 0, itemElement)
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
