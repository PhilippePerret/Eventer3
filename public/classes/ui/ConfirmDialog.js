export default class ConfirmDialog {

  static open({ message, keyboardController }) {
    return new Promise((resolve) => {
      const dialog = new ConfirmDialog({
        message,
        keyboardController,
        onConfirm: () => resolve(true),
        onCancel:  () => resolve(false),
      })
      dialog._init()
    })
  }

  constructor({ message, keyboardController, onConfirm, onCancel }) {
    this.message            = message
    this.keyboardController = keyboardController
    this._onConfirm         = onConfirm
    this._onCancel          = onCancel
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
    footer.innerHTML = '<kbd>↩︎</kbd> Confirmer &nbsp;&nbsp; <kbd>␛</kbd> Annuler'

    this._el.appendChild(text)
    this._el.appendChild(footer)
    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
  }

  _handleKey(event) {
    event.preventDefault()
    if (event.key === 'Enter') {
      this._close()
      this._onConfirm?.()
    } else if (event.key === 'Escape') {
      this._close()
      this._onCancel?.()
    }
  }

  _close() {
    this.keyboardController.popMode()
    this._overlay.remove()
  }

}
