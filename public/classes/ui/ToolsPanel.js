import KeyboardablePanel from './KeyboardablePanel.js'

export default class ToolsPanel extends KeyboardablePanel {

  constructor() {
    super({ title: 'Outils', modeType: 'tools-panel', panelClass: 'tools-panel' })
    this._tools = []
  }

  // ── Ouverture ─────────────────────────────────────────────────────────────────

  open(tools, keyboardController) {
    this._tools = tools
    this._kc    = keyboardController
    super.open()
  }

  get isVisible() { return !!this._el }

  // ── Template ──────────────────────────────────────────────────────────────────

  _renderContent(zone) {
    this._tools.forEach((tool, i) => {
      const item = document.createElement('div')
      item.className = 'floating-panel__item' + (i === 0 ? ' selected' : '')
      item.innerHTML = `<kbd>${tool.key.toUpperCase()}</kbd> ${tool.label}`
      zone.appendChild(item)
    })
  }

  _getItemCount() { return this._tools.length }

  _onEnterItem(index) {
    const tool = this._tools[index]
    if (tool) { tool.action(); this.close() }
  }

  _getFooterButtons() {
    return [
      { label: 'Exécuter', variant: 'primary', action: () => this._onEnterItem(this._selectedIndex) },
      { label: 'Fermer',   variant: 'cancel',  action: () => this.close() },
    ]
  }

  // ── Clavier (lettres de raccourcis prioritaires sur le TAB cycle) ─────────────

  _handleKey(event) {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.length === 1) {
      const tool = this._tools.find(t => t.key.toLowerCase() === event.key.toLowerCase())
      if (tool) {
        tool.action()
        this.close()
        event.preventDefault()
        return
      }
    }
    super._handleKey(event)
  }

}
