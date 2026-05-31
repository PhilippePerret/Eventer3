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
      brinLister.lasts_id = { ...eventLister.lasts_id }
      await brinLister.loadItems()
    }
    brinLister.render()
  }

  static async init(eventLister) {
    const b1 = { id: 'b1', tt: 'Intrigue principale', bg: Brin.generateBadge('Intrigue principale'), co: Brin.colorFor(1), ty: '' }
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
    this.lasts_id = { ...(eventLister.lasts_id ?? { item: 0, brin: 0, perso: 0 }) }
    this.itemClass = Brin
  }

  get contextPath() { return this.eventLister.contextPath }
  get itemsFilename() { return '__brins.json' }
  get selectedEvent() { return this.eventLister.items[this.eventLister.selectedIndex] }

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

  checked(brin) {
    const ev = this.selectedEvent
    return Array.isArray(ev?.brin_ids) && ev.brin_ids.includes(brin.id)
  }

  // ── Rendu dans le panneau flottant (pas #main-panel) ─────────────

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
    titleEl.textContent = `Brins · ${this.selectedEvent?.title ?? this.eventLister.parentItem?.title ?? ''}`
    header.appendChild(titleEl)
    card.appendChild(header)

    const footer = document.querySelector('#shortcuts-footer')
    if (footer) {
      this._previousFooterHTML = footer.innerHTML
      footer.innerHTML = `
        <span><kbd>↑</kbd><kbd>↓</kbd> Choisir</span>
        <span><kbd>Entrée</kbd> Éditer</span>
        <span><kbd>⇥</kbd> Prop. suivante</span>
        <span><kbd>n</kbd> Nouveau brin</span>
        <span><kbd>Espace</kbd> Cocher</span>
        <span><kbd>⌘Entrée</kbd> Fermer</span>
      `
    }

    this.domContainer = card
    this.domItems = []
    this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, Math.max(0, this.items.length - 1)))

    this.items.forEach((item, idx) => {
      const el = this._createItemElement(item, idx)
      this.domItems.push(el)
      card.appendChild(el)
    })

    if (this.keyboardController) this.keyboardController.register(this)
  }

  _createItemElement(item, idx) {
    const el = document.createElement('div')
    el.className = 'panel-row brin-row brin-item'
    if (this.checked(item)) el.classList.add('checked')
    if (idx === this.selectedIndex) el.classList.add('selected')
    item.render(el)

    el.querySelector('.panel-color')?.addEventListener('change', (e) => {
      item.color = e.target.value
      Brin.applyBadgeColor(el.querySelector('[data-property="badge"]'), item.color)
      void this.saveItems()
    })

    el.addEventListener('click', () => {
      if (this.editing) return
      const i = this.domItems.indexOf(el)
      if (i >= 0) this.selectItemAt(i)
    })

    return el
  }

  // ── Spécifique brins : badge auto + badge sur l'event ────────────

  onAfterStopEditing(item, prop) {
    if (prop === 'title' && !item.badge && item.title) {
      item.badge = Brin.generateBadge(item.title)
      const badgeEl = this.domItems[this.selectedIndex]?.querySelector('[data-property="badge"]')
      if (badgeEl) {
        badgeEl.textContent = item.badge
        Brin.applyBadgeColor(badgeEl, item.color)
      }
    }
  }

  // ── Réordonnancement ─────────────────────────────────────────────

  _syncIdsOnMove(currentIndex, targetIndex) {
    const movedId = this.brin_ids[currentIndex]
    this.brin_ids.splice(currentIndex, 1)
    this.brin_ids.splice(targetIndex, 0, movedId)
  }

  // ── Confirmation d'un nouveau brin ───────────────────────────────

  async commitNewItem(item, itemElement, insertionIndex) {
    this.lasts_id.brin += 1
    item.id = `b${this.lasts_id.brin}`
    item.badge = Brin.generateBadge(item.title)
    item.parentLister = this
    this.items.splice(insertionIndex, 0, item)
    this.brin_ids.splice(insertionIndex, 0, item.id)
    this.domItems.splice(insertionIndex, 0, itemElement)
    await this.saveItems()
    await this.save()
  }

  // ── Space : assigne le brin à l'event courant ─────────────────────

  toggleSelectedItemChecked() {
    const ev = this.selectedEvent
    if (!ev) return
    const brin = this.items[this.selectedIndex]
    if (!brin) return
    ev.brin_ids = ev.brin_ids ?? []
    const i = ev.brin_ids.indexOf(brin.id)
    if (i > -1) ev.brin_ids.splice(i, 1)
    else ev.brin_ids.push(brin.id)
    const isChecked = ev.brin_ids.includes(brin.id)
    this.domItems[this.selectedIndex]?.classList.toggle('checked', isChecked)
    this._updateEventBadges(ev)
    void this._saveEventBrinIds(ev)
  }

  _updateEventBadges(event) {
    const eventEl = this.eventLister.domItems[this.eventLister.selectedIndex]
    if (!eventEl) return
    let metaEl = eventEl.querySelector('.event-brins-badges')
    if (!metaEl) {
      metaEl = document.createElement('span')
      metaEl.className = 'event-brins-badges'
      eventEl.querySelector('.event-meta')?.appendChild(metaEl)
    }
    metaEl.innerHTML = ''
    ;(event.brin_ids ?? []).forEach(id => {
      const brin = this.items.find(b => b.id === id)
      if (!brin) return
      const badge = document.createElement('span')
      badge.className = 'badge brin'
      badge.textContent = brin.badge ?? ''
      Brin.applyBadgeColor(badge, brin.color)
      metaEl.appendChild(badge)
    })
  }

  async _saveEventBrinIds(event) {
    const response = await fetch(`/data/${this.contextPath}/__items.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: event.id, bi: event.brin_ids })
    })
    if (!response.ok) throw new Error(`Cannot save event brin_ids`)
  }

  // ── Persistance ───────────────────────────────────────────────────

  async saveItems() {
    const hash = {}
    this.items.forEach(item => { hash[item.id] = ItemDataMapper.toPersistence(item) })
    await fetch(`/data/${this.contextPath}/__brins.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hash)
    })
  }

  async save() {
    await fetch(`/data/${this.contextPath}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brin_ids: this.brin_ids, lasts_id: this.lasts_id })
    })
    this.eventLister.brin_ids = [...this.brin_ids]
    this.eventLister.lasts_id = { ...this.lasts_id }
  }

  close() {
    document.querySelector('#brin-panel').classList.add('hidden')
    document.querySelector('#brin-panel').innerHTML = ''
    const footer = document.querySelector('#shortcuts-footer')
    if (footer && this._previousFooterHTML !== undefined) footer.innerHTML = this._previousFooterHTML
    this.keyboardController.register(this.eventLister)
  }

}
