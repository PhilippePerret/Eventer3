export default class TargetsPanel {

  static open(keyboardController, field) {
    new TargetsPanel(keyboardController, field)._init()
  }

  constructor(keyboardController, field) {
    this.keyboardController = keyboardController
    this.field = field
    this._selectedIndex = 0
  }

  _init() {
    this._buildDOM()
    this.keyboardController.pushMode({
      type: 'targets-panel',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    this._el = document.createElement('div')
    this._el.className = 'targets-panel'

    this.keyboardController.targets.forEach((target, i) => {
      const row = document.createElement('div')
      row.className = 'targets-panel__item'
      if (i === 0) row.classList.add('selected')
      row.textContent = target.title
      this._el.appendChild(row)
    })

    document.body.appendChild(this._el)
  }

  _handleKey(event) {
    event.preventDefault()
    switch (event.key) {
      case 'ArrowDown':
        this._selectAt(this._selectedIndex + 1)
        break
      case 'ArrowUp':
        this._selectAt(this._selectedIndex - 1)
        break
      case 'Enter':
        if (event.metaKey || event.ctrlKey) {
          this._close()
        } else {
          const target = this.keyboardController.targets[this._selectedIndex]
          this._close()
          if (target && this.field) this._insertLink(target)
        }
        break
      case 'Escape':
        this._close()
        break
    }
  }

  _insertLink(target) {
    const field = this.field
    const start = field.selectionStart
    const end   = field.selectionEnd
    const link  = `[${target.title}](${target.id})`
    field.value = field.value.slice(0, start) + link + field.value.slice(end)
    const linkStart = start + 1  // après '['
    field.setSelectionRange(linkStart, linkStart + target.title.length)
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.focus()
  }

  _selectAt(i) {
    const rows = this._el.querySelectorAll('.targets-panel__item')
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
