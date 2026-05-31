import Lister from './Lister.js'
import Brin from './Brin.js'
import { ItemDataMapper } from '../repositories/Mapper.js'

export default class BrinLister extends Lister {

  static async open(eventLister) {
    const brinLister = new BrinLister({ eventLister, keyboardController: eventLister.keyboardController })
    await brinLister.loadItems()
    if (brinLister.items.length === 0) {
      await BrinLister.init(eventLister)
      brinLister.brin_ids = [...eventLister.brin_ids]
      brinLister.lasts_id = eventLister.lasts_id
      await brinLister.loadItems()
    }
    brinLister.render()
    eventLister.keyboardController.pushMode({
      type: 'brin-panel',
      onKeyDown: (event, controller) => brinLister.handleKeyDown(event, controller)
    })
  }

  static async init(eventLister) {
    const b1 = { id: 'b1', tt: 'Intrigue principale', ch: false, bg: Brin.generateBadge('Intrigue principale'), co: Brin.colorFor(1) }
    await fetch(`/data/${eventLister.contextPath}/__brins.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ b1 })
    })
    eventLister.brin_ids = ['b1']
    if (!eventLister.lasts_id) eventLister.lasts_id = { item: 0, brin: 0, perso: 0 }
    eventLister.lasts_id.brin = 1
    await fetch(`/data/${eventLister.contextPath}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brin_ids: ['b1'], lasts_id: eventLister.lasts_id })
    })
  }

  constructor({ eventLister, keyboardController }) {
    super({ item_ids: [], perso_ids: [], keyboardController })
    this.eventLister = eventLister
    this.brin_ids = [...(eventLister.brin_ids ?? [])]
    this.lasts_id = eventLister.lasts_id
    this.itemClass = Brin
  }

  get contextPath() {
    return this.eventLister.contextPath
  }

  get itemsFilename() {
    return '__brins.json'
  }

  async loadItems() {
    this.items = []
    const response = await fetch(`/data/${this.contextPath}/__brins.json`)
    if (!response.ok) return
    const brinsData = await response.json()
    this.brin_ids.forEach((id, idx) => {
      const brinData = brinsData[id]
      if (!brinData) return
      const brin = new Brin({ ...brinData, parentLister: this })
      if (!brin.badge) brin.badge = Brin.generateBadge(brin.title)
      if (!brin.color) brin.color = Brin.colorFor(idx + 1)
      this.items.push(brin)
    })
  }

  render() {
    const panel = document.querySelector('#brin-panel')
    panel.innerHTML = ''
    panel.classList.remove('hidden')

    const card = document.createElement('div')
    card.className = 'brin-panel__inner'
    panel.appendChild(card)

    const header = document.createElement('div')
    header.className = 'panel-header'
    const titleEl = document.createElement('span')
    titleEl.className = 'panel-title'
    const selectedEvent = this.eventLister.items[this.eventLister.selectedIndex]
    titleEl.textContent = `Brins · ${selectedEvent?.title ?? this.eventLister.parentItem?.title ?? ''}`
    header.appendChild(titleEl)
    card.appendChild(header)

    const footer = document.querySelector('#shortcuts-footer')
    if (footer) {
      this._previousFooterHTML = footer.innerHTML
      footer.innerHTML = `
        <span><kbd>↑</kbd><kbd>↓</kbd> Choisir</span>
        <span><kbd>Entrée</kbd> Éditer</span>
        <span><kbd>n</kbd> Nouveau brin</span>
        <span><kbd>Espace</kbd> Cocher</span>
        <span><kbd>Échap</kbd> Fermer</span>
        <span><kbd>⌘</kbd><kbd>Entrée</kbd> Fermer</span>
      `
    }

    this.domContainer = card
    this.domItems = []
    this.selectedIndex = 0
    this.items.forEach((item, idx) => {
      const el = item.createElement('brin')
      el.classList.add('panel-row', 'brin-row')
      if (item.checked) el.classList.add('checked')
      if (idx === this.selectedIndex) el.classList.add('selected')
      if (typeof item.render === 'function') item.render(el)
      this.domItems.push(el)
      card.appendChild(el)
    })
    if (this.keyboardController) this.keyboardController.register(this)
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    this.lasts_id.brin += 1
    item.id = `b${this.lasts_id.brin}`
    if (!item.badge) item.badge = Brin.generateBadge(item.title)
    if (!item.color) item.color = Brin.colorFor(this.lasts_id.brin)
    item.render(itemElement)
    this.items.splice(insertionIndex, 0, item)
    this.brin_ids.splice(insertionIndex, 0, item.id)
    this.domItems.splice(insertionIndex, 0, itemElement)
    await this.saveItems()
    await this.save()
  }

  async saveItems() {
    const hash = {}
    this.items.forEach(item => { hash[item.id] = ItemDataMapper.toPersistence(item) })
    const response = await fetch(`/data/${this.contextPath}/__brins.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hash)
    })
    if (!response.ok) throw new Error(`Cannot save brins to ${this.contextPath}`)
  }

  async save() {
    const response = await fetch(`/data/${this.contextPath}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brin_ids: this.brin_ids, lasts_id: this.lasts_id })
    })
    if (!response.ok) throw new Error(`Cannot save brin_ids to ${this.contextPath}`)
    this.eventLister.brin_ids = [...this.brin_ids]
    this.eventLister.lasts_id = { ...this.lasts_id }
  }

  toggleSelectedItemChecked() {
    const item = this.items[this.selectedIndex]
    const itemElement = this.domItems[this.selectedIndex]
    if (!item) return
    item.checked = !item.checked
    itemElement.classList.toggle('checked', item.checked)
    void this._saveBrinChecked(item)
  }

  async _saveBrinChecked(item) {
    const payload = { id: item.id, ch: item.checked }
    const response = await fetch(`/data/${this.contextPath}/__brins.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error(`Cannot save brin checked state`)
  }

  handleKeyDown(event, controller) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        this.closePanel(controller)
        return
      case 'Enter':
        event.preventDefault()
        if (event.metaKey) {
          this.closePanel(controller)
          return
        }
        this.editSelectedItem()
        return
      case 'ArrowDown':
        event.preventDefault()
        this.selectNextItem()
        return
      case 'ArrowUp':
        event.preventDefault()
        this.selectPreviousItem()
        return
      case ' ':
        event.preventDefault()
        this.toggleSelectedItemChecked()
        return
      case 'n':
        event.preventDefault()
        this.createNewItem()
        return
    }
  }

  closePanel(controller) {
    const panel = document.querySelector('#brin-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    const footer = document.querySelector('#shortcuts-footer')
    if (footer && this._previousFooterHTML !== undefined) {
      footer.innerHTML = this._previousFooterHTML
    }
    controller.popMode()
    controller.register(this.eventLister)
  }

}
