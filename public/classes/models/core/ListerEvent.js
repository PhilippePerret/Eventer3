import Lister from '../abstract/Lister.js'
import { ListerEventLi } from '../listen/Event.js'
import Event from './Event.js'
import StatusBar from '../../ui/StatusBar.js'
import NaturePanel from '../../ui/NaturePanel.js'
import LOG from '../../../system/LOG.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET } from '../constants/Event.js'

export default class ListerEvent extends Lister {
  static ITEM_CLASS  = Event
  static CHILD_CLASS = ListerEvent
  static LISTENERS   = ListerEventLi
  static TYPE        = 'events'
  static PANEL_ID    = 'events-panel'

  constructor(data = {}) {
    super(data)
    this.project       = data.project   ?? null
    this.depth         = data.depth     ?? 1
    this.man_depth     = data.man_depth ?? null
    this.nature        = data.nature    ?? null
    this._levelEntries = []
  }

  display(contextItem) {
    StatusBar.resetToNesting()
    super.display(contextItem)
    this._updateMainPanelClass()
  }

  selectNext() {
    if (StatusBar.displayMode === 'LEVEL') {
      const idx = this.selectedIndex + 1
      if (idx >= this.items.length) return
      this.selectAt(idx)
    } else {
      super.selectNext()
    }
  }

  selectPrev() {
    if (StatusBar.displayMode === 'LEVEL') {
      const idx = this.selectedIndex - 1
      if (idx < 0) return
      this.selectAt(idx)
    } else {
      super.selectPrev()
    }
  }

  async toggleDisplayMode() {
    if (StatusBar.displayMode !== 'LEVEL') {
      StatusBar.setDisplayMode('LEVEL')
      await this._renderLevelMode()
    } else {
      this._exitLevelMode()
    }
  }

  openNaturePanel() {
    new NaturePanel({ target: this }).open()
  }

  _filterMenuWidgets() {
    return [
      { field: 'state', label: 'État',  options: EVENT_STATE },
      { field: 'meteo', label: 'Météo', options: Object.entries(EVENT_METEO).map(([value, label]) => ({ value, label })) },
      { field: 'effet', label: 'Effet', options: Object.entries(EVENT_EFFET).map(([value, label]) => ({ value, label })) },
      { field: 'brins', label: 'Brins', live: false, loader: async () => {
          const { default: ListerBrin } = await import('./ListerBrin.js')
          const lb = new ListerBrin({ project: this.project })
          await lb.load()
          return lb.items.map(b => ({ value: String(b.id), label: b.title, badge: b.badge, color: b.color }))
        }
      },
    ]
  }

  _filterMatches(item, field, values) {
    if (field === 'brins') return values.some(id => item.brin_ids?.includes(id) || item.brin_ids?.includes(Number(id)))
    return super._filterMatches(item, field, values)
  }

  getTools() {
    const tools = []
    if (StatusBar.displayMode === 'LEVEL') {
      tools.push({ key: 'c', label: 'Consolider le niveau (⌘ + ⇧ + c)', action: () => this.consolidateLevel() })
    }
    tools.push({ key: 'e', label: 'Exporter…',  action: () => {} })
    tools.push({ key: 'i', label: 'Importer…',  action: () => {} })
    return tools
  }

  consolidateLevel() {
    if (StatusBar.displayMode !== 'LEVEL') return
    void this._consolidateLevel()
  }

  async _consolidateLevel() {
    this._levelRenderToken = {}
    const root      = this._getRootEventLister()
    const collected = await this._collectItemsAtDepth(root, this.depth, null, this._isManLister())
    for (const entry of collected) {
      if (entry.isVirtual) {
        entry.item      = await this._createEventsForGap(entry.item, entry.gap, entry.parentLister)
        entry.isVirtual = false
      }
    }
    void this._renderLevelMode()
  }

  async _createEventsForGap(item, gap, parentLister) {
    let currentItemId = item.id
    let lastData      = null
    for (let i = 1; i <= gap; i++) {
      const listerData = await Lister.createLister({ type: 'events', itemId: currentItemId, project: this.project })
      if (i === 1) item.lister_id = listerData.id
      const tmpLister = new ListerEvent({ id: listerData.id, project: this.project })
      lastData        = await tmpLister.createItem({ title: `${item.title} +${i}` })
      currentItemId   = lastData.id
    }
    return new Event({ ...lastData, parentLister })
  }

  _updateMainPanelClass() {
    if (!this.container) return
    this.container.classList.remove('roman-man', 'film-man')
    const projectNature = this.project?.nature ?? this.project_nature ?? null
    if (this._isManLister() && projectNature)
      this.container.classList.add(`${projectNature}-man`)
  }

