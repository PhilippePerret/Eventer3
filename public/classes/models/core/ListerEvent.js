import Lister from '../abstract/Lister.js'
import Event from './Event.js'

export default class ListerEvent extends Lister {
  static ITEM_CLASS  = Event
  static CHILD_CLASS = ListerEvent
  static TYPE        = 'events'
  static PANEL_ID    = 'events-panel'

  constructor(data = {}) {
    super(data)
    this.project = data.project ?? null
  }

  async _afterLoad() {
    const pid = this.project.id
    if (!pid) return
    const q = `?project_id=${pid}`
    const data = await fetch(`/api/listers/${pid}-brins/items${q}`, { cache: 'no-store' }).then(r => r.json())
    this.brins = data ?? {}
  }
}
