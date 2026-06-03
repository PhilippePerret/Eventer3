import Lister from './Lister.js'
import Brin from './Brin.js'
import ListerRepository from '../repositories/ListerRepository.js'
import FooterHelp from '../ui/FooterHelp.js'

export default class BrinLister extends Lister {

  static async open(eventLister) {
    const brinLister = new BrinLister({ eventLister, keyboardController: eventLister.keyboardController })
    if (!brinLister.id) {
      await BrinLister.init(eventLister)
      brinLister.id = eventLister.brins_lister_id
    }
    await ListerRepository.loadDefinition(brinLister)
    await brinLister.loadItems()
    brinLister.render()
  }

  static async init(eventLister) {
    const newLister = await ListerRepository.createLister({
      type: 'brins',
      parent_item_id: eventLister.parentItem.id
    })
    eventLister.brins_lister_id = newLister.id
    const projectBrinIds = eventLister.parentItem.brin_ids ?? []
    if (projectBrinIds.length === 0) {
      const badge = Brin.generateBadge('Intrigue principale')
      const color = Brin.colorFor(1)
      await ListerRepository.createItem(newLister.id, {
        title: 'Intrigue principale',
        type: 'brin',
        badge,
        color
      })
    }
  }

  constructor({ eventLister, keyboardController }) {
    super({ type: 'brins', item_ids: [], keyboardController })
    this.eventLister = eventLister
    this.id = eventLister.brins_lister_id ?? null
    this.itemClass = Brin
  }

  get uiModes() { return ['listerRoot', 'modalPanel'] }

  get selectedEvent() { return this.eventLister.items[this.eventLister.selectedIndex] }

  async loadItems() {
    await super.loadItems()
    this.items.forEach((brin, idx) => {
      if (!brin.badge) brin.badge = Brin.generateBadge(brin.title)
      if (!brin.color) brin.color = Brin.colorFor(idx + 1)
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

    FooterHelp.update(this.uiModes)

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

  // ── Spécifique brins : badge auto sur l'event ─────────────────────

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

  // ── Confirmation d'un nouveau brin ───────────────────────────────

  async commitNewItem(item, itemElement, insertionIndex) {
    item.badge = Brin.generateBadge(item.title)
    item.color = Brin.colorFor(this.items.length + 1)
    const payload = { title: item.title, type: item.type, badge: item.badge, color: item.color }
    const created = await ListerRepository.createItem(this.id, payload)
    item.id = created.id
    item.parentLister = this
    this.items.splice(insertionIndex, 0, item)
    this.item_ids.splice(insertionIndex, 0, item.id)
    const properEl = this._createItemElement(item, insertionIndex)
    itemElement.replaceWith(properEl)
    this.domItems.splice(insertionIndex, 0, properEl)
    await ListerRepository.save(this)
  }

  // ── Space : assigne le brin à l'event courant ─────────────────────

  _performToggleChecked(brin) {
    const ev = this.selectedEvent
    if (!ev) return false
    ev.brin_ids = ev.brin_ids ?? []
    const i = ev.brin_ids.indexOf(brin.id)
    if (i > -1) ev.brin_ids.splice(i, 1)
    else ev.brin_ids.push(brin.id)
    this._updateEventBadges(ev)
    return ev.brin_ids.includes(brin.id)
  }

  async _saveAfterToggle(brin) {
    const ev = this.selectedEvent
    if (ev) await this._saveEventBrinIds(ev)
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
    await ListerRepository.saveItem(event, { brin_ids: event.brin_ids })
  }

  close() {
    document.querySelector('#brin-panel').classList.add('hidden')
    document.querySelector('#brin-panel').innerHTML = ''
    FooterHelp.update(this.eventLister.uiModes)
    this.keyboardController.register(this.eventLister)
  }

}
