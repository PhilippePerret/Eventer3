import Lister from '../abstract/Lister.js'
import Perso from './Perso.js'

export default class ListerPerso extends Lister {

  static ITEM_CLASS = Perso
  static PANEL_ID   = 'persos-panel'
  static pool = {}

  constructor(data = {}) {
    super(data)
    this.project_id = data.project_id ?? null
    this.id = this.project_id ? this.project_id + '-persos' : null
  }

  async _afterLoad() {
    ListerPerso.pool = Object.fromEntries(this.items.map(p => [p.id, p]))
  }

}
