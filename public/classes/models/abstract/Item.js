import BaseListener from './BaseListener.js'
import ItemDom from '../dom/Item.js'
import ItemRepo from '../repo/Item.js'
import { ItemLi } from '../listen/Item.js'
import { stopEvent } from '../../utils/events.js'
import Lister from './Lister.js'
import LOG from '../../../system/LOG.js'
import Notification from '../../ui/Notification.js'

export default class Item extends BaseListener {

  constructor(data = {}) {
    super()
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

  onkeydown(ev) {
    if (this.editing && !this.constructor.LISTENERS[ev.key]) return stopEvent(ev)
    super.onkeydown(ev)
  }

  static LISTENERS = { ...ItemLi }

  async enterChildren() {
    if (!this.parentLister) return
    const ChildClass = this.parentLister.constructor.CHILD_CLASS
    if (!ChildClass) return
    const project_id = this.project_id ?? this.parentLister?.project_id ?? this.id
    const child = new ChildClass({
      id:           this.lister_id ?? this.id,
      project_id,
      parentLister: this.parentLister,
    })
    await child.load()
    if (child._missing) {
      const result   = await Lister.createLister({ type: `${child.minClass}s`, parent_item_id: this.id, project_id })
      child.id       = result.id
      child._missing = false
      await this.onChildListerCreated?.(child)
      await child.load()
    }
    this.parentLister.detach()
    child.render()
    child.attach(child.container)
    if (child.items.length === 0) await child.createNew()
  }

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
    this.focusNextField()
  }

  _warnIfEmptyTitle() {
    if (!this.title.trim()) {
      const wf = this.constructor.thingName
      Notification.show(`Il faut définir le texte ${wf.of}${wf.thing}`)
      return true
    }
    return false
  }

  applyEdit() {
    LOG.m(1, 'Item.applyEdit', { id: this.id })
    try {
      this.collectValues()
      LOG.m(1, 'Item.applyEdit — collectValues OK')
      if (this._warnIfEmptyTitle()) return
      this.save()
      this._stopEditing()
    } catch(e) {
      LOG.m(1, 'Item.applyEdit — ERREUR', e.message, e.stack)
    }
  }

  cancelEdit() {
    LOG.m(2, 'Item.cancelEdit', { parentLister: !!this.parentLister, itemsLength: this.parentLister?.items.length, title: JSON.stringify(this.title) })
    if (this.parentLister?.items.length <= 1) {
      LOG.m(2, 'Item.cancelEdit — seul item, blocage')
      this._warnIfEmptyTitle()
      return
    }
    this.revertValues()
    this._stopEditing()
  }

}

Object.assign(Item.prototype, ItemDom)
Object.assign(Item.prototype, ItemRepo)
