import Lister from '../abstract/Lister.js'
import ListerRepo from '../abstract/ListerRepo.js'
import Event from './Event.js'

class EventListerRepo extends ListerRepo {
  async load() {
    await super.load()
    const pid = this.lister.project_id
    if (!pid) return
    const q = `?project_id=${pid}`
    const data = await fetch(`/api/listers/${pid}-brins/items${q}`, { cache: 'no-store' }).then(r => r.json())
    this.lister.brins = data ?? {}
  }
}

export default class EventLister extends Lister {
  static ITEM_CLASS  = Event
  static CHILD_CLASS = EventLister
  static TYPE        = 'events'

  get Repo() { return this._repo || (this._repo = new EventListerRepo(this)) }
}
