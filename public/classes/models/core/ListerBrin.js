import Lister from '../abstract/Lister.js'
import Brin from './Brin.js'
import LOG from '../../../system/LOG.js'
import { raise } from '../../../system/Error.js'

export default class ListerBrin extends Lister {

  static ITEM_CLASS = Brin
  static PANEL_ID   = 'brins-panel'
  static CHECK_KEY  = 'brin_ids'
  static LISTENERS  = { ...Lister.LISTENERS, b: { nokey: 'closePanel' } }

  constructor(data = {}) {
    super(data)
    this.project      = data.project || raise(2000)
    this.id           = this.project.id + '-brins'
    this._contextItem = null // Event depuis lequel on a ouvert le panneau
  }

  get contextItem() { return this._contextItem }

  _applyContext(contextItem) {
    this._listerEvent   = contextItem.parentLister
    this._modifiedBrins = {}
  }

  markForCheck(brin) {
    if (this._modifiedBrins[brin.id]) return
    this._modifiedBrins[brin.id] = { brin, initialData: { color: brin.color, perso_ids: [...(brin.perso_ids ?? [])] } }
  }

  onPanelClosed() {
    const changed = {}
    Object.values(this._modifiedBrins).forEach(({ brin, initialData }) => {
      const colorChanged  = brin.color !== initialData.color
      const persosChanged = [...(brin.perso_ids ?? [])].sort().join(',') !== [...(initialData.perso_ids)].sort().join(',')
      if (colorChanged || persosChanged) {
        changed[brin.id] = { hasChanged: { color: colorChanged, persos: persosChanged }, brin }
      }
    })
    this._listerEvent.refreshEventMarks(changed)
  }

  async _initDefault() { await this._initDefaultBrin() }

  async _initDefaultBrin() {
    const result = await this.createItem({ title: 'Intrigue principale', badge: 'IP' })
    LOG.m(1, 'ListerBrin._initDefaultBrin', { id: result?.id, title: result?.title, badge: result?.badge })
    if (!result?.id) return
    this.item_ids = [result.id]
    await this.save()
    const brin = new Brin({ ...result, id: result.id, badge: result.badge ?? 'IP', _index: 0, project: this.project, parentLister: this })
    this.items = [brin]
  }

  _syncChecked() {
    const brinIds = this.contextItem?.brin_ids ?? []
    this.items.forEach(b => { b.checked = brinIds.includes(b.id); b.applyChecked() })
  }

  async deleteSelected() {
    const brin = this.items[this.selectedIndex]
    const ctx  = this.contextItem
    LOG.m(4, 'ListerBrin.deleteSelected', { brin: brin?.id, ctx: ctx?.id, brin_ids: ctx?.brin_ids })
    await super.deleteSelected()
    if (!brin || !ctx) { LOG.m(4, 'ListerBrin.deleteSelected ABORT', { brin: !!brin, ctx: !!ctx }); return }
    ctx.brin_ids = (ctx.brin_ids ?? []).filter(id => id !== brin.id)
    this._refreshEventMarks(ctx)
    LOG.m(4, 'ListerBrin.deleteSelected BEFORE save', { brin_ids: ctx.brin_ids })
    await ctx.save()
    LOG.m(4, 'ListerBrin.deleteSelected AFTER save')
  }

  async deleteItem(item) {
    const query = `?project_id=${this.project.id}`
    const url = `/api/listers/${this.id}/items/${item.id}${query}`
    const resp = await fetch(url, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  }

  // Brins : rafraîchissement DIRECT au toggle sur l'event concerné uniquement (1 event = pas de goulot)
  _afterToggle(brin, ev) {
    if (brin.checked) {
      const pids = brin.perso_ids ?? []
      if (pids.length) ev.perso_ids = (ev.perso_ids ?? []).filter(id => !pids.includes(id))
    }
    this._refreshEventMarks(ev)
    ev.refreshPersosMarks()
  }

  _refreshEventMarks(ev) {
    const marksEl = ev.el?.querySelector('.event-brins-marks')
    if (!marksEl) return
    const brins = this.byId
    marksEl.innerHTML = (ev.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-mark"${style}>${b.badge ?? '?'}</span>`
    }).join('')
  }

}
