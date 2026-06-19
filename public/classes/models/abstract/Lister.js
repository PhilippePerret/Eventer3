import ListerDom from './ListerDom'
import ListerRepo from './ListerRepo'
import ListerListener from './ListerListener'

export default class Lister {

  get Dom(){return this._dom || (this._dom = new ListerDom(this))}
  get Repo(){return this._repo || (this._repo = new ListerRepo(this))}
  get Repo(){return this._listen || (this._listen = new ListerListener(this))}
}