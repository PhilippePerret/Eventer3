import ListerBrin from '../models/core/ListerBrin.js'
import { stopEvent } from '../utils/events.js'

export default class BrinPanel {

  constructor() {
    this._listerBrin     = null
    this._captureHandler = null
    this._mainPanel      = null
  }

  open(event, listerEvent) {
    this._event       = event
    this._listerBrin  = new ListerBrin({ listerEvent })
    this._listerBrin.load()
    this._listerBrin.render()
    this._mainPanel      = document.querySelector('#main-panel')
    this._captureHandler = e => this._handleKey(e)
    this._mainPanel.addEventListener('keydown', this._captureHandler, { capture: true })
  }

  close() {
    this._mainPanel?.removeEventListener('keydown', this._captureHandler, { capture: true })
    this._captureHandler = null
    const panel = document.querySelector('#brin-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    this._listerBrin = null
    this._event?.el?.focus()
  }

  _handleKey(e) {
    const lb = this._listerBrin
    const selected = lb?.items[lb?.selectedIndex]

    if (selected?.editing) return

    if (e.key === 'b' || e.key === 'Escape' || (e.key === 'Enter' && e.metaKey)) {
      stopEvent(e)
      this.close()
      return
    }

    if (!lb) return

    switch (e.key) {
      case 'ArrowDown': stopEvent(e); lb.selectNext(); break
      case 'ArrowUp':   stopEvent(e); lb.selectPrev(); break
      case ' ':         stopEvent(e); lb.toggleChecked(); break
      case 'Enter':     stopEvent(e); selected?.startEditing(); break
      case 'n':         stopEvent(e); lb.createNew(); break
    }
  }

}
