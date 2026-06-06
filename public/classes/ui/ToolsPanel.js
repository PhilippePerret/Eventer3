export default class ToolsPanel {

  constructor() {
    this._tools = []
    this._selectedIndex = 0
    this._keyboardController = null
  }

  get el() {
    return document.querySelector('#tools-panel')
  }

  get isVisible() {
    const el = this.el
    return el ? !el.classList.contains('hidden') : false
  }

  open(tools, keyboardController) {
    this._tools = tools
    this._selectedIndex = 0
    this._keyboardController = keyboardController
    this._render()
    this.el.classList.remove('hidden')
    keyboardController.pushMode({
      type: 'tools-panel',
      onKeyDown: (event, kc) => this.onKeyDown(event, kc)
    })
  }

  close() {
    this.el.classList.add('hidden')
    this._keyboardController?.popMode()
    this._keyboardController = null
  }

  _render() {
    const el = this.el
    if (!el) return
    el.innerHTML = ''
    this._tools.forEach((tool, i) => {
      const item = document.createElement('div')
      item.className = 'tools-panel__item' + (i === 0 ? ' selected' : '')
      item.innerHTML = `<kbd>${tool.key.toUpperCase()}</kbd> ${tool.label}`
      item.addEventListener('click', () => { tool.action(); this.close() })
      el.appendChild(item)
    })
  }

  onKeyDown(event, keyboardController) {
    if (event.key === 'Escape') {
      this.close()
      event.preventDefault()
      return
    }
    if (event.key === 'ArrowDown') {
      this._selectedIndex = Math.min(this._selectedIndex + 1, this._tools.length - 1)
      this._updateSelection()
      event.preventDefault()
      return
    }
    if (event.key === 'ArrowUp') {
      this._selectedIndex = Math.max(this._selectedIndex - 1, 0)
      this._updateSelection()
      event.preventDefault()
      return
    }
    if (event.key === 'Enter') {
      const tool = this._tools[this._selectedIndex]
      if (tool) { tool.action(); this.close() }
      event.preventDefault()
      return
    }
    const tool = this._tools.find(t => t.key.toLowerCase() === event.key.toLowerCase())
    if (tool) {
      tool.action()
      this.close()
      event.preventDefault()
    }
  }

  _updateSelection() {
    const items = this.el?.querySelectorAll('.tools-panel__item') ?? []
    items.forEach((item, i) => item.classList.toggle('selected', i === this._selectedIndex))
  }

}
