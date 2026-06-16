import Lister from './Lister.js'
import Event from './Event.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET } from '../../constants.js'
import BrinLister from './BrinLister.js'
import PersoLister from './PersoLister.js'
import StyleLister from './StyleLister.js'
import ListerRepository from '../repositories/ListerRepository.js'
import Notification from '../ui/Notification.js'
import StatusBar from '../ui/StatusBar.js'
import ContextualHelp from '../ui/ContextualHelp.js'
import NaturePanel from '../ui/NaturePanel.js'

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

  _childListerData(item) {
    return {
      ...super._childListerData(item),
      project_nature: this.project_nature,
      man_depth: this.man_depth,
    }
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
      { key: 'c', label: 'Consolider le niveau (⌘ + ⇧ + c)', action: () => void this.consolidateLevel() }
    ], this.keyboardController)
  }

  consolidateLevel() {
    if (StatusBar.displayMode !== 'LEVEL') return
    void this._consolidateLevel()
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
    this._updateMainPanelClass()
    StatusBar.update('events')
    void this._loadAndRenderPersoMarks()
    void this._applyEventStyles()
    if (this.keyboardController) {
      this.keyboardController.targetsManager.load(this.link_targets, this.parentItem?.id)
    }
    return result
  }

  _isManLister() {
    if (this.nature === 'man') return true
    if (this.nature === 'eventer') return false
    return this.man_depth != null && this.depth === this.man_depth
  }

  _updateMainPanelClass() {
    const panel = document.getElementById('main-panel')
    if (!panel) return
    panel.className = panel.className
      .split(' ')
      .filter(c => !/^(roman|film)(-man)?$/.test(c))
      .join(' ')
    if (!this.project_nature) return
    const isMan = this._isManLister()
    if (isMan) {
      panel.classList.add(`${this.project_nature}-man`)
    } else {
      panel.classList.add(this.project_nature)
    }
  }

  openNaturePanel() {
    if (!(this.project_id ?? this.project_item_id)) return
    new NaturePanel({ lister: this, keyboardController: this.keyboardController }).open()
  }

  _propagateProjectMetaToAncestors() {
    const fields = { project_nature: this.project_nature, man_depth: this.man_depth }
    let lister = this.parentItem?.parentLister
    while (lister) {
      if (fields.project_nature != null) lister.project_nature = fields.project_nature
      if (fields.man_depth != null)      lister.man_depth      = fields.man_depth
      lister = lister.parentItem?.parentLister
    }
  }

  async _applyEventStyles() {
    const styles = await StyleLister.loadStyles()
    this.items.forEach((ev, idx) => {
      if (Array.isArray(ev.css) && ev.css.length > 0) {
        StyleLister.applyToEventElement(ev, this.domItems[idx], styles)
      }
    })
  }

  leaveToParent() {
    if (StatusBar.displayMode === 'LEVEL') {
      StatusBar.resetToNesting()
      const selectedItem = this.items[this.selectedIndex]
      if (selectedItem?.id) {
        void this.navigateToItem(selectedItem.id)
      } else {
        this._getRootEventLister().render()
      }
      return
    }
    super.leaveToParent()
  }

  toggleDisplayMode() {
    const newMode = StatusBar.toggleDisplayMode()
    if (newMode === 'LEVEL') {
      void this._renderLevelMode()
    } else {
      const selectedItem = this.items[this.selectedIndex]
      if (selectedItem?.id) {
        StatusBar.suppressUpdates()
        void this.navigateToItem(selectedItem.id).then(() => {
          StatusBar.resumeUpdates()
          StatusBar.update('events')
        })
      } else {
        this._getRootEventLister().render()
      }
    }
    return newMode
  }

  async enterSelectedItem() {
    StatusBar.resetToNesting()
    return super.enterSelectedItem()
  }

  async navigateToItem(targetId) {
    const projectId = this.project_id ?? this.parentItem?.id
    const ancestors = await ListerRepository.fetchAncestors(projectId, targetId)
    if (ancestors === null) {
      Notification.show('Cible supprimée ou introuvable')
      return
    }

    const rootLister = this._getRootEventLister()
    rootLister.render()

    for (const ancestorId of ancestors) {
      const lister = this.keyboardController.activeLister
      const idx = lister.items.findIndex(item => item.id === ancestorId)
      if (idx >= 0) {
        lister.selectItemAt(idx)
        await lister.enterSelectedItem()
      }
    }

    const finalLister = this.keyboardController.activeLister
    const targetIdx = finalLister.items.findIndex(item => item.id === targetId)
    if (targetIdx >= 0) finalLister.selectItemAt(targetIdx)
  }

  _getRootEventLister() {
    let lister = this
    while (lister.parentItem && lister.parentItem.parentLister.depth > 0) {
      lister = lister.parentItem.parentLister
    }
    return lister
  }

  async _collectItemsAtDepth(lister, targetDepth, isManMode = false) {
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
        const sub = await this._collectItemsAtDepth(childLister, targetDepth, isManMode)
        results.push(...sub)
      } else {
        results.push({ item, isVirtual: !isManMode && !lister._isManLister(), gap })
      }
    }
    return results
  }

  async _renderLevelMode() {
    const token = {}
    this._levelRenderToken = token
    const prevSelectedId = this.items[this.selectedIndex]?.id
    const root = this._getRootEventLister()
    const isManMode = this._isManLister()
    const targetDepth = isManMode ? (this.man_depth ?? this.depth) : this.depth
    const collected = await this._collectItemsAtDepth(root, targetDepth, isManMode)
    if (this._levelRenderToken !== token) return

    const container = this.domContainer
    container.innerHTML = ''
    if (targetDepth != null) container.dataset.depth = String(targetDepth)

    const header = this.renderHeader()
    if (header) container.appendChild(header)

    this.domItems = []

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
    const restoredIdx = prevSelectedId ? this.items.findIndex(item => item.id === prevSelectedId) : -1
    this.selectedIndex = restoredIdx >= 0 ? restoredIdx : 0
    if (this.domItems.length > 0) {
      this.domItems[this.selectedIndex].classList.add('selected')
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