  leaveToParent() {
    if (StatusBar.displayMode === 'LEVEL') {
      this._exitLevelMode()
      return
    }
    super.leaveToParent()
  }

  _isManLister() {
    if (this.nature === 'man') return true
    const manDepth = this.man_depth ?? this.project?.man_depth ?? null
    return manDepth != null && this.depth === manDepth
  }

  _exitLevelMode() {
    StatusBar.resetToNesting()
    const entry = this._levelEntries[this.selectedIndex]
    if (!entry) {
      const root = this._getRootEventLister()
      root.build()
      root.activate()
      return
    }
    const { item, parentLister } = entry
    parentLister.selectedIndex = parentLister.items.findIndex(i => i.id === item.id)
    parentLister.build()
    parentLister.activate()
  }

  _getRootEventLister() {
    let lister = this
    while (lister.parentLister instanceof ListerEvent) {
      lister = lister.parentLister
    }
    return lister
  }

  async navigateToItem(targetId) {
    const projectId = this.project.id
    const resp = await fetch(`/api/items/${targetId}/ancestors?project_id=${projectId}`, { cache: 'no-store' })
    if (!resp.ok) return false
    const { ancestors = [] } = await resp.json()

    let currentLister = this._getRootEventLister()
    for (const ancestorId of ancestors) {
      const idx = currentLister.items.findIndex(item => item.id === ancestorId)
      if (idx < 0) return
      currentLister.selectedIndex = idx
      const ancestorItem = currentLister.items[idx]
      currentLister = await ancestorItem._initNewLister(ListerEvent, ancestorItem.lister_id)
    }

    const targetIdx = currentLister.items.findIndex(item => item.id === targetId)
    if (targetIdx >= 0) currentLister.selectedIndex = targetIdx
    currentLister.build()
    currentLister.display(null)
  }

  async _collectItemsAtDepth(lister, targetDepth, currentDepth, isManMode) {
    const cd = currentDepth ?? lister.depth
    if (cd === targetDepth) {
      return lister.items.map(item => ({ item, parentLister: lister, isVirtual: false }))
    }
    const results = []
    for (const item of lister.items) {
      if (item.lister_id != null) {
        const childLister = new ListerEvent({
          id:           item.lister_id,
          project:      lister.project ?? this.project,
          parentLister: lister,
          depth:        cd + 1,
        })
        await childLister.load()
        const sub = await this._collectItemsAtDepth(childLister, targetDepth, cd + 1, isManMode)
        results.push(...sub)
      } else {
        results.push({ item, parentLister: lister, isVirtual: !isManMode, gap: targetDepth - cd })
      }
    }
    return results
  }

  async _renderLevelMode() {
    const token = {}
    this._levelRenderToken = token

    const selectedItemId = this.items[this.selectedIndex]?.id

    const isManMode   = this._isManLister()
    const targetDepth = isManMode ? (this.man_depth ?? this.depth) : this.depth
    const root        = this._getRootEventLister()
    const collected   = await this._collectItemsAtDepth(root, targetDepth, null, isManMode)
    if (this._levelRenderToken !== token) return

    const panel = this._ensurePanelStructure(this.container)
    const body  = panel.querySelector('.lister-panel__body')
    body.innerHTML = ''

    const realItems = []
    const entries   = []

    for (const { item, parentLister, isVirtual, gap } of collected) {
      if (isVirtual) {
        const el = document.createElement('div')
        el.className   = 'event-item virtual'
        el.dataset.id  = item.id
        el.textContent = `+${gap} ${item.title}`
        body.appendChild(el)
      } else {
        item.parentLister = parentLister
        const el = item.build()
        el.classList.remove('selected')
        body.appendChild(el)
        realItems.push(item)
        entries.push({ item, parentLister })
      }
    }

    this.items         = realItems
    this._levelEntries = entries

    const selIdx   = selectedItemId != null ? realItems.findIndex(i => i.id === selectedItemId) : -1
    const startIdx = selIdx >= 0 ? selIdx : 0
    this.selectedIndex = startIdx
    this.attach(this.container)
    if (realItems.length > 0) this.applySelection(null, realItems[startIdx])
  }

  refreshEventMarks(modifiedBrins) {
    this.items.forEach(ev => {
      (ev.brin_ids ?? []).forEach(bid => {
        const mb = modifiedBrins[bid]
        if (!mb) return
        if (mb.hasChanged.color)  ev.refreshColor?.()
        if (mb.hasChanged.persos) ev.refreshPersosMarks()
      })
    })
  }
}
