import KeyDispatcher from './KeyDispatcher.js'
import ItemDom from '../dom/Item.js'
import { raise, getErr } from '../../../system/Error.js'
import ItemRepo from '../repo/Item.js'
import { ItemLi } from '../listen/Item.js'
import { stopEvent } from '../../utils/events.js'
import Lister from './Lister.js'
import LOG from '../../../system/LOG.js'
import Notification from '../../ui/Notification.js'
import { DEFAULT_COLOR } from '../constants/common.js'
import ContextualHelp from '../../ui/ContextualHelp.js'

export default class Item extends KeyDispatcher {

  constructor(data = {}) {
    super()

    this.project    = data.project    ?? null
    this.id         = data.id         ?? null
    this.title      = data.title      ?? raise(10)
    this.type       = data.type       ?? null
    this.state      = data.state      ?? null
    this.color      = data.color      ?? (DEFAULT_COLOR[this.constructor.name.toLowerCase()] ?? null)
    this.lister_id  = data.lister_id  ?? null
    this.active     = data.active     ?? true
    this.checked    = data.checked    ?? false
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.parentLister = data.parentLister ?? null
    this.editing = false
    if (data._index !== undefined) this.customInit(data._index)
  }

  onkeydown(ev) {
    if (this.editing) {
      if (document.activeElement?.isContentEditable) {
        if (ev.key !== 'Tab' && ev.key !== 'Enter' && ev.key !== 'Escape' && ev.key !== 'ArrowLeft') { ev.stopPropagation(); return }
      } else if (!this.constructor.LISTENERS[ev.key]) {
        return stopEvent(ev)
      }
    }
    super.onkeydown(ev)
  }

  static LISTENERS = { ...ItemLi }

  async enterInside() {
    if (!this.parentLister) return
    const ChildClass = this.parentLister.constructor.CHILD_CLASS
    if (!ChildClass) return
    await this._enterChildLister(ChildClass, this.lister_id)
  }

  /* Partagé avec Project (qui possède son propre enterInside) */
  async _initNewLister(ChildClass, childId) {
    const childLister = new ChildClass({ id: childId, project: this.project, parentLister: this.parentLister })
    if (childId) await childLister.load()
    if (!childId || childLister._missing) {
      const result         = await Lister.createLister({ type: `${childLister.minClass}s`, itemId: this.id, project: this.project })
      childLister.id       = result.id
      childLister._missing = false
      this.lister_id       = result.id
      await childLister.load()
    }
    return childLister
  }

  async _enterChildLister(ChildClass, childId) {
    const childLister = await this._initNewLister(ChildClass, childId)
    await this.onChildListerCreated?.(childLister)
    childLister.selectedIndex = 0
    this.parentLister.hide()
    childLister.build()
    childLister.display(this)
    if (childLister.items.length === 0) await childLister.createNew()
  }

  onEnter(ev) {
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

  checkBadgeValue(el, field) {
    const badgeField = field ?? this.PROPS.find(f => f.name === 'badge')
    const val = el.textContent?.trim()
    if (val === badgeField._curvalue) return
    if (!val) {
      const taken = this.parentLister.existingBadges
      taken.delete(badgeField._curvalue ?? this.badge)
      const newBadge = this.constructor.generateUniqueBadge(this)
      this.badge = newBadge
      el.textContent = newBadge
      return
    }
    if (this.parentLister.existingBadges.has(val)) {
      Notification.show(getErr(this.minClass === 'perso' ? 3010 : 2010, val))
      el.textContent = badgeField._curvalue
    }
  }

  openContextualHelp() { ContextualHelp.open(this) }

  _warnIfEmptyTitle() {
    if (!this.title.trim()) {
      const wf = this.constructor.thingName
      Notification.show(`Il faut définir le texte ${wf.of}${wf.thing}`)
      return true
    }
    return false
  }

  async applyEdit() {
    LOG.m(1, 'Item.applyEdit', { id: this.id, isTemporary: !!this.__isTemporary })
    try {
      this.collectValues()
      LOG.m(1, 'Item.applyEdit — collectValues OK')
      if (this._warnIfEmptyTitle()) return
      if (this.__isTemporary) {
        await this._commitTemporary()
      } else {
        this.save()
      }
      this._stopEditing()
    } catch(e) {
      LOG.m(1, 'Item.applyEdit — ERREUR', e.message, e.stack)
    }
  }

  async _commitTemporary() {
    const payload = {}
    for (const field of (this.PROPS ?? [])) payload[field.name] = this[field.name]
    const result = await this.parentLister.createItem(payload)
    if (!result?.id) throw new Error('_commitTemporary: pas d\'id retourné')
    this.id = result.id
    this.__isTemporary = false
    const insertIdx = this.parentLister.items.indexOf(this)
    const newOrder  = [...this.parentLister.item_ids]
    newOrder.splice(insertIdx, 0, result.id)
    this.parentLister.item_ids = newOrder
    await this.parentLister.save()
    await this.parentLister._afterCreate?.(result, insertIdx)
  }

  cancelEdit() {
    LOG.m(2, 'Item.cancelEdit', { parentLister: !!this.parentLister, itemsLength: this.parentLister?.items.length, title: JSON.stringify(this.title) })
    if (this.__isTemporary) {
      const idx = this.parentLister.items.indexOf(this)
      if (idx >= 0) this.parentLister.items.splice(idx, 1)
      this.parentLister.selectedIndex = Math.max(0, idx - 1)
      this.parentLister.build()
      this.parentLister.activate()
      return
    }
    if (this.parentLister?.items.length <= 1) {
      LOG.m(2, 'Item.cancelEdit — seul item, blocage')
      this._warnIfEmptyTitle()
      return
    }
    this.revertValues()
    this._stopEditing()
  }

  focus() { this.el.focus() }

  openBrinPanel(){
    this.project.listerBrins.display(this)
  }

  openPersoPanel(){
    this.parentLister?.markForCheck?.(this)
    this.project.listerPersos.display(this)
  }

}

Object.defineProperties(Item.prototype, Object.getOwnPropertyDescriptors(ItemDom))
Object.assign(Item.prototype, ItemRepo)
