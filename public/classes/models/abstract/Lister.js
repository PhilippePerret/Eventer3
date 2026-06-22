import ListerDom from './ListerDom.js'
import ListerRepo from './ListerRepo.js'
import ListerListener from './ListerListener.js'
import Notification from '../../ui/Notification.js'

export default class Lister {

  constructor(data = {}) {
    this.id            = data.id            ?? null
    this.item_ids      = data.item_ids      ?? []
    this.items         = []
    this.selectedIndex = data.selectedIndex ?? 0
  }

  get Dom()      { return this._dom   || (this._dom   = new ListerDom(this)) }
  get Repo()     { return this._repo  || (this._repo  = new ListerRepo(this)) }
  get Listener() { return this._listen|| (this._listen= new ListerListener(this)) }

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
    const idx     = this.selectedIndex
    const item    = this.items[idx]
    const ok      = await this.Repo.deleteItem(item)
    if (!ok) return
    const newIdx  = Math.min(idx, this.items.length - 2)
    const next    = this.items[newIdx === idx ? newIdx : newIdx]
    this.items.splice(idx, 1)
    this.item_ids.splice(idx, 1)
    this.selectedIndex = newIdx
    this.Dom.removeEl(item)
    this.Dom.applySelection(null, this.items[newIdx])
  }

  selectPrev() {
    const items = this.items
    let idx = this.selectedIndex - 1
    while (idx >= 0 && items[idx].filtered) idx--
    if (idx >= 0) this.selectAt(idx)
  }

  selectNext() {
    const items = this.items
    let idx = this.selectedIndex + 1
    while (idx < items.length && items[idx].filtered) idx++
    if (idx < items.length) this.selectAt(idx)
  }

}