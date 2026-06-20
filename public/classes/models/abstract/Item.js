import ItemDom from './ItemDom.js'
import ItemRepo from './ItemRepo.js'
import ItemListener from './ItemListener.js'
import LOG from '../../../system/LOG.js'

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
    this.editing = false
  }

  get Dom()      { return this._dom   || (this._dom   = new ItemDom(this)) }
  get Repo()     { return this._repo  || (this._repo  = new ItemRepo(this)) }
  get Listener() { return this._listen|| (this._listen= new ItemListener(this)) }

  onEnter() {
    LOG.m(1, 'Item.onEnter', { id: this.id, editing: this.editing })
    if (this.editing) this.applyEdit()
    else this.startEditing()
  }

  onEscape() {
    if (!this.editing) return false
    this.cancelEdit()
  }

  onTab() {
    if (!this.editing) return false
    this.Dom.focusNextField()
  }

  startEditing() {
    LOG.m(1, 'Item.startEditing', { id: this.id })
    this.editing = true
    this.Dom.startEditing()
  }

  applyEdit() {
    LOG.m(1, 'Item.applyEdit', { id: this.id })
    try {
      this.Dom.collectValues()
      LOG.m(1, 'Item.applyEdit — collectValues OK')
      this.Repo.save()
      this._stopEditing()
    } catch(e) {
      LOG.m(1, 'Item.applyEdit — ERREUR', e.message, e.stack)
    }
  }

  cancelEdit() {
    this.Dom.revertValues()
    this._stopEditing()
  }

  _stopEditing() {
    LOG.m(1, 'Item._stopEditing', { id: this.id })
    this.editing = false
    this.Dom.stopEditing()
    LOG.m(1, 'Item._stopEditing DONE')
  }

}