import Lister from './Lister.js'
import Event from './Event.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET } from '../../constants.js'
import BrinLister from './BrinLister.js'
import PersoLister from './PersoLister.js'
import StyleLister from './StyleLister.js'
import ListerRepository from '../repositories/ListerRepository.js'
import StatusBar from '../ui/StatusBar.js'
import ContextualHelp from '../ui/ContextualHelp.js'

export default class EventLister extends Lister {

  constructor(data = {}) {
    super({ type: 'events', ...data })
    this.itemClass = Event
  }

  get uiModes() { return ['listerRoot', 'eventsRoot'] }

  get filterWidgets() {
    return [
      { type: 'text',  field: 'title', placeholder: 'Filtrer…' },
      { type: 'menu',  field: 'state',  label: 'état',   values: EVENT_STATE.map(s => ({ value: String(s.value), label: s.label })) },
      { type: 'menu',  field: 'meteo',  label: 'météo',  values: Object.entries(EVENT_METEO).map(([k, v]) => ({ value: k, label: v.trim() })) },
      { type: 'menu',  field: 'effet',  label: 'effet',  values: Object.entries(EVENT_EFFET).map(([k, v]) => ({ value: k, label: v })) },
    ]
  }

  get childListerClass() {
    return EventLister
  }

  _updateCheckVisual(el, isChecked) {
    const checkEl = el.querySelector('.event-check')
    if (checkEl) checkEl.textContent = isChecked ? '✓' : ''
  }

  async _saveAfterToggle(item) {
    await ListerRepository.saveItem(item, { checked: item.checked })
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    const wasVirtual = this.__isVirtual
    await super.commitNewItem(item, itemElement, insertionIndex)
    if (wasVirtual && this.depth === 1) await BrinLister.init(this)
  }

  openToolsPanel() {
    if (StatusBar.displayMode !== 'LEVEL') return
    this.keyboardController.toolsPanel.open([
      { key: 'c', label: 'Consolider le niveau courant', action: () => void this._consolidateLevel() }
    ], this.keyboardController)
  }

  async _consolidateLevel() {
    this._levelRenderToken = {}
    const root = this._getRootEventLister()
    const collected = await this._collectItemsAtDepth(root, this.depth)
    for (const entry of collected) {
      if (entry.isVirtual) {
        entry.item = await this._createEventsForGap(entry.item, entry.gap)
        entry.isVirtual = false
      }
    }
    const container = this.domContainer
    container.innerHTML = ''
    if (this.depth != null) container.dataset.depth = String(this.depth)
    const header = this.renderHeader()
    if (header) container.appendChild(header)
    this.domItems = []
    this.selectedIndex = 0
    for (const { item } of collected) {
      const itemElement = item.createElement()
      if (typeof item.render === 'function') item.render(itemElement)
      this.domItems.push(itemElement)
      container.appendChild(itemElement)
    }
    this.items = collected.map(e => e.item)
    if (this.domItems.length > 0) this.domItems[0].classList.add('selected')
    if (this.keyboardController) this.keyboardController.register(this)
  }

  async _createEventsForGap(item, gap) {
    const projectId = this.project_id
    let currentItemId = item.id
    let lastCreated = null
    for (let i = 1; i <= gap; i++) {
      const listerData = await ListerRepository.createLister({ type: 'events', parent_item_id: currentItemId, project_id: projectId })
      if (i === 1) item.lister_id = listerData.id
      const created = await ListerRepository.createItem(listerData.id, { title: `${item.title} +${i}` }, { project_id: projectId })
      currentItemId = created.id
      lastCreated = created
    }
    return new Event({ ...lastCreated })
  }

  async openBrinPanel() {
    await BrinLister.open(this)
  }

  async openPersoPanel() {
    await PersoLister.open(this)
  }

  async openStylePanel(options = {}) {
    await StyleLister.open(this, options)
  }

  render() {
    ContextualHelp.resetContext('event-list')
    const result = super.render()
    StatusBar.update('events')
    void this._loadAndRenderPersoMarks()
    void this._applyEventStyles()
    if (this.keyboardController) {
      this.keyboardController.targets = this.link_targets ? [...this.link_targets] : []
    }
    return result
  }

  async _applyEventStyles() {
    const styles = await StyleLister.loadStyles()
    this.items.forEach((ev, idx) => {
      if (Array.isArray(ev.css) && ev.css.length > 0) {
        StyleLister.applyToEventElement(ev, this.domItems[idx], styles)
      }
    })
  }

  toggleDisplayMode() {
    const newMode = StatusBar.toggleDisplayMode()
    if (newMode === 'LEVEL') {
      void this._renderLevelMode()
    } else {
      this.render()
    }
    return newMode
  }

