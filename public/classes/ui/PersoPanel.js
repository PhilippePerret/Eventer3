import ListerPerso from '../models/core/ListerPerso.js'
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
    const project_id     = item.project_id ?? parentLister?.project_id
    this._listerPerso    = new ListerPerso({ project_id })
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
    this._listerPerso = null
    this._opener?.el?.focus()
    this._opener = null
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
    const handledKey = PersoPanel.HANDLED_KEYS[e.key]
    if (undefined == handledKey) return

    const lp       = this._listerPerso
    const selected = lp?.items[lp?.selectedIndex]

    if (selected?.editing) return

    stopEvent(e)

    if (handledKey === true) {
      switch (e.key) {
        case 'Enter':
          if (e.metaKey) return this.close()
          else selected?.startEditing()
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
