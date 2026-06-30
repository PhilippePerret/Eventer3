import Lister from '../abstract/Lister.js'
import Style from './Style.js'
import { ListerStyleLi } from '../listen/Style.js'

export default class ListerStyle extends Lister {
  static ITEM_CLASS = Style
  static LISTENERS  = ListerStyleLi
  static PANEL_ID   = 'style-panel'
  static CHECK_KEY  = 'css'

  get minClass() { return 'style' }

  constructor(data = {}) {
    super(data)
    this._allStyles = []
  }

  async load() {
    const res = await fetch('/api/themes', { cache: 'no-store' })
    const themes = res.ok ? await res.json() : []
    this._allStyles = themes.map((t, idx) => new Style({ ...t, id: t.name, title: t.name, _index: idx, project: this.project, parentLister: this }))
    this.items    = [...this._allStyles]
    this.item_ids = this._allStyles.map(s => s.id)
  }

  _syncChecked() {
    const checkedNames = this.contextItem.css ?? []
    this.items.forEach(s => {
      s.checked = checkedNames.includes(s.name)
      s.el?.classList.toggle('checked', s.checked)
    })
    this.selectedIndex = 0
  }

  _afterToggle(_style, ev) {
    ListerStyle.applyToEvents(ev, this.items)
  }

  async save() {
    const ev = this.contextItem
    if (!ev) return
    ev.css = this.items.filter(s => s.checked).map(s => s.id)
    ListerStyle.applyToEvents(ev, this.items)
    ev.scheduleSave()
  }

  static applyToEvents(event, styles) {
    /* 
    
    TODO : DOIT TENIR COMPTE DE : 
    PANNEAU OUVERT AVEC s + MAJ => APPLIQUER À TOUS LES EVENTS COCHÉS
    PANNEAU OUVERT AVEC s => APPLIQUER SEULEMENT À EVENT SÉLECTIONNÉ

     */
    const id = `ev-style-${event.id}`
    let el   = document.getElementById(id)
    if (!el) { el = document.createElement('style'); el.id = id; document.head.appendChild(el) }
    const css = event.css ?? []
    if (!css.length) { el.textContent = ''; return }
    el.textContent = css
      .map(n => { const s = styles.find(x => x.name === n); return s ? `.event-item[data-id="${event.id}"] .event-text { ${s.css} }` : '' })
      .filter(Boolean).join('\n')
      + `\n.event-item[data-id="${event.id}"].selected:not(.editing) .event-text { color: white !important; }`
  }
}
