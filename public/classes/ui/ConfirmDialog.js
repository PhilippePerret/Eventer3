import KeyboardablePanel from './KeyboardablePanel.js'

export default class ConfirmDialog extends KeyboardablePanel {

  static open({ title = 'Confirmation', message, buttons = null } = {}) {
    return new Promise((resolve) => {
      const resolvedButtons = buttons ?? [
        { label: 'Confirmer', variant: 'primary', value: true  },
        { label: 'Annuler',   variant: 'cancel',  value: false },
      ]
      const dialog = new ConfirmDialog({ title, message, buttons: resolvedButtons, onChoose: resolve })
      dialog.open()
    })
  }

  constructor({ title, message, buttons, onChoose }) {
    super({ title, panelClass: 'confirm-dialog' })
    this._message  = message
    this._buttons  = buttons
    this._onChoose = onChoose
  }

  _renderContent(zone) {
    const text = document.createElement('p')
    text.className   = 'confirm-dialog__message'
    text.textContent = this._message
    zone.appendChild(text)
  }

  _getFooterButtons() {
    return this._buttons.map(({ label, variant, value }) => ({
      label,
      variant,
      action: () => this._choose(value),
    }))
  }

  _getItemCount() { return 0 }

  _onEnterItem() {
    const primary = this._buttons.find(b => b.variant === 'primary')
    if (primary) this._choose(primary.value)
  }

  _choose(value) {
    this.close()
    this._onChoose?.(value)
  }

}
