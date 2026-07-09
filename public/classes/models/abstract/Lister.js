import KeyDispatcher from './KeyDispatcher.js'
import LOG from '../../../system/LOG.js'
import { raise, getErr } from '../../../system/Error.js'
import { stopEvent } from '../../utils/events.js'
import ListerDom from '../dom/Lister.js'
import Texte from '../../../system/Texte.js'
import ListerRepo from '../repo/Lister.js'
import { ListerLi } from '../listen/Lister.js'
import Notification from '../../ui/Notification.js'
import ConfirmDialog from '../../ui/ConfirmDialog.js'
import { Clipboard } from './Clipboard.js'
import { movePanel, movablePanelInner } from '../../utils/panelMove.js'
import PopupSelect from '../../ui/PopupSelect.js'
import StatusBar from '../../ui/StatusBar.js'

export default class Lister extends KeyDispatcher {

  constructor(data = {}) {
    super()
    this.project        = data.project        || raise(1000)
    this.id             = data.id             ?? null
    this.item_ids       = data.item_ids       ?? []
    this.items          = []
    this.byId           = {}   // table { id → item }, tenue à jour par la base
    this.selectedIndex  = data.selectedIndex  ?? -1
    this.parentLister   = data.parentLister   ?? null
    this.depth          = data.depth          ?? null
  }

  get minClass() { return this._minClass || (this._minClass = this.constructor.ITEM_CLASS?.name.toLowerCase()) }

  static LISTENERS = { ...ListerLi }

  _filterMenuWidgets() { return [] }

  openFilterBar() {
    const existing = this.container?.querySelector('.filter-bar')
    if (existing && !existing.classList.contains('hidden')) {
      existing.classList.add('hidden')
      this._activeFilters = {}
      this._applyAllFilters()
      StatusBar.setFilterState('none')
      return
    }
    let bar = this.container?.querySelector('.filter-bar')
    if (!bar) {
      bar = document.createElement('div')
      bar.className = 'filter-bar hidden'

      const titleWidget = document.createElement('div')
      titleWidget.className = 'filter-widget'
      titleWidget.dataset.field = 'title'
      const input = document.createElement('input')
      input.type = 'text'
      input.className = 'panel-search'
      input.placeholder = 'Filtrer par titre…'
      titleWidget.appendChild(input)
      bar.appendChild(titleWidget)
      input.addEventListener('input', () => this._applyTitleFilter(input.value.trim().toLowerCase()))

      this._filterMenuWidgets().forEach(({ field, label, options, loader, live }) => {
        const w = document.createElement('div')
        w.className = 'filter-widget'
        w.dataset.field = field
        const btn = document.createElement('button')
        btn.className = 'filter-widget__btn'
        btn.textContent = label
        const isLive = live !== false
        new PopupSelect({
          options:     options ?? [],
          loadOptions: loader ?? null,
          onEmpty:     loader ? () => Notification.show('Aucun brin à filtrer pour ce projet') : null,
          multi: true,
          onSelect: isLive ? () => btn.focus() : (vals) => { this._applyMenuFilter(field, vals); btn.focus() },
          onCancel: () => btn.focus(),
          onChange: isLive ? (vals) => this._applyMenuFilter(field, vals) : null,
        }).attachAnchor(btn)
        w.appendChild(btn)
        bar.appendChild(w)
      })

      bar.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return
        stopEvent(e)
        const focusables = [...bar.querySelectorAll('.panel-search, .filter-widget__btn')]
        const idx = focusables.indexOf(document.activeElement)
        focusables[(idx + 1) % focusables.length]?.focus()
      })

