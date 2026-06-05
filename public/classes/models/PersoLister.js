import Lister from './Lister.js'
import Perso from './Perso.js'
import ListerRepository from '../repositories/ListerRepository.js'
import FooterHelp from '../ui/FooterHelp.js'

export default class PersoLister extends Lister {

  static async open(parentLister) {
    const isFromBrin = Boolean(parentLister.eventLister)
    const eventLister = isFromBrin ? parentLister.eventLister : parentLister

    let inheritedPersoIds = new Set()
    if (!isFromBrin) {
      const event = eventLister.items[eventLister.selectedIndex]
      inheritedPersoIds = await PersoLister._loadInheritedPersoIds(event, eventLister)
    }

    const persoLister = new PersoLister({
      parentLister,
      keyboardController: parentLister.keyboardController,
      inheritedPersoIds,
      isFromBrin
    })
    persoLister.id = eventLister.persos_lister_id ?? `${eventLister.parentItem?.id}-persos`
    await ListerRepository.loadDefinition(persoLister)
    await persoLister.loadItems()
    if (persoLister.items.length === 0) {
      const badge = Perso.generateUniqueBadge('Votre protagoniste', [])
      const created = await ListerRepository.createItem(persoLister.id, { title: 'Votre protagoniste', badge })
      persoLister.item_ids.push(created.id)
      await persoLister.loadItems()
    }
    persoLister.render()
  }

  static async _loadInheritedPersoIds(event, eventLister) {
    if (!event?.brin_ids?.length) return new Set()
    const brinsListerId = eventLister.brins_lister_id
    if (!brinsListerId) return new Set()
    const itemsData = await ListerRepository.loadItems({ id: brinsListerId })
    const inherited = new Set()
    event.brin_ids.forEach(brinId => {
      const d = itemsData[brinId]
      if (!d) return
      const ids = d.brin_perso_ids ?? d.perso_ids ?? []
      if (Array.isArray(ids)) ids.forEach(pid => inherited.add(pid))
    })
    return inherited
  }

  constructor({ parentLister, keyboardController, inheritedPersoIds = new Set(), isFromBrin = false }) {
    super({ type: 'persos', item_ids: [], keyboardController })
    this.parentLister = parentLister
    this._isFromBrin = isFromBrin
    this._inheritedPersoIds = inheritedPersoIds
    this.itemClass = Perso
  }

  get uiModes() { return ['listerRoot', 'modalPanel'] }

  get contextItem() {
    return this.parentLister.items[this.parentLister.selectedIndex]
  }

  checked(perso) {
    const item = this.contextItem
    if (!item) return false
    const direct = Array.isArray(item.perso_ids) && item.perso_ids.includes(perso.id)
    return direct || this._inheritedPersoIds.has(perso.id)
  }

  inherited(perso) {
    if (this._isFromBrin) return false
    const item = this.contextItem
    if (!item) return false
    const direct = Array.isArray(item.perso_ids) && item.perso_ids.includes(perso.id)
    return !direct && this._inheritedPersoIds.has(perso.id)
  }

  // ── Rendu ──────────────────────────────────────────────────────────

  render() {
    const panel = document.querySelector('#perso-panel')
    panel.innerHTML = ''
    panel.classList.remove('hidden')

    const card = document.createElement('div')
    card.className = 'perso-panel__inner'
    panel.appendChild(card)

    const header = document.createElement('div')
    header.className = 'panel-header'
    const titleEl = document.createElement('span')
    titleEl.className = 'panel-title'
    titleEl.textContent = `Personnages · ${this.contextItem?.title ?? ''}`
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
    this._updateContextMarks()
  }

  _createItemElement(item, idx) {
    const el = document.createElement('div')
    el.className = 'panel-row perso-row perso-item'
    if (this.checked(item)) el.classList.add('checked')
    if (this.inherited(item)) el.classList.add('inherited')
    if (idx === this.selectedIndex) el.classList.add('selected')
    item.render(el)

    el.addEventListener('click', () => {
      if (this.editing) return
      const i = this.domItems.indexOf(el)
      if (i >= 0) this.selectItemAt(i)
    })

    return el
  }

  // ── Toggle ─────────────────────────────────────────────────────────

  _performToggleChecked(perso) {
    if (this.inherited(perso)) return this.checked(perso)
    const item = this.contextItem
    if (!item) return false
    item.perso_ids = item.perso_ids ?? []
    const i = item.perso_ids.indexOf(perso.id)
    if (i > -1) item.perso_ids.splice(i, 1)
    else item.perso_ids.push(perso.id)
    const el = this.domItems[this.selectedIndex]
    if (el) el.classList.toggle('inherited', this.inherited(perso))
    this._updateContextMarks()
    return item.perso_ids.includes(perso.id)
  }

  async _saveAfterToggle(perso) {
    const item = this.contextItem
    if (item) await ListerRepository.saveItem(item, { perso_ids: item.perso_ids })
  }

  // ── Marks sur la ligne du contexte ────────────────────────────────

  _updateContextMarks() {
    const parentLister = this.parentLister
    const contextEl = parentLister.domItems[parentLister.selectedIndex]
    if (!contextEl) return

    const marksClass = this._isFromBrin ? 'brin-persos-marks' : 'event-persos-marks'
    let marksEl = contextEl.querySelector(`.${marksClass}`)
    if (!marksEl) {
      marksEl = document.createElement('span')
      marksEl.className = marksClass
      const container = this._isFromBrin
        ? (contextEl.querySelector('.panel-persos') ?? contextEl)
        : (contextEl.querySelector('.event-meta') ?? contextEl)
      container.appendChild(marksEl)
    }
    marksEl.innerHTML = ''

    const item = this.contextItem
    const allIds = this._isFromBrin
      ? (item?.perso_ids ?? [])
      : [...new Set([...(item?.perso_ids ?? []), ...this._inheritedPersoIds])]

    allIds.forEach(id => {
      const perso = this.items.find(p => p.id === id)
      if (!perso) return
      const mark = document.createElement('span')
      mark.className = 'perso-mark'
      mark.textContent = perso.avatar ?? perso.badge ?? '--'
      marksEl.appendChild(mark)
    })
  }

  // ── Édition ────────────────────────────────────────────────────────

  editSelectedItem() {
    const item = this.items[this.selectedIndex]
    const el = this.domItems[this.selectedIndex]
    if (!item || !el) return
    item._usedAvatars = this.items.filter(p => p.id !== item.id && p.avatar).map(p => p.avatar)
    item.render(el)
    super.editSelectedItem()
  }

  onAfterStopEditing(item, prop) {
    if (prop === 'title' && !item.badge && item.title) {
      const existingBadges = this.items.filter(p => p.id !== item.id).map(p => p.badge).filter(Boolean)
      item.badge = Perso.generateUniqueBadge(item.title, existingBadges)
      const badgeEl = this.domItems[this.selectedIndex]?.querySelector('[data-property="badge"]')
      if (badgeEl) badgeEl.textContent = item.badge
    }
  }

  // ── Création ───────────────────────────────────────────────────────

  async commitNewItem(item, itemElement, insertionIndex) {
    const existingBadges = this.items.map(p => p.badge).filter(Boolean)
    item.badge = Perso.generateUniqueBadge(item.title, existingBadges)
    const payload = { title: item.title, badge: item.badge }
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

  // ── Fermeture ──────────────────────────────────────────────────────

  close() {
    const panel = document.querySelector('#perso-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    FooterHelp.update(this.parentLister.uiModes)
    this.keyboardController.register(this.parentLister)
  }

}
