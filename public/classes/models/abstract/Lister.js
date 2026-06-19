import ListerDom from './ListerDom.js'
import ListerRepo from './ListerRepo.js'
import ListerListener from './ListerListener.js'

export default class Lister {

  get Dom(){return this._dom || (this._dom = new ListerDom(this))}
  get Repo(){return this._repo || (this._repo = new ListerRepo(this))}
  get Listener(){return this._listen || (this._listen = new ListerListener(this))}
}