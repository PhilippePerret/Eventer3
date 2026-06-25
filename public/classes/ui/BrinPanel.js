import ListerBrin from '../models/core/ListerBrin.js'
import { stopEvent } from '../utils/events.js'

export default class BrinPanel {

  constructor() {
    this._listerBrin     = null
    this._captureHandler = null
    this._mainPanel      = null
  }

  async open(event, listerEvent) {
    this._event       = event
    this._listerBrin  = new ListerBrin({ listerEvent })
    await this._listerBrin.load()
    this._listerBrin.render()
    this._mainPanel      = this._listerBrin.container
    this._captureHandler = e => this._handleKey(e)
    this._mainPanel.addEventListener('keydown', this._captureHandler, { capture: true })
  }

  close() {
    this._mainPanel?.removeEventListener('keydown', this._captureHandler, { capture: true })
    this._captureHandler = null
    const panel = document.querySelector('#brins-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    this._listerBrin = null
    this._event?.el?.focus()
  }

  static HANDLED_KEYS = {
      ArrowDown: 'selectNext'
    , ArrowUp:    'selectPrev'
    , ' ':        'toggleChecked'
    , Enter:      true
    , n:          'createNew'
    , Delete:     'deleteSelected'
    , b:          true
    /* RÈGLE ABSOLUE : La touche Escape ne sert JAMAIS à fermer un panneau */
  }

  _handleKey(e) {
    const handledKey = BrinPanel.HANDLED_KEYS[e.key]

    if (undefined == handledKey) return

    const lb = this._listerBrin
    const selected = lb?.items[lb?.selectedIndex]

    if (selected?.editing) return

    stopEvent(e)

    if (handledKey === true) {
      switch (e.key) {
        case 'Enter':
          if (e.metaKey) return this.close()
          else selected?.startEditing(); 
          break
        case 'b' :      
          return this.close()
          break
      }
    } else {
      if (!lb) return
      lb[handledKey]()
    }
  }

}
