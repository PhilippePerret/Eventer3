import KeyboardablePanel from './KeyboardablePanel.js'

export default class ConfirmDialog extends KeyboardablePanel {

  static open({ title = 'Confirmation', message, buttons = null } = {}) {
    return new Promise((resolve) => {
      const resolvedButtons = buttons ?? [
        { label: 'Confirmer', type: '',       value: true  },
        { label: 'Annuler',   type: 'cancel', value: false },
      ]
      const dialog = new ConfirmDialog({ title, message, buttons: resolvedButtons, onChoose: resolve })
      dialog.open()
    })
  }

  constructor({ title, message, buttons, onChoose }) {
    super({ title, panelClass: '' })
    this._message  = message
    this._buttons  = buttons
    this._onChoose = onChoose
  }

  _renderContent(zone) {
    const text = document.createElement('p')
    text.textContent = this._message
    zone.appendChild(text)
  }

  _getFooterButtons() {
    return this._buttons.map(({ label, type, value }) => ({
      label,
      type,
      action: () => this._choose(value),
    }))
  }

  _getItemCount() { return 0 }

  _onEnterItem() {
    this._choose(this._buttons[0].value)
  }

  _choose(value) {
    this.close()
    this._onChoose?.(value)
  }

}
