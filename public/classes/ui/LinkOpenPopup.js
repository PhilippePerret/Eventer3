export default class LinkOpenPopup {

  static open({ targetId, targetTitle, keyboardController }) {
    new LinkOpenPopup({ targetId, targetTitle, keyboardController })._init()
  }

  constructor({ targetId, targetTitle, keyboardController }) {
    this.targetId = targetId
    this.targetTitle = targetTitle
    this.keyboardController = keyboardController
    this._selectedIndex = 0
    this._options = [
      { label: 'Dans son évènemencier', action: 'go'    },
      { label: 'Sa carte',              action: 'card'  },
      { label: 'Dans l\'autre fenêtre', action: 'split' },
    ]
  }

  _init() {
    this._buildDOM()
    this.keyboardController.pushMode({
      type: 'link-open-popup',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    this._el = document.createElement('div')
    this._el.className = 'link-open-popup floating-panel'

    const title = document.createElement('div')
    title.className = 'floating-panel__title'
    title.textContent = this.targetTitle
    this._el.appendChild(title)

    this._options.forEach((opt, i) => {
      const row = document.createElement('div')
      row.className = 'floating-panel__item'
      if (i === 0) row.classList.add('selected')
      row.textContent = opt.label
      this._el.appendChild(row)
    })

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'
    const escBtn = document.createElement('span')
    escBtn.className = 'panel-footer-key'
    escBtn.textContent = '␛ Fermer'
    const enterBtn = document.createElement('span')
    enterBtn.className = 'panel-footer-key'
    enterBtn.textContent = '↩︎ Ouvrir'
    footer.appendChild(escBtn)
    footer.appendChild(enterBtn)
    this._el.appendChild(footer)

    document.body.appendChild(this._el)
  }

  _handleKey(event) {
    event.preventDefault()
    switch (event.key) {
      case 'ArrowDown': this._selectAt(this._selectedIndex + 1); break
      case 'ArrowUp':   this._selectAt(this._selectedIndex - 1); break
      case 'Enter':     this._confirm(); break
      case 'Escape':    this._close();   break
    }
  }

  _selectAt(i) {
    const rows = this._el.querySelectorAll('.floating-panel__item')
    rows[this._selectedIndex]?.classList.remove('selected')
    this._selectedIndex = Math.max(0, Math.min(i, rows.length - 1))
    rows[this._selectedIndex]?.classList.add('selected')
  }

  _confirm() {
    const action = this._options[this._selectedIndex].action
    this._close()
    this.keyboardController.executeLinkAction(action, this.targetId)
  }

  _close() {
    this.keyboardController.popMode()
    this._el.remove()
  }

}
