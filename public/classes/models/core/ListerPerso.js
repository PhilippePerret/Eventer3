import Lister from '../abstract/Lister.js'
import Perso from './Perso.js'

export default class ListerPerso extends Lister {

  static ITEM_CLASS = Perso
  static PANEL_ID   = 'persos-panel'
  static CHECK_KEY  = 'perso_ids'
  static pool = {}

  constructor(data = {}) {
    super(data)
    this.project_id    = data.project_id   ?? null
    this._directIds    = data.directIds    ?? new Set()
    this._inheritedIds = data.inheritedIds ?? new Set()
    this._contextEvent = data.contextEvent ?? null
    this._contextBrin  = data.contextBrin  ?? null
    this._listerEvent  = data.listerEvent  ?? null
    this.id = this.project_id ? this.project_id + '-persos' : null
  }

  async _afterLoad() {
    ListerPerso.pool = Object.fromEntries(this.items.map(p => [p.id, p]))
    this._syncChecked()
  }

  get contextItem() { return this._contextEvent }

  _canToggle(item) { return !item.inherited }

  _afterToggle(_perso, ctx) {
    if (this._contextBrin) return
    const el = ctx.el?.querySelector('.event-persos-marks')
    if (!el) return
    const tmp = document.createElement('template')
    tmp.innerHTML = ctx.persosMarks()
    el.replaceWith(tmp.content.firstChild)
  }

  _syncChecked() {
    this.items.forEach(p => {
      const direct    = this._directIds.has(p.id)
      const inherited = !direct && this._inheritedIds.has(p.id)
      p.checked   = direct || inherited
      p.inherited = inherited
    })
  }

}
