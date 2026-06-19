import KeyboardablePanel from './KeyboardablePanel.js'

const MODES = [
  { key: 'i', label: 'Imbrication', mode: 'NESTING' },
  { key: 'n', label: 'Niveau',      mode: 'LEVEL'   },
  { key: 'a', label: 'Arbre',       mode: 'ARBRE'   },
]

export default class DisplayModePanel extends KeyboardablePanel {

  static open(keyboardController, eventLister) {
    new DisplayModePanel(keyboardController, eventLister).open()
  }

  constructor(keyboardController, eventLister) {
    super({ title: 'Mode d’affichage', modeType: 'display-mode-panel', panelClass: 'display-mode-panel', keyboardController })
    this._eventLister = eventLister
  }

  _renderContent(zone) {
    MODES.forEach(({ key, label }, i) => {
      const row = document.createElement('div')
      row.className = 'floating-panel__item'
      if (i === this._selectedIndex) row.classList.add('selected')
      row.innerHTML = `<kbd>${key}</kbd> ${label}`
      zone.appendChild(row)
    })
  }

  _getItemCount() { return MODES.length }

  _getFooterButtons() {
    return [
      { label: 'Appliquer', variant: 'primary', action: () => this._applySelected() },
      { label: 'Annuler',   variant: 'cancel',  action: () => this.close() },
    ]
  }

  _onEnterItem(index) {
    this._applyMode(MODES[index].mode)
  }

  _applySelected() {
    this._applyMode(MODES[this._selectedIndex].mode)
  }

  _applyMode(mode) {
    this.close()
    this._eventLister?.setDisplayMode(mode)
  }

  _handleKey(event) {
    const letter = MODES.find(m => m.key === event.key)
    if (letter && this._footerFocusIdx < 0) {
      event.preventDefault()
      this._applyMode(letter.mode)
      return
    }
    super._handleKey(event)
  }

}
