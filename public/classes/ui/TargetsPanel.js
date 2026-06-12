import Notification from './Notification.js'

export default class TargetsPanel {

  static open(keyboardController, field) {
    new TargetsPanel(keyboardController, field)._init()
  }

  constructor(keyboardController, field) {
    this.keyboardController = keyboardController
    this.field = field
    this._selectedIndex = 0
  }

  get _manager() { return this.keyboardController.targetsManager }

  _init() {
    this._buildDOM()
    this.keyboardController.pushMode({
      type: 'targets-panel',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    this._el = document.createElement('div')
    this._el.className = 'targets-panel floating-panel'
    document.body.appendChild(this._el)
    this._render()
  }

  _render() {
    this._el.innerHTML = ''

    const title = document.createElement('div')
    title.className = 'floating-panel__title'
    title.textContent = 'Cibles mémorisées'
    this._el.appendChild(title)

    const targets = this._manager.targets
    const pc = this._manager.pinnedCount

    const pinZone = document.createElement('div')
    pinZone.className = 'floating-panel__zone'
    const pinLabel = document.createElement('div')
    pinLabel.className = 'floating-panel__pin-label'
    pinLabel.textContent = '📌'
    pinZone.appendChild(pinLabel)
    targets.slice(0, pc).forEach((t, i) => pinZone.appendChild(this._makeRow(t, i)))
    this._el.appendChild(pinZone)

    const sep = document.createElement('div')
    sep.className = 'floating-panel__separator'
    this._el.appendChild(sep)

    const regularZone = document.createElement('div')
    regularZone.className = 'floating-panel__zone'
    targets.slice(pc).forEach((t, i) => regularZone.appendChild(this._makeRow(t, pc + i)))
    this._el.appendChild(regularZone)

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'
    const escBtn = document.createElement('span')
    escBtn.className = 'panel-footer-key'
    escBtn.textContent = '␛ Fermer'
    const enterBtn = document.createElement('span')
    enterBtn.className = 'panel-footer-key'
    enterBtn.textContent = '↩︎ Insérer'
    footer.appendChild(escBtn)
    footer.appendChild(enterBtn)
    this._el.appendChild(footer)
  }

  _makeRow(target, globalIndex) {
    const row = document.createElement('div')
    row.className = 'floating-panel__item'
    if (target.pinned) row.classList.add('floating-panel__item--pinned')
    if (globalIndex === this._selectedIndex) row.classList.add('selected')
    row.textContent = target.title
    return row
  }

  _handleKey(event) {
    event.preventDefault()
    switch (event.key) {
      case 'ArrowDown':
        if (event.metaKey || event.ctrlKey) {
          this._moveSelectedItem('down')
        } else {
          this._selectAt(this._selectedIndex + 1)
        }
        break
      case 'ArrowUp':
        if (event.metaKey || event.ctrlKey) {
          this._moveSelectedItem('up')
        } else {
          this._selectAt(this._selectedIndex - 1)
        }
        break
      case 'Enter':
        if (event.metaKey || event.ctrlKey) {
          this._close()
        } else {
          const target = this._manager.targets[this._selectedIndex]
          this._close()
          if (target && this.field) this._insertLink(target)
        }
        break
      case 'Escape':
        this._close()
        break
    }
  }

  _moveSelectedItem(direction) {
    const result = direction === 'up'
      ? this._manager.moveUp(this._selectedIndex)
      : this._manager.moveDown(this._selectedIndex)

    if (result === 'pinned') {
      Notification.show('Cible punaisée')
    } else if (result === 'unpinned') {
      Notification.show('Cible dépunaisée')
    } else if (result === true) {
      this._selectedIndex += (direction === 'up' ? -1 : 1)
    }

    this._render()
  }

  _insertLink(target) {
    const field = this.field
    const start = field.selectionStart
    const end   = field.selectionEnd
    const link  = `[${target.title}](${target.id})`
    field.value = field.value.slice(0, start) + link + field.value.slice(end)
    const linkStart = start + 1
    field.setSelectionRange(linkStart, linkStart + target.title.length)
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.focus()
  }

  _selectAt(i) {
    const rows = this._el.querySelectorAll('.floating-panel__item')
    rows[this._selectedIndex]?.classList.remove('selected')
    this._selectedIndex = Math.max(0, Math.min(i, rows.length - 1))
    rows[this._selectedIndex]?.classList.add('selected')
  }

  _close() {
    this.keyboardController.popMode()
    this._el.remove()
    this.field?.focus()
  }

}
