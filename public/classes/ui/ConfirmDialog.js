import KeyboardablePanel from './KeyboardablePanel.js'

export default class ConfirmDialog extends KeyboardablePanel {

  static open({ title = 'Confirmation', message, expectedValue, buttons = null } = {}) {
    return new Promise((resolve) => {
      const resolvedButtons = buttons ?? [
        { label: 'Confirmer', type: '',       value: true  },
        { label: 'Annuler',   type: 'cancel', value: false },
      ]
      const dialog = new ConfirmDialog({ title, message, expectedValue, buttons: resolvedButtons, onChoose: resolve })
      dialog.open()
    })
  }

  constructor({ title, message, expectedValue, buttons, onChoose }) {
    super({ title, panelClass: 'confirm-dialog' })
    this._message       = message
    this._expectedValue = expectedValue ?? null
    this._buttons       = buttons
    this._onChoose      = onChoose
    this._inputEl       = null
  }

  open() {
    super.open()
    this._inputEl?.focus()
  }

  _render() {
    super._render()
    if (this._expectedValue != null) {
      this._footerBtns[0]?.el.classList.add('ftpanel-btn--disabled')
    }
  }

  _renderContent(zone) {
    const text = document.createElement('p')
    text.className   = 'confirm-dialog__message'
    text.textContent = this._message
    zone.appendChild(text)

    if (this._expectedValue != null) {
      this._inputEl = document.createElement('input')
      this._inputEl.type      = 'text'
      this._inputEl.className = 'confirm-dialog__input'
      this._inputEl.setAttribute('autocomplete', 'off')
      this._inputEl.addEventListener('input', () => {
        const match = this._inputEl.value.trim() === String(this._expectedValue)
        this._footerBtns[0]?.el.classList.toggle('ftpanel-btn--disabled', !match)
      })
      zone.appendChild(this._inputEl)
    }
  }

  _getFooterButtons() {
    return this._buttons.map(({ label, type, value }) => ({
      label,
      type,
      action: () => {
        if (value === true && this._expectedValue != null) {
          if (this._inputEl?.value.trim() !== String(this._expectedValue)) return
        }
        this._choose(value)
      },
    }))
  }

  _choose(value) {
    this.close()
    this._onChoose?.(value)
  }

}
