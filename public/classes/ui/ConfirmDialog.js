const MAX_TITLE_LENGTH = 30

export default class ConfirmDialog {

  static open({ message, title, inputCount, itemType, keyboardController, buttons = null }) {
    return new Promise((resolve) => {
      const resolvedButtons = buttons ?? [
        { label: 'Confirmer', key: 'Enter',  shortcut: '↩︎', value: true  },
        { label: 'Annuler',   key: 'Escape', shortcut: '␛',  value: false },
      ]
      const dialog = new ConfirmDialog({ message, title, inputCount, itemType, keyboardController, buttons: resolvedButtons, onChoose: resolve })
      dialog._init()
    })
  }

  constructor({ message, title, inputCount, itemType, keyboardController, buttons, onChoose }) {
    this.message            = message
    this.title              = title
    this.inputCount         = inputCount
    this.itemType           = itemType
    this.keyboardController = keyboardController
    this.buttons            = buttons
    this._onChoose          = onChoose
    this._inputEl           = null
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

    if (this.title != null) {
      this._buildCascadeLayout()
    } else {
      this._buildSimpleLayout()
    }

    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
    if (this._inputEl) this._inputEl.focus()
  }

  _buildSimpleLayout() {
    const text = document.createElement('p')
    text.className   = 'confirm-dialog__message'
    text.textContent = this.message

    const footer = this._buildFooter()
    this._el.append(text, footer)
  }

  _buildCascadeLayout() {
    const label = this.inputCount === 1 ? 'évènement imbriqué' : 'évènements imbriqués'

    const titleEl = document.createElement('div')
    titleEl.className = 'confirm-dialog__title'
    const raw = `Destruction de « ${this.title} »`
    titleEl.textContent = raw.length > MAX_TITLE_LENGTH + 20
      ? `Destruction de « ${this.title.slice(0, MAX_TITLE_LENGTH)}… »`
      : raw

    const sep1 = document.createElement('div')
    sep1.className = 'confirm-dialog__separator'

    const body = document.createElement('div')
    body.className = 'confirm-dialog__body'

    const msg = document.createElement('p')
    msg.className   = 'confirm-dialog__message'
    msg.textContent = `Cette destruction entraînera la destruction en cascade de ${this.inputCount} ${label}. Confirmation requise.`

    const inputRow = document.createElement('p')
    inputRow.className   = 'confirm-dialog__input-row'
    inputRow.textContent = `Tapez ${this.inputCount} puis ↩︎ pour confirmer : `

    this._inputEl = document.createElement('input')
    this._inputEl.type      = 'text'
    this._inputEl.className = 'confirm-dialog__input'
    this._inputEl.setAttribute('autocomplete', 'off')

    inputRow.appendChild(this._inputEl)
    body.append(msg, inputRow)

    const sep2 = document.createElement('div')
    sep2.className = 'confirm-dialog__separator'

    const footer = this._buildFooter()
    this._el.append(titleEl, sep1, body, sep2, footer)

    if (this._confirmBtn) {
      this._confirmBtn.disabled = true
      this._inputEl.addEventListener('input', () => {
        const match = this._inputEl.value.trim() === String(this.inputCount)
        this._confirmBtn.disabled = !match
      })
    }
  }

  _buildFooter() {
    const footer = document.createElement('div')
    footer.className = 'confirm-dialog__footer'

    const cancelBtn = this.buttons.find(b => b.key === 'Escape')
    const otherBtns = this.buttons.filter(b => b.key !== 'Escape')

    if (cancelBtn) footer.appendChild(this._makeBtn(cancelBtn, 'cancel'))

    const group = document.createElement('div')
    group.className = 'confirm-dialog__btn-group'
    otherBtns.forEach((b, i) => {
      const variant = i === otherBtns.length - 1 ? 'primary' : 'secondary'
      const btn = this._makeBtn(b, variant)
      if (variant === 'primary') this._confirmBtn = btn
      group.appendChild(btn)
    })
    footer.appendChild(group)
    return footer
  }

  _makeBtn(b, variant) {
    const btn = document.createElement('button')
    btn.type      = 'button'
    btn.className = `confirm-dialog__btn confirm-dialog__btn--${variant}`
    const kbd = document.createElement('kbd')
    kbd.textContent = b.shortcut
    btn.appendChild(kbd)
    btn.appendChild(document.createTextNode(' ' + b.label))
    btn.addEventListener('click', () => this._choose(b.value))
    return btn
  }

  _handleKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      this._choose(false)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!this._inputEl || this._inputEl.value.trim() === String(this.inputCount)) {
        this._choose(true)
      }
      return
    }
    if (!this._inputEl) {
      event.preventDefault()
      const btn = this.buttons.find(b => b.key === event.key)
      if (btn) this._choose(btn.value)
    }
    // Avec input : laisser passer les autres touches
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
