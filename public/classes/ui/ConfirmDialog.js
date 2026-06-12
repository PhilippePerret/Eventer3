export default class ConfirmDialog {

  static open({ message, keyboardController, buttons = null }) {
    return new Promise((resolve) => {
      const resolvedButtons = buttons ?? [
        { label: 'Confirmer', key: 'Enter',  shortcut: '↩︎', value: true  },
        { label: 'Annuler',   key: 'Escape', shortcut: '␛',  value: false },
      ]
      const dialog = new ConfirmDialog({ message, keyboardController, buttons: resolvedButtons, onChoose: resolve })
      dialog._init()
    })
  }

  constructor({ message, keyboardController, buttons, onChoose }) {
    this.message            = message
    this.keyboardController = keyboardController
    this.buttons            = buttons
    this._onChoose          = onChoose
  }

  _init() {
    this._buildDOM()
    this.keyboardController.pushMode({
      type: 'confirm-dialog',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    this._overlay = document.createElement('div')
    this._overlay.className = 'confirm-dialog-overlay'

    this._el = document.createElement('div')
    this._el.className = 'confirm-dialog'

    const text = document.createElement('p')
    text.className   = 'confirm-dialog__message'
    text.textContent = this.message

    const footer = document.createElement('div')
    footer.className = 'confirm-dialog__footer'

    const cancelBtn = this.buttons.find(b => b.key === 'Escape')
    const otherBtns = this.buttons.filter(b => b.key !== 'Escape')

    if (cancelBtn) footer.appendChild(this._makeBtn(cancelBtn, 'cancel'))

    const group = document.createElement('div')
    group.className = 'confirm-dialog__btn-group'
    otherBtns.forEach((b, i) => {
      const variant = i === otherBtns.length - 1 ? 'primary' : 'secondary'
      group.appendChild(this._makeBtn(b, variant))
    })
    footer.appendChild(group)

    this._el.append(text, footer)
    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
  }

  _makeBtn(b, variant) {
    const btn = document.createElement('button')
    btn.type      = 'button'
    btn.className = `confirm-dialog__btn confirm-dialog__btn--${variant}`
    const kbd = document.createElement('kbd')
    kbd.textContent = b.shortcut
    btn.appendChild(kbd)
    btn.appendChild(document.createTextNode(' ' + b.label))
    btn.addEventListener('click', () => this._choose(b.value))
    return btn
  }

  _handleKey(event) {
    event.preventDefault()
    const btn = this.buttons.find(b => b.key === event.key)
    if (btn) this._choose(btn.value)
  }

  _choose(value) {
    this._close()
    this._onChoose?.(value)
  }

  _close() {
    this.keyboardController.popMode()
    this._overlay.remove()
  }

}
