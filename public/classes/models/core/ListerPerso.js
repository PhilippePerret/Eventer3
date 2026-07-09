import Lister from '../abstract/Lister.js'
import Perso from './Perso.js'
import { raise } from '../../../system/Error.js'

export default class ListerPerso extends Lister {

  static ITEM_CLASS = Perso
  static PANEL_ID   = 'persos-panel'
  static CHECK_KEY  = 'perso_ids'
  static LISTENERS  = { ...Lister.LISTENERS, p: { nokey: 'closePanel' } }

  constructor(data = {}) {
    super(data)
    this.project = data.project ?? raise(3000)
    this.id = this.project.id + '-persos'
    this._contextItem = null // Brin ou Event
  }

  // items : un seul Event/Brin sélectionné, ou tous les items cochés (Maj+p)
  displayForItems(items) {
    const ctx = {
      items,
      get perso_ids() {
        const ids = new Set()
        items.forEach(it => (it.perso_ids ?? []).forEach(id => ids.add(id)))
        return [...ids]
      },
      set perso_ids(_v) { /* mutation réelle faite item par item dans _afterToggle */ },
      async save() { for (const it of items) await it.save() },
    }
    this.display(ctx)
  }

  _panelTitle() {
    const items = this._contextItem?.items ?? []
    if (items.length > 1) return `Persos ${items[0]?.minClass === 'brin' ? 'brins' : 'events'} des cochés`
    return `Persos de ${items[0]?.title ?? ''}`
  }

  _applyContext(contextItem) {
    const items = contextItem.items
    this._listerEvent  = items[0]?.parentLister
    this._directIds    = new Set()
    this._inheritedIds = new Set()
    items.forEach(it => {
      (it.perso_ids ?? []).forEach(id => this._directIds.add(id))
      if (it.minClass === 'event') {
        const brins = this.project.itemsById['brins']
        ;(it.brin_ids ?? []).forEach(bid => brins[bid]?.perso_ids?.forEach(pid => this._inheritedIds.add(pid)))
      }
    })
  }

  async _initDefault() {
    const result = await this.createItem({ title: 'Votre protagoniste' })
    if (!result?.id) return
    this.item_ids = [result.id]
    await this.save()
    this.items = [new Perso({ ...result, id: result.id, _index: 0, project: this.project, parentLister: this })]
  }

  _syncChecked() {
    const directIds    = this._directIds    ?? new Set()
    const inheritedIds = this._inheritedIds ?? new Set()
    this.items.forEach(p => {
      const direct    = directIds.has(p.id)
      const inherited = !direct && inheritedIds.has(p.id)
      p.checked   = direct || inherited
      p.inherited = inherited
      p.el?.classList.toggle('inherited', inherited)
      p.applyChecked()
    })
  }

  get contextItem() { return this._contextItem }

  _canToggle(item) { return !item.inherited }

  _afterToggle(_perso, ctx) {
    ctx.items.forEach(it => it.refreshPersosMarks())
  }
}
