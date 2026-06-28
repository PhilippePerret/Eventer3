import Lister from '../abstract/Lister.js'
import Brin from './Brin.js'
import LOG from '../../../system/LOG.js'
import { raise } from '../../../system/Error.js'

export default class ListerBrin extends Lister {

  static ITEM_CLASS = Brin
  static PANEL_ID   = 'brins-panel'
  static CHECK_KEY  = 'brin_ids'
  static pool = {}

  constructor(data = {}) {
    super(data)
    this.project      = data.project || raise(2000)
    this.id           = this.project.id + '-brins'
    this._contextItem = null // Event (depuis lequel on ouvre)
  }

  get contextItem() { return this._contextItem }

  async openPanel(contextItem) {
    this._contextItem = contextItem
    if (!this.items.length) await this.load()
    this._syncChecked()
    contextItem.parentLister.detach()
    this.render()
  }

  closePanel() {
    const ctx = this._contextItem
    this.container.classList.add('hidden')
    this.container.innerHTML = ''
    this.detach()
    ctx.parentLister.render()
    ctx.refreshBrinsMarks?.()   // ← point 5 (refresh à la fermeture)
  }

  _afterCreate(result) {
    ListerBrin.pool[result.id] = result
  }

  async _afterLoad() {
    ListerBrin.pool = Object.fromEntries(this.items.map(b => [b.id, b]))
    this._syncChecked()
  }
  async _initDefault() { await this._initDefaultBrin() }

  async _initDefaultBrin() {
    const result = await this.createItem({ title: 'Intrigue principale', badge: 'IP' })
    LOG.m(1, 'ListerBrin._initDefaultBrin', { id: result?.id, title: result?.title, badge: result?.badge })
    if (!result?.id) return
    this.item_ids = [result.id]
    await this.save()
    const brin = new Brin({ ...result, id: result.id, _index: 0, project: this.project })
    this.items = [brin]
  }

  _syncChecked() {
    const brinIds = this.contextItem?.brin_ids ?? []
    this.items.forEach(b => { b.checked = brinIds.includes(b.id) })
  }

  async deleteSelected() {
    const brin = this.items[this.contextItem]
    const ctx   = this.contextItem
    await super.deleteSelected()
    if (!brin || !ctx) return
    ctx.brin_ids = (ctx.brin_ids ?? []).filter(id => id !== brin.id)
    this._refreshEventMarks(ev)
    await ctx.save()
  }

  async deleteItem(item) {
    const query = `?project_id=${this.project.id}`
    const url = `/api/listers/${this.id}/items/${item.id}${query}`
    const resp = await fetch(url, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  }

  _refreshEventMarks(ev) {
    const marksEl = ev.el?.querySelector('.event-brins-marks')
    if (!marksEl) return
    const brins = this.listerEvent?.brins ?? {}
    marksEl.innerHTML = (ev.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-mark"${style}>${b.badge ?? '?'}</span>`
    }).join('')
  }

}
