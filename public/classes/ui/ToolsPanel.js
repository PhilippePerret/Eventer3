import KeyboardablePanel from './KeyboardablePanel.js'
import { stopEvent } from '../utils/events.js'

export default class ToolsPanel extends KeyboardablePanel {

  constructor() {
    super({ title: 'Outils', panelClass: 'tools-panel' })
    this._tools = []
  }

  open(tools) {
    this._tools = tools
    super.open()
  }

  get isVisible() { return !!this._el }

  _renderContent(zone) {
    this._tools.forEach((tool, i) => {
      const item = document.createElement('div')
      item.className = 'ftpanel__item' + (i === 0 ? ' selected' : '')
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
      { label: 'Exécuter', type: 'primary', action: () => this._onEnterItem(this._selectedIndex) },
      { label: 'Fermer',   type: 'cancel',  action: () => this.close() },
    ]
  }

  _handleKey(event) {
    if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.length === 1) {
      const tool = this._tools.find(t => t.key.toLowerCase() === event.key.toLowerCase())
      if (tool) { stopEvent(event); tool.action(); this.close(); return }
    }
    super._handleKey(event)
  }

}
