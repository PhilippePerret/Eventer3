import Lister from '../abstract/Lister.js'
import Brin from './Brin.js'
import LOG from '../../../system/LOG.js'

export default class ListerBrin extends Lister {

  static ITEM_CLASS = Brin
  static PANEL_ID   = 'brins-panel'
  static pool = {}
  static LISTENERS  = { ...Lister.LISTENERS, ' ': { nokey: 'toggleChecked' } }

  constructor(data = {}) {
    super(data)
    this.listerEvent = data.listerEvent ?? null // C'EST QUOI, ÇA ????
    this.project_id  = data.project_id ?? this.listerEvent?.project_id ?? null
    this.id = this.project_id ? this.project_id + '-brins' : null
  }

  get selectedEvent() {
    const le = this.listerEvent
    return le?.items[le.selectedIndex] ?? null
  }

  async _fetchData() {
    if (this.listerEvent) return this.listerEvent.brins ?? {}
    return await super._fetchData()
  }

  _afterCreate(result) {
    if (this.listerEvent) this.listerEvent.brins[result.id] = result
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
    const brin = new Brin({ ...result, id: result.id, _index: 0 })
    this.items = [brin]
    if (this.listerEvent) this.listerEvent.brins = { [result.id]: result }
  }

  _syncChecked() {
    const brinIds = this.selectedEvent?.brin_ids ?? []
    this.items.forEach(b => { b.checked = brinIds.includes(b.id) })
  }

  async deleteSelected() {
    const brin = this.items[this.selectedIndex]
    const ev   = this.selectedEvent
    await super.deleteSelected()
    if (!brin || !ev) return
    ev.brin_ids = (ev.brin_ids ?? []).filter(id => id !== brin.id)
    this._refreshEventMarks(ev)
    await ev.save()
  }

  async deleteItem(item) {
    const query = this.project_id ? `?project_id=${this.project_id}` : ''
    const url = `/api/listers/${this.id}/items/${item.id}${query}`
    const resp = await fetch(url, { method: 'DELETE', cache: 'no-store' })
    return resp.ok
  }

  toggleChecked() {
    const brin = this.items[this.selectedIndex]
    const ev = this.selectedEvent
    if (!brin || !ev) return
    ev.brin_ids = ev.brin_ids ?? []
    const i = ev.brin_ids.indexOf(brin.id)
    if (i > -1) ev.brin_ids.splice(i, 1)
    else ev.brin_ids.push(brin.id)
    brin.checked = ev.brin_ids.includes(brin.id)
    brin.el?.classList.toggle('checked', brin.checked)
    this._refreshEventMarks(ev)
    ev.save()
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
