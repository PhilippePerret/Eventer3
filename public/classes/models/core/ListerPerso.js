import Lister from '../abstract/Lister.js'
import Perso from './Perso.js'
import { raise } from '../../../system/Error.js'

export default class ListerPerso extends Lister {

  static ITEM_CLASS = Perso
  static PANEL_ID   = 'persos-panel'
  static CHECK_KEY  = 'perso_ids'

  constructor(data = {}) {
    super(data)
    this.project = data.project ?? raise(3000)
    this.id = this.project.id + '-persos'
    this._contextItem = null // Brin ou Event
  }

  async openPanel(contextItem) {
    this._contextItem  = contextItem
    this._directIds    = new Set(contextItem.perso_ids ?? [])
    this._inheritedIds = new Set()
    // Event hérite des persos de ses brins ; un Brin n'a pas d'héritage.
    // direct ∩ brins = ∅ par invariant → pas de guard.
    if (contextItem.minClass === 'event') {
      const brins = this.project.itemsById['brins']
      for (const bid of (contextItem.brin_ids ?? [])) {
        brins[bid]?.perso_ids?.forEach(pid => this._inheritedIds.add(pid))
      }
    }
    if (!this.items.length) await this.load()
    this._syncChecked()
    contextItem.parentLister.detach()
    this.render()
  }

  
  async _afterLoad() {
    this._syncChecked()
  }

  /* ???
      _syncChecked(), detach lister appelant, render(). 
  //*/
  _syncChecked() {
    this.items.forEach(p => {
      const direct    = this._directIds.has(p.id)
      const inherited = !direct && this._inheritedIds.has(p.id)
      p.checked   = direct || inherited
      p.inherited = inherited
    })
  }


  get contextItem() { return this._contextItem }

  _canToggle(item) { return !item.inherited }

  _afterToggle(_perso, ctx) {
    ctx.refreshPersosMarks()
  }


}
