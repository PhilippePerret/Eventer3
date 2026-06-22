import ListerDom from './ListerDom.js'
import ListerRepo from './ListerRepo.js'
import ListerListener from './ListerListener.js'
import Notification from '../../ui/Notification.js'
import ConfirmDialog from '../../ui/ConfirmDialog.js'

export default class Lister {

  constructor(data = {}) {
    this.id            = data.id            ?? null
    this.item_ids      = data.item_ids      ?? []
    this.items         = []
    this.selectedIndex = data.selectedIndex ?? 0
    this.project_id    = data.project_id    ?? null
    this.parentLister  = data.parentLister  ?? null
  }

  get Dom()      { return this._dom      || (this._dom      = new ListerDom(this)) }
  get Repo()     { return this._repo     || (this._repo     = new ListerRepo(this)) }
  get Listener() { return this._listen   || (this._listen   = new ListerListener(this)) }
  get minClass() { return this._minClass || (this._minClass = this.constructor.ITEM_CLASS?.name.toLowerCase()) }

  selectAt(idx) {
    const current = this.items[this.selectedIndex]
    this.selectedIndex = idx
    this.Dom.applySelection(current, this.items[idx])
  }

  async deleteSelected() {
    if (this.items.length <= 1) {
      Notification.show('Impossible de supprimer le dernier élément.')
      return
    }
    const idx          = this.selectedIndex
    const item         = this.items[idx]
    const cascadeCount = await this.Repo.countDescendants(item)
    if (cascadeCount > 0) {
      const label     = cascadeCount === 1 ? 'évènement imbriqué' : 'évènements imbriqués'
      const confirmed = await ConfirmDialog.open({
        title:         item.title,
        message:       `Cette destruction entraînera la destruction en cascade de ${cascadeCount} ${label}. Tapez ${cascadeCount} pour confirmer.`,
        expectedValue: cascadeCount,
      })
      if (!confirmed) { this.Dom.focusSelected(); return }
    }
    const ok = await this.Repo.deleteItem(item)
    if (!ok) return
    const newIdx = Math.min(idx, this.items.length - 2)
    this.items.splice(idx, 1)
    this.item_ids.splice(idx, 1)
    this.selectedIndex = newIdx
    this.Dom.removeEl(item)
    this.Dom.applySelection(null, this.items[newIdx])
  }

  async createNew() {
    const result = await ListerRepo.createItem(this.id, { title: '' }, { project_id: this.project_id })
    if (!result?.id) { this.Dom.focusSelected(); return }
    await this.Repo.load()
    const idx = this.item_ids.indexOf(result.id)
    this.selectedIndex = idx >= 0 ? idx : 0
    this.Dom.render()
    this.items[this.selectedIndex]?.startEditing()
  }

  async _reloadAt(insertIdx) {
    await this.Repo.load()
    this.selectedIndex = insertIdx
    this.Dom.render()
  }

  leaveToParent() {
    const parent = this.parentLister
    this.Listener.detach()
    parent.Dom.render()
    parent.Listener.attach(parent.Dom.container)
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

}