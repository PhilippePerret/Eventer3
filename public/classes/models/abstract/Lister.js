import ListerDom from './ListerDom.js'
import ListerRepo from './ListerRepo.js'
import ListerListener from './ListerListener.js'

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
}