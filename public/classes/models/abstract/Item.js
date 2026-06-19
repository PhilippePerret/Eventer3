import ItemDom from './ItemDom.js'
import ItemRepo from './ItemRepo.js'
import ItemListener from './ItemListener.js'

export default class Item {

  constructor(data = {}) {
    this.id         = data.id         ?? null
    this.title      = data.title      ?? ''
    this.type       = data.type       ?? null
    this.state      = data.state      ?? null
    this.color      = data.color      ?? null
    this.lister_id  = data.lister_id  ?? null
    this.active     = data.active     ?? true
    this.checked    = data.checked    ?? false
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.project_id = data.project_id ?? null
    this.parentLister = data.parentLister ?? null
  }

  get Dom()      { return this._dom   || (this._dom   = new ItemDom(this)) }
  get Repo()     { return this._repo  || (this._repo  = new ItemRepo(this)) }
  get Listener() { return this._listen|| (this._listen= new ItemListener(this)) }
}