import BaseListener from './BaseListener.js'
import ListerDom from '../dom/Lister.js'
import ListerRepo from '../repo/Lister.js'
import { ListerLi } from '../listen/Lister.js'
import Notification from '../../ui/Notification.js'
import ConfirmDialog from '../../ui/ConfirmDialog.js'

export default class Lister extends BaseListener {

  constructor(data = {}) {
    super()
    this.id            = data.id            ?? null
    this.item_ids      = data.item_ids      ?? []
    this.items         = []
    this.selectedIndex = data.selectedIndex ?? -1
    this.project_id    = data.project_id    ?? null
    this.parentLister  = data.parentLister  ?? null
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
    const prevIds = [...this.item_ids]
    const result = await this.createItem({ title: '' })
    if (!result?.id) { this.focusSelected(); return }
    const newOrder = [...prevIds]
    newOrder.splice(insertIdx, 0, result.id)
    this.item_ids = newOrder
    await this.save()
    await this._reloadAt(insertIdx)
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
    const parent = this.parentLister
    this.detach()
    parent.render()
    parent.attach(parent.container)
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

  static async createLister(fields) {
    const resp = await fetch('/api/listers', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(fields),
    })
    if (!resp.ok) throw new Error(`Impossible de créer le lister`)
    return await resp.json()
  }

}

Object.assign(Lister.prototype, ListerDom)
Object.assign(Lister.prototype, ListerRepo)
