import KeyboardablePanel from './KeyboardablePanel.js'
import Notification from './Notification.js'

export default class TargetsPanel extends KeyboardablePanel {

  static open(keyboardController, field) {
    new TargetsPanel(keyboardController, field).open()
  }

  constructor(keyboardController, field) {
    super({ title: 'Cibles mémorisées', modeType: 'targets-panel', panelClass: 'targets-panel', keyboardController })
    this.field = field
  }

  get _manager() { return this._kc.targetsManager }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  _renderContent(zone) {
    const targets = this._manager.targets
    const pc      = this._manager.pinnedCount

    const pinLabel = document.createElement('div')
    pinLabel.className = 'floating-panel__pin-label'
    pinLabel.textContent = '📌'
    zone.appendChild(pinLabel)
    targets.slice(0, pc).forEach((t, i) => zone.appendChild(this._makeRow(t, i)))

    const sep = document.createElement('div')
    sep.className = 'floating-panel__separator'
    zone.appendChild(sep)

    targets.slice(pc).forEach((t, i) => zone.appendChild(this._makeRow(t, pc + i)))
  }

  _getItemCount() { return this._manager.targets.length }

  _onEnterItem(index) {
    const target = this._manager.targets[index]
    this.close()
    if (target && this.field) this._insertLink(target)
  }

  _getFooterButtons() { return [] }

  _renderFooter(el) {
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
    el.appendChild(footer)
  }

  _makeRow(target, globalIndex) {
    const row = document.createElement('div')
    row.className = 'floating-panel__item'
    if (target.pinned) row.classList.add('floating-panel__item--pinned')
    if (globalIndex === this._selectedIndex) row.classList.add('selected')
    row.textContent = target.title
    return row
  }

  // ── Clavier ──────────────────────────────────────────────────────────────────

  _handleKey(event) {
    event.preventDefault()
    switch (event.key) {
      case 'ArrowDown':
        if (event.metaKey || event.ctrlKey) { this._moveSelectedItem('down') }
        else { this._selectAt(this._selectedIndex + 1) }
        break
      case 'ArrowUp':
        if (event.metaKey || event.ctrlKey) { this._moveSelectedItem('up') }
        else { this._selectAt(this._selectedIndex - 1) }
        break
      case 'Enter':
        if (event.metaKey || event.ctrlKey) { this.close() }
        else { this._onEnterItem(this._selectedIndex) }
        break
      case 'Escape':
        this.close()
        break
    }
  }

  _moveSelectedItem(direction) {
    const result = direction === 'up'
      ? this._manager.moveUp(this._selectedIndex)
      : this._manager.moveDown(this._selectedIndex)

    if (result === 'pinned')   { Notification.show('Cible punaisée') }
    else if (result === 'unpinned') { Notification.show('Cible dépunaisée') }
    else if (result === true)  { this._selectedIndex += (direction === 'up' ? -1 : 1) }

    const zone = this._el?.querySelector('.floating-panel__zone')
    if (zone) { zone.innerHTML = ''; this._renderContent(zone) }
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

  close() {
    super.close()
    this.field?.focus()
  }

}
