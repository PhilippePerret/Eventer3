import ListerBrin  from '../models/core/ListerBrin.js'
import ListerPerso from '../models/core/ListerPerso.js'
import Notification from './Notification.js'
import { stopEvent } from '../utils/events.js'

export default class PersoPanel {

  constructor() {
    this._listerPerso    = null
    this._captureHandler = null
    this._mainPanel      = null
    this._opener         = null
  }

  async open(item, parentLister) {
    this._opener         = item
    const isBrinContext  = parentLister instanceof ListerBrin
    const project_id     = item.project_id ?? parentLister?.project_id
    const directIds      = new Set(item.perso_ids ?? [])
    const inheritedIds   = new Set()
    const brinsData      = parentLister?.brins ?? {}
    for (const brinId of (item.brin_ids ?? [])) {
      const brin = brinsData[brinId]
      if (brin) (brin.brin_perso_ids ?? []).forEach(pid => inheritedIds.add(pid))
    }
    const contextBrin  = isBrinContext ? item : null
    const listerEvent  = isBrinContext ? parentLister.listerEvent : null
    this._listerPerso = new ListerPerso({ project_id, directIds, inheritedIds, contextEvent: item, contextBrin, listerEvent })
    await this._listerPerso.load()
    this._listerPerso.render()
    this._mainPanel      = parentLister.container
    this._captureHandler = e => this._handleKey(e)
    this._mainPanel.addEventListener('keydown', this._captureHandler, { capture: true })
  }

  close() {
    this._mainPanel?.removeEventListener('keydown', this._captureHandler, { capture: true })
    this._captureHandler = null
    const panel = document.querySelector('#persos-panel')
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = '' }
    this._refreshBrinEventMarks()
    this._listerPerso = null
    this._opener?.el?.focus()
    this._opener = null
  }

  _refreshBrinEventMarks() {
    const lp   = this._listerPerso
    const brin = lp?._contextBrin
    const le   = lp?._listerEvent
    if (!brin || !le) return
    const brinId        = brin.id
    const affected      = le.items.filter(ev => (ev.brin_ids ?? []).includes(brinId))
    const showMsg       = affected.length > 100
    if (showMsg) Notification.show('Actualisation des évènements…')
    affected.forEach(ev => {
      const el = ev.el?.querySelector('.event-persos-marks')
      if (!el) return
      const tmp = document.createElement('template')
      tmp.innerHTML = ev.persosMarks()
      el.replaceWith(tmp.content.firstChild)
    })
    if (showMsg) Notification.hide()
  }

  static HANDLED_KEYS = {
      ArrowDown: 'selectNext'
    , ArrowUp:   'selectPrev'
    , ' ':       'toggleChecked'
    , Enter:     true
    , Escape:    true
    , p:         true
  }

  _handleKey(e) {
    const key        = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const handledKey = PersoPanel.HANDLED_KEYS[key]
    if (undefined == handledKey) return

    const lp       = this._listerPerso
    const selected = lp?.items[lp?.selectedIndex]

    if (selected?.editing) return

    stopEvent(e)

    if (handledKey === true) {
      switch (key) {
        case 'Tab':
          selected?.onTab()
          break
        case 'Enter':
          if (e.metaKey) return this.close()
          else selected?.onEnter()
          break
        case 'Escape':
        case 'p':
          return this.close()
      }
    } else {
      if (!lp) return
      lp[handledKey]()
    }
  }

}
