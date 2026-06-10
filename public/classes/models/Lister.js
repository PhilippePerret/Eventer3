import LOG from '../../system/LOG.js'
import { raise } from '../../system/Error.js'
import Item from './Item.js'
import ListerRepository from '../repositories/ListerRepository.js'
import FooterHelp from '../ui/FooterHelp.js'
import Notification from '../ui/Notification.js'
import FilterState from '../system/FilterState.js'
import PopupSelect from '../ui/PopupSelect.js'


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
    this.project_id = data.project_id ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.keyboardController = data.keyboardController ?? null
    // -- Ajouté au runtime --
    this.parentItem = data.parentItem ?? null
    this.items = []
    this.domItems = []
    this.selectedIndex = 0
    // -- Filtre --
    this.filterState = new FilterState()
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

  get hasSearchField() { return true }

  get filterField() { return 'title' }

  get filterWidgets() {
    return [{ type: 'text', field: this.filterField, placeholder: 'Filtrer…' }]
  }


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
      if (itemData) this.items.push(new this.itemClass({ ...itemData, parentLister: this, project_id: this.project_id }))
    })
  }

  leaveToParent() {
    LOG.m(2, 'Lister.leaveToParent', { hasParentItem: Boolean(this.parentItem) })
    if (!this.parentItem) return
    this.parentItem.parentLister.render()
  }

  _childListerData(item) {
    return { id: item.lister_id ?? null, parentItem: item, project_id: this.project_id }
  }

  async enterSelectedItem() {
    if (!this.childListerClass) return
    const item = this.items[this.selectedIndex]
    if (!item) return
    const childLister = new this.childListerClass({
      ...this._childListerData(item),
      keyboardController: this.keyboardController,
    })
    childLister.depth = this.depth + 1
    if (item.lister_id != null) {
      await childLister.loadDefinition()
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

  _renderPanelHeader(card, title) {
    const header = document.createElement('div')
    header.className = 'panel-header'
    const titleEl = document.createElement('span')
    titleEl.className = 'panel-title'
    titleEl.textContent = title
    header.appendChild(titleEl)
    card.appendChild(header)
    if (this.hasSearchField) this._renderFilterBar(card)
  }

  _renderFilterBar(container) {
    const bar = document.createElement('div')
    bar.className = 'filter-bar hidden'
    this._widgetFilterState = {}

    this.filterWidgets.forEach(widget => {
      const div = document.createElement('div')
      div.className = 'filter-widget'
      div.dataset.field = widget.field

      if (widget.type === 'text') {
        this._widgetFilterState[widget.field] = ''
        const input = document.createElement('input')
        input.type = 'text'
        input.className = 'panel-search'
        input.placeholder = widget.placeholder ?? 'Filtrer…'
        div.appendChild(input)
        input.addEventListener('input', () => {
          this._widgetFilterState[widget.field] = input.value.trim().toLowerCase()
          this._applyWidgetFilters()
        })
      } else if (widget.type === 'menu') {
        this._widgetFilterState[widget.field] = new Set()

        const btn = document.createElement('button')
        btn.className = 'filter-widget__btn'
        btn.textContent = widget.label ?? widget.field

        const updateBtn = (values) => {
          btn.classList.toggle('has-selection', values.length > 0)
          btn.textContent = values.length > 0
            ? `${widget.label ?? widget.field} (${values.length})`
            : (widget.label ?? widget.field)
        }

        const openPopup = () => {
          const currentValues = [...this._widgetFilterState[widget.field]]
          new PopupSelect({
            options: widget.values,
            currentValue: currentValues,
            multi: true,
            keyboardController: this.keyboardController,
            onChange: (values) => {
              this._widgetFilterState[widget.field] = new Set(values)
              this._applyWidgetFilters()
              updateBtn(values)
            },
            onSelect: (values) => {
              this._widgetFilterState[widget.field] = new Set(values)
              this._applyWidgetFilters()
              updateBtn(values)
              btn.focus()
            },
            onCancel: () => { btn.focus() },
            onTab: () => {
              const btns = [...bar.querySelectorAll('.filter-widget__btn')]
              const idx = btns.indexOf(btn)
              if (idx >= 0 && idx < btns.length - 1) btns[idx + 1].focus()
              else bar.querySelector('.panel-search')?.focus()
            },
          }).open(btn)
        }

        btn.addEventListener('click', openPopup)
        btn.addEventListener('keydown', e => {
          if (e.key === 'Tab' || e.key === 'Escape') {
            // propagate : Tab → KC navigue, Escape → KC ferme popup/panneau
          } else if (e.key === 'ArrowDown') {
            e.stopPropagation()
            e.preventDefault()
            openPopup()
          } else {
            e.stopPropagation()
          }
        })

        div.appendChild(btn)
      }

      bar.appendChild(div)
    })

    container.appendChild(bar)
  }

  _applyWidgetFilters() {
    this.items.forEach((item, i) => {
      let visible = true
      for (const [field, filter] of Object.entries(this._widgetFilterState)) {
        if (typeof filter === 'string') {
          if (filter && !(item[field] ?? '').toString().toLowerCase().includes(filter)) {
            visible = false; break
          }
        } else if (filter instanceof Set && filter.size > 0) {
          if (!filter.has(String(item[field] ?? ''))) {
            visible = false; break
          }
        }
      }
      item._visible = visible
      this.domItems[i]?.classList.toggle('hidden', !visible)
    })
    this._clampSelection()
  }

  focusTextFilter() {
    this.domContainer?.querySelector('.filter-bar')?.classList.remove('hidden')
    this.domContainer?.querySelector('.panel-search')?.focus()
  }

  render() {
    this.domContainer = document.querySelector('#main-panel')
    this.domContainer.innerHTML = ''
    this.domContainer.className = `${this.itemClass.name.toLowerCase()}-list`
    if (this.depth != null) this.domContainer.dataset.depth = String(this.depth)
    this.domItems = []
    const header = this.renderHeader()
    if (header) this.domContainer.appendChild(header)
    if (this.hasSearchField) this._renderFilterBar(this.domContainer)
    const activeItems = this.items.filter(item => item.active !== false)
    activeItems.forEach((item, itemIndex) => {
      const itemElement = item.createElement(this.itemClass.name.toLowerCase())
      if (itemIndex === this.selectedIndex) itemElement.classList.add('selected')
      if (item.checked) itemElement.classList.add('checked')
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
    let i = this.selectedIndex + 1
    while (i < this.items.length && this.items[i]._visible === false) i++
    if (i < this.items.length) this.selectItemAt(i)
  }

  selectPreviousItem() {
    let i = this.selectedIndex - 1
    while (i >= 0 && this.items[i]._visible === false) i--
    if (i >= 0) this.selectItemAt(i)
  }

  _clampSelection() {
    if (this.items[this.selectedIndex]?._visible !== false) return
    let i = this.selectedIndex + 1
    while (i < this.items.length && this.items[i]._visible === false) i++
    if (i < this.items.length) { this.selectItemAt(i); return }
    i = this.selectedIndex - 1
    while (i >= 0 && this.items[i]._visible === false) i--
    if (i >= 0) this.selectItemAt(i)
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
    this._onAfterMoveItem(currentIndex, targetIndex)
  }

  _onAfterMoveItem(currentIndex, targetIndex) {
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

  _onCancelNewItem(idx) {
    if (this.__isVirtual) this.leaveToParent()
  }

  copySelectedItem() {
    const item = this.items[this.selectedIndex]
    if (!item) return
    this.keyboardController.clipboard = { minClass: this.itemClass.minClass, data: item.toClipboardData() }
  }

  cutSelectedItem() {
    const activeItems = this.items.filter(item => item.active !== false)
    if (activeItems.length <= 1) {
      Notification.show(`Impossible de couper le dernier ${this.itemClass.thingName.thing}.`)
      return
    }
    const item = this.items[this.selectedIndex]
    if (!item) return
    const clipData = item.toClipboardData()
    clipData.id = item.id
    this.keyboardController.clipboard = { minClass: this.itemClass.minClass, data: clipData, isCut: true }
    this.deleteSelectedItem({ silent: true })
  }

  async pasteItem() {
    const clipboard = this.keyboardController?.clipboard
    if (!clipboard) return
    if (clipboard.minClass !== this.itemClass.minClass) return
    const insertionIndex = this.selectedIndex
    const itemData = { ...clipboard.data }
    if (!clipboard.isCut) delete itemData.id
    const item = new this.itemClass(itemData)
    const itemElement = item.createElement()
    if (typeof item.render === 'function') item.render(itemElement)
    const currentEl = this.domItems[insertionIndex]
    if (currentEl) {
      currentEl.classList.remove('selected')
      currentEl.before(itemElement)
    } else {
      this.domContainer.appendChild(itemElement)
    }
    await this.commitNewItem(item, itemElement, insertionIndex)
    this.selectedIndex = insertionIndex
    if (typeof item.render === 'function') item.render(itemElement)
    itemElement.classList.add('selected')
  }

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
    this._updateCheckVisual(el, isChecked)
    void this._saveAfterToggle(item)
  }

  _updateCheckVisual(el, isChecked) {}

  _performToggleChecked(item) {
    item.checked = !item.checked
    return item.checked
  }

  async _saveAfterToggle(item) {
    await this.saveItems()
  }

  applyFilter() {
    this.items.forEach((item, i) => {
      const newVisible = this.filterState.matches(item)
      if (newVisible !== item._visible) {
        item._visible = newVisible
        this.domItems[i].classList.toggle('hidden', !newVisible)
      }
    })
    this._clampSelection()
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

  createNewItemAfter(defaultTitle = '') {
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
      currentItemElement: nextEl,
      defaultTitle,
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
      this.parentItem.lister_id = this.id
      delete this.__isVirtual
    }
    const payload = { title: item.title, type: item.type }
    if (item.id) payload.id = item.id
    const created = await ListerRepository.createItem(this.id, payload)
    if (!item.id) item.id = created.id
    itemElement.dataset.id = item.id
    if (typeof item.render === 'function') item.render(itemElement)
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
