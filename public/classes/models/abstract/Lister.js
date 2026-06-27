import KeyDispatcher from './KeyDispatcher.js'
import LOG from '../../../system/LOG.js'
import { raise } from '../../../system/Error.js'
import ListerDom from '../dom/Lister.js'
import ListerRepo from '../repo/Lister.js'
import { ListerLi } from '../listen/Lister.js'
import Notification from '../../ui/Notification.js'
import ConfirmDialog from '../../ui/ConfirmDialog.js'

export default class Lister extends KeyDispatcher {

  constructor(data = {}) {
    super()
    this.id             = data.id            ?? null
    this.item_ids       = data.item_ids      ?? []
    this.items          = []
    this.selectedIndex  = data.selectedIndex ?? -1
    this.project        = data.project  || raise(1000)
    this.parentLister   = data.parentLister  ?? null
  }

  get minClass() { return this._minClass || (this._minClass = this.constructor.ITEM_CLASS?.name.toLowerCase()) }

  static LISTENERS = { ...ListerLi }

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
      const label     = cascadeCount === 1 ? 'évènement imbriqué' : 'évènements imbriqués'
      const confirmed = await ConfirmDialog.open({
        title:         item.title,
        message:       `Cette destruction entraînera la destruction en cascade de ${cascadeCount} ${label}. Tapez ${cascadeCount} pour confirmer.`,
        expectedValue: cascadeCount,
      })
      if (!confirmed) { this.focusSelected(); return }
    }
    const ok = await this.deleteItem(item)
    if (!ok) return
    const newIdx = Math.min(idx, this.items.length - 2)
    this.items.splice(idx, 1)
    this.item_ids.splice(idx, 1)
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
    this.render()
    this.items[this.selectedIndex]?.startEditing()
  }

  async createNew()       { await this._createAt(this.selectedIndex + 1) }
  async createNewBefore() { await this._createAt(this.selectedIndex)     }

  async _reloadAt(insertIdx) {
    await this.load()
    this.selectedIndex = insertIdx
    this.render()
  }

  leaveToParent() {
    this.container.classList.add('hidden')
    this.container.innerHTML = ''
    const parent = this.parentLister
    this.detach()
    parent.render()
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

  get contextItem() { return null }

  _canToggle(_item)          { return true }
  _afterToggle(_item, _ctx)  {}

  async load() {
    const rawData = await this._fetchData()
    if (!rawData) return
    this.items = this._instantiateItems(rawData)
    if (!this.item_ids.length) this.item_ids = this.items.map(item => item.id)
    if (this.items.length === 0) await this._initDefault?.()
    if (this.selectedIndex < 0 && this.items.length) this.selectedIndex = 0
    await this._afterLoad?.()
  }

  _instantiateItems(data) {
    const Cls = this.constructor.ITEM_CLASS
    const ids = this.item_ids.length ? this.item_ids : Object.keys(data)
    return ids
      .map((id, idx) => data[id] ? new Cls({ ...data[id], id, _index: idx, project: this.project }) : null)
      .filter(Boolean)
  }

  static async createLister(fields) {
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