      this.container?.querySelector('.lister-panel')?.prepend(bar)
    }
    bar.classList.remove('hidden')
    bar.querySelector('.panel-search')?.focus()
    StatusBar.setFilterState('mode')
  }

  _applyTitleFilter(query) {
    if (!this._activeFilters) this._activeFilters = {}
    this._activeFilters.title = query || null
    this._applyAllFilters()
  }

  _applyMenuFilter(field, values) {
    if (!this._activeFilters) this._activeFilters = {}
    this._activeFilters[field] = values?.length ? values.map(String) : null
    this._applyAllFilters()
  }

  _filterMatches(item, field, values) {
    return values.includes(String(item[field]))
  }

  _applyAllFilters() {
    const filters = this._activeFilters ?? {}
    let anyHidden = false
    this.items.forEach(item => {
      const hidden = Object.entries(filters).some(([field, val]) => {
        if (!val) return false
        if (field === 'title') return !item.title?.toLowerCase().includes(val)
        return !this._filterMatches(item, field, val)
      })
      item.filtered = hidden
      item.el?.classList.toggle('hidden', hidden)
      if (hidden) anyHidden = true
    })
    StatusBar.setFilterState(anyHidden ? 'active' : 'mode')
  }

  _resetFilterBar() {
    const bar = this.container?.querySelector('.filter-bar')
    if (!bar || bar.classList.contains('hidden')) return
    bar.classList.add('hidden')
    const search = bar.querySelector('.panel-search')
    if (search) search.value = ''
    this._activeFilters = {}
    this._applyAllFilters()
  }

  movePanelDown()  { movePanel(movablePanelInner(this.container), 'ArrowDown')  }
  movePanelUp()    { movePanel(movablePanelInner(this.container), 'ArrowUp')    }
  movePanelLeft()  { movePanel(movablePanelInner(this.container), 'ArrowLeft')  }
  movePanelRight() { movePanel(movablePanelInner(this.container), 'ArrowRight') }

  selectAt(idx) {
    const current = this.items[this.selectedIndex]
    this.selectedIndex = idx
    this.applySelection(current, this.items[idx])
  }

  async deleteSelected() {
    if (this.items.length <= 1) {
      Notification.show('Impossible de supprimer le dernier élément.')
      return
    }
    const idx          = this.selectedIndex
    const item         = this.items[idx]
    const cascadeCount = await this.countDescendants(item)
    if (cascadeCount > 0) {
      const label = cascadeCount === 1 ? 'évènement imbriqué' : 'évènements imbriqués'
      new ConfirmDialog({
        title:         'Destruction de ' + item.title,
        message:       `Cette destruction entraînera la destruction en cascade de ${cascadeCount} ${label}. Tapez ${cascadeCount} pour confirmer.`,
        expectedValue: cascadeCount,
        buttons: [
          { label: 'Confirmer', type: '', action: async () => { await this._doDeleteItem(item, idx) } },
          { label: 'Annuler', type: 'cancel', action: () => { this.focusSelected() } },
        ],
      }).open()
      return
    }
    await this._doDeleteItem(item, idx)
  }

  async _doDeleteItem(item, idx) {
    const ok = await this.deleteItem(item)
    if (!ok) return
    const newIdx = Math.min(idx, this.items.length - 2)
    this.items.splice(idx, 1)
    this.item_ids.splice(idx, 1)
    delete this.byId[item.id]
    this.selectedIndex = newIdx
    this.removeEl(item)
    this.applySelection(null, this.items[newIdx])
  }

  async _createAt(insertIdx) {
    const Cls      = this.constructor.ITEM_CLASS
    const tempItem = new Cls({ title: '', lister_id: this.id, project: this.project, parentLister: this })
    tempItem.__isTemporary = true
    this.items.splice(insertIdx, 0, tempItem)
    this.selectedIndex = insertIdx
    this.build()
    this.activate()
    this.items[this.selectedIndex]?.startEditing()
  }

  async createNew()       { await this._createAt(this.selectedIndex + 1) }
  async createNewBefore() { await this._createAt(this.selectedIndex)     }

  moveDown() { this._moveItem(1)  }
  moveUp()   { this._moveItem(-1) }

  _moveItem(direction) {
    const from = this.selectedIndex
    if (from < 0) return
    let to = from + direction
    while (to >= 0 && to < this.items.length && this.items[to].filtered) to += direction
    if (to < 0 || to >= this.items.length) return
    const movedItem = this.items[from]
    const targetEl  = this.items[to].el
    this.items.splice(from, 1)
    this.items.splice(to, 0, movedItem)
    if (direction > 0) targetEl.after(movedItem.el)
    else               targetEl.before(movedItem.el)
    this.selectedIndex = to
    this._syncIdsOnMove(from, to)
    movedItem.focus()
    void this.save()
  }

  backgroundNext() { this._switchBackground(1)  }
  backgroundPrev() { this._switchBackground(-1) }
  _switchBackground(d) {
    const l = this._listerEvent
    if (!l) return
    d > 0 ? l.selectNext() : l.selectPrev()
    this.display(l.items[l.selectedIndex])
  }

  _syncIdsOnMove(from, to) {
    const movedId = this.item_ids[from]
    this.item_ids.splice(from, 1)
    this.item_ids.splice(to, 0, movedId)
  }

  copySelectedItem() {
    this.items[this.selectedIndex]?.toClipboardData(true)
  }

  async cutSelectedItem() {
    if (this.items.length <= 1) {
      const thing = this.constructor.ITEM_CLASS.thingName.thing
      Notification.show(`Impossible de couper le dernier ${thing}.`)
      return
    }
    const idx  = this.selectedIndex
    const item = this.items[idx]
    item.toClipboardData(false)
    const ok = await this.deleteItem(item)
    if (!ok) return
    const newIdx = Math.min(idx, this.items.length - 2)
    this.items.splice(idx, 1)
    this.item_ids.splice(idx, 1)
    delete this.byId[item.id]
    this.selectedIndex = newIdx
    this.removeEl(item)
    this.applySelection(null, this.items[newIdx])
  }

  checkDataConflicts(data) {
    const resolved = { ...data }
    delete resolved.id
    if (!resolved.badge || !this.existingBadges?.has(resolved.badge)) return Promise.resolve(resolved)
    return new Promise(resolve => {
      new ConfirmDialog({
        title:   resolved.title,
        message: `Le badge "${resolved.badge}" existe déjà. Continuer en régénérant le badge ?`,
        buttons: [
          { label: 'Confirmer', type: '', action: () => { delete resolved.badge; resolve(resolved) } },
          { label: 'Annuler', type: 'cancel', action: () => resolve(null) },
        ],
      }).open()
    })
  }

  async pasteItem() {
    const clip = Clipboard.get()
    if (!clip || !Clipboard.isCompatible(this.minClass)) return
    const insertIdx = this.selectedIndex
    const payload   = clip.isCopy
      ? await this.checkDataConflicts(clip.data)
      : { ...clip.data }
    if (!payload) return
    payload.lister_id = this.id
    const result = await this.createItem(payload)
    if (!result?.id) return
    const newOrder = [...this.item_ids]
    newOrder.splice(insertIdx, 0, result.id)
    this.item_ids = newOrder
    await this.save()
    await this._reloadAt(insertIdx)
  }

  async _reloadAt(insertIdx) {
    await this.load()
    this.selectedIndex = insertIdx
    this.build()
    this.activate()
  }

  leaveToParent() {
    this.hideContainer()
    this.parentLister.build()
    this.parentLister.activate()
  }

  selectPrev() {
    const items = this.items
    let idx = this.selectedIndex - 1
    if (idx < 0) idx = items.length - 1
    while (idx > 0 && items[idx].filtered) idx--
    this.selectAt(idx)
  }

  selectNext() {
    const items = this.items
    let idx = this.selectedIndex + 1
    if (idx >= items.length) idx = 0
    while (idx < items.length - 1 && items[idx].filtered) idx++
    this.selectAt(idx)
  }

  outOfTargetLink() { Notification.show(getErr(5200)) }

  get contextItem() { return null }

  display(contextItem) {
    this._contextItem = contextItem
    this._applyContext(contextItem)
    this._updatePanelTitle()
    this._syncChecked()
    this._resetFilterBar()
    this.activate()
  }

  _applyContext(_contextItem) {}
  _syncChecked() {}

  _panelTitle()       { return this._contextItem?.title ?? null }
  _updatePanelTitle() {
    const t      = this._panelTitle()
    if (t == null) return
    const titleEl = this.container?.querySelector('.panel-title')
    if (titleEl) titleEl.innerHTML = Texte.render(t)
  }

  closePanel() {
    this.hideContainer()
    this.contextItem.focus()
    this.onPanelClosed()
  }

  onPanelClosed() {}

  _canToggle(_item)          { return true }
  _afterToggle(_item, _ctx)  {}
  _afterCreate(result)       { if (result?.id) this.byId[result.id] = result }

  async load() {
    const rawData = await this._fetchData()
    if (!rawData) return
    this.items = this._instantiateItems(rawData)
    if (!this.item_ids.length) this.item_ids = this.items.map(item => item.id)
    if (this.items.length === 0) await this._initDefault?.()
    if (this.selectedIndex < 0 && this.items.length) this.selectedIndex = 0
    this.byId = Object.fromEntries(this.items.map(i => [i.id, i]))
    await this._afterLoad?.()
  }

  _instantiateItems(data) {
    const Cls = this.constructor.ITEM_CLASS
    const ids = this.item_ids.length ? this.item_ids : Object.keys(data)
    return ids
      .map((id, idx) => data[id] ? new Cls({ ...data[id], id, _index: idx, project: this.project, parentLister: this }) : null)
      .filter(Boolean)
  }

  static async createLister({ project, ...fields }) {
    if (project?.id) fields.project_id = project.id
    const resp = await fetch('/api/listers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer le lister`)
    return await resp.json()
  }

  /** Pour ListerBrin et ListerPerso (pour le moment) */
  get existingBadges(){
    return this._extbdgs || ( this._extbdgs = this.getExistingBadges() )
  }
  getExistingBadges(){
    const bdgs = this.items
      .filter(b => b.id !== this.id)
      .map(b => b.badge)
      .filter(Boolean)
    return new Set(bdgs)
  }

}

Object.assign(Lister.prototype, ListerDom)
Object.assign(Lister.prototype, ListerRepo)