  async enterSelectedItem() {
    StatusBar.resetToNesting()
    return super.enterSelectedItem()
  }

  _getRootEventLister() {
    let lister = this
    while (lister.parentItem && lister.parentItem.parentLister.depth > 0) {
      lister = lister.parentItem.parentLister
    }
    return lister
  }

  async _collectItemsAtDepth(lister, targetDepth) {
    if (lister.depth === targetDepth) {
      return lister.items.map(item => ({ item, isVirtual: false }))
    }
    const gap = targetDepth - lister.depth
    const results = []
    for (const item of lister.items) {
      if (item.lister_id != null) {
        const childLister = new EventLister({ id: item.lister_id, parentItem: item, project_id: this.project_id })
        childLister.depth = lister.depth + 1
        await childLister.loadDefinition()
        await childLister.loadItems()
        const sub = await this._collectItemsAtDepth(childLister, targetDepth)
        results.push(...sub)
      } else {
        results.push({ item, isVirtual: true, gap })
      }
    }
    return results
  }

  async _renderLevelMode() {
    const token = {}
    this._levelRenderToken = token
    const root = this._getRootEventLister()
    const collected = await this._collectItemsAtDepth(root, this.depth)
    if (this._levelRenderToken !== token) return

    const container = this.domContainer
    container.innerHTML = ''
    if (this.depth != null) container.dataset.depth = String(this.depth)

    const header = this.renderHeader()
    if (header) container.appendChild(header)

    this.domItems = []
    this.selectedIndex = 0

    for (const { item, isVirtual, gap } of collected) {
      if (isVirtual) {
        const el = document.createElement('div')
        el.className = 'event-item virtual'
        el.textContent = `${item.title} +${gap}`
        container.appendChild(el)
      } else {
        const itemElement = item.createElement()
        if (typeof item.render === 'function') item.render(itemElement)
        this.domItems.push(itemElement)
        container.appendChild(itemElement)
      }
    }

    this.items = collected.filter(e => !e.isVirtual).map(e => e.item)
    if (this.domItems.length > 0) {
      this.domItems[0].classList.add('selected')
    }

    if (this.keyboardController) this.keyboardController.register(this)
  }

  async _loadAndRenderPersoMarks() {
    const projectId = this.project_id ?? this.parentItem?.id
    if (!projectId) return

    const [brinsData, persoData] = await Promise.all([
      ListerRepository.loadItems({ id: `${projectId}-brins` }),
      ListerRepository.loadItems({ id: `${projectId}-persos` })
    ])

    const persoMarks = {}
    Object.entries(persoData).forEach(([id, data]) => {
      persoMarks[id] = data.avatar ?? data.badge ?? '--'
    })

    this.items.forEach((event, idx) => {
      const el = this.domItems[idx]
      if (!el) return

      const brinsEl = el.querySelector('.event-brins-badges')
      if (brinsEl) {
        brinsEl.innerHTML = ''
        ;(event.brin_ids ?? []).forEach(brinId => {
          const brin = brinsData[brinId]
          if (!brin) return
          const span = document.createElement('span')
          span.className = 'panel-badge'
          span.textContent = brin.badge ?? '?'
          if (brin.color) span.style.background = brin.color
          brinsEl.appendChild(span)
        })
      }

      const marksEl = el.querySelector('.event-persos-marks')
      if (!marksEl) return
      marksEl.innerHTML = ''
      const allPersoIds = new Set(event.perso_ids ?? [])
      ;(event.brin_ids ?? []).forEach(brinId => {
        const brin = brinsData[brinId]
        if (!brin) return
        ;(brin.brin_perso_ids ?? brin.perso_ids ?? []).forEach(pid => allPersoIds.add(pid))
      })
      allPersoIds.forEach(id => {
        const mark = persoMarks[id]
        if (!mark) return
        const span = document.createElement('span')
        span.className = 'perso-mark'
        span.textContent = mark
        marksEl.appendChild(span)
      })
    })
  }

  renderHeader() {
    if (!this.parentItem) return null
    const nav = document.createElement('nav')
    nav.className = 'eventer-breadcrumbs'
    const btn = document.createElement('button')
    btn.className = 'breadcrumb-item'
    btn.textContent = this.parentItem.title
    btn.addEventListener('click', () => this.leaveToParent())
    const sep = document.createElement('span')
    sep.className = 'breadcrumb-separator'
    sep.textContent = '‹'
    nav.appendChild(btn)
    nav.appendChild(sep)
    return nav
  }

}
