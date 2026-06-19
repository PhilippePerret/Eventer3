import ItemDom from './ItemDom.js'
import ItemRepo from './ItemRepo.js'
import ItemListener from './ItemListener.js'

export default class Item {
  get Dom(){return this._dom || (this._dom = new ItemDom(this))}
  get Repo(){return this._repo || (this._repo = new ItemRepo(this))}
  get Listener(){return this._listen || (this._listen = new ItemListener(this))}
}