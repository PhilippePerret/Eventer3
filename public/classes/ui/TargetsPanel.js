import KeyDispatcher from '../models/abstract/KeyDispatcher.js'
import Notification from './Notification.js'

export default class TargetsPanel extends KeyDispatcher {

  static LISTENERS = {
    ArrowDown: { nokey: 'selectNext', meta: 'moveDown' },
    ArrowUp:   { nokey: 'selectPrev', meta: 'moveUp'   },
    Enter:     { nokey: 'onEnter',    meta: 'close'    },
  }

  constructor(manager, field) {
    super()
    this._manager       = manager
    this._field         = field
    this._selectedIndex = 0
    this._savedRange    = null
    this._el            = null
  }

  static open(manager, field) {
    new TargetsPanel(manager, field).open()
  }

  open() {
    const sel = window.getSelection()
    this._savedRange = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null
    this._el = this._build()
    document.body.appendChild(this._el)
    this.attach(this._el)
    this._items()[0]?.focus()
  }

  close() {
    this.detach()
    this._el?.remove()
    this._el = null
    this._field?.focus()
  }

  selectNext() {
    const items = this._items()
    this._selectedIndex = Math.min(this._selectedIndex + 1, items.length - 1)
    this._applySelection()
  }

  selectPrev() {
    this._selectedIndex = Math.max(this._selectedIndex - 1, 0)
    this._applySelection()
  }

  moveUp() {
    const result = this._manager.moveUp(this._selectedIndex)
    if      (result === 'pinned') { Notification.show('Cible punaisée') }
    else if (result === true)     { this._selectedIndex-- }
    this._rerender()
  }

  moveDown() {
    const result = this._manager.moveDown(this._selectedIndex)
    if      (result === 'unpinned') { Notification.show('Cible dépunaisée') }
    else if (result === true)       { this._selectedIndex++ }
    this._rerender()
  }

  onEnter() {
    const target = this._manager.targets[this._selectedIndex]
    this.close()
    if (target && this._field) this._insertLink(target)
  }

  // ── DOM ──────────────────────────────────────────────────────────────────────

  _build() {
    const el = document.createElement('div')
    el.className = 'targets-panel'
    el.setAttribute('tabindex', '-1')

    const title = document.createElement('div')
    title.className = 'floating-panel__title'
    title.textContent = 'Cibles mémorisées'
    el.appendChild(title)

    const zone = document.createElement('div')
    zone.className = 'floating-panel__zone'
    el.appendChild(zone)
    this._renderContent(zone)

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'
    footer.innerHTML = '<span class="panel-footer-key">⌘↩︎ Fermer</span><span class="panel-footer-key">↩︎ Insérer</span>'
    el.appendChild(footer)
    return el
  }

  _renderContent(zone) {
    zone.innerHTML = ''
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

  _makeRow(target, globalIndex) {
    const row = document.createElement('div')
    row.className = 'floating-panel__item'
    row.setAttribute('tabindex', '-1')
    if (target.pinned)                      row.classList.add('floating-panel__item--pinned')
    if (globalIndex === this._selectedIndex) row.classList.add('selected')
    row.textContent = target.title
    return row
  }

  _items() {
    return [...(this._el?.querySelectorAll('.floating-panel__item') ?? [])]
  }

  _applySelection() {
    const items = this._items()
    items.forEach((el, i) => el.classList.toggle('selected', i === this._selectedIndex))
    items[this._selectedIndex]?.focus()
  }

  _rerender() {
    const zone = this._el?.querySelector('.floating-panel__zone')
    if (zone) this._renderContent(zone)
    this._applySelection()
  }

  _insertLink(target) {
    const field = this._field
    field.focus()
    const link = `[${target.title}](${target.id})`
    const sel  = window.getSelection()
    if (this._savedRange) {
      sel?.removeAllRanges()
      sel?.addRange(this._savedRange)
    }
    if (!sel?.rangeCount) {
      field.textContent += link
      field.dispatchEvent(new Event('input', { bubbles: true }))
      return
    }
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const textNode = document.createTextNode(link)
    range.insertNode(textNode)
    const newRange = document.createRange()
    newRange.setStart(textNode, 1)
    newRange.setEnd(textNode, 1 + target.title.length)
    sel.removeAllRanges()
    sel.addRange(newRange)
    field.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
