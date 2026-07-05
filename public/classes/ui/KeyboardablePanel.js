import { stopEvent } from '../utils/events.js'
import { movePanel, movablePanelInner } from '../utils/panelMove.js'
import LOG from '../../system/LOG.js'

export default class KeyboardablePanel {

  static HANDLED_KEYS     = { Tab: true, ArrowDown: true, ArrowUp: true, Enter: true, ' ': true }
  static NOT_STOPPED_KEYS = {}

  constructor({ title, panelClass } = {}) {
    this._title          = title ?? ''
    this._panelClass     = panelClass ?? ''
    this._selectedIndex  = 0
    this._footerBtns     = []
    this._footerFocusIdx = -1
    this._el             = null
    this._boundKeyDown   = null
  }

  // ── Méthodes abstraites ──────────────────────────────────────────────────────

  _renderContent(zone)  {}
  _getItemCount()       { return 0 }
  _onEnterItem(index)   {}
  _getFooterButtons()   { return [] }  // [{label, variant, action}] ordre TAB

  // ── Ouverture / fermeture ────────────────────────────────────────────────────

  open() {
    this._previousFocus  = document.activeElement
    this._selectedIndex  = 0
    this._footerFocusIdx = this._getItemCount() > 0 ? -1 : 0
    this._render()
    this._updateFooterFocus()
    this._boundKeyDown = (e) => this._handleKey(e)
    this._el.addEventListener('keydown', this._boundKeyDown, { capture: true })
    this._el.focus()
  }

  close() {
    this._el.removeEventListener('keydown', this._boundKeyDown, { capture: true })
    this._boundKeyDown = null
    this._el?.remove()
    this._el = null
    this._previousFocus?.focus()
    this._previousFocus = null
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  _render() {
    const el = document.createElement('div')
    el.className = ('ftpanel kpanel ' + this._panelClass).trim()
    el.setAttribute('tabindex', '-1')

    const titleEl = document.createElement('div')
    titleEl.className   = ('ftpanel__title' + (this._panelClass ? ' ' + this._panelClass + '__title' : ''))
    titleEl.textContent = this._title
    el.appendChild(titleEl)

    const body = document.createElement('div')
    body.className = 'ftpanel__body'
    this._renderContent(body)
    el.appendChild(body)

    this._renderFooter(el)

    this._el = el
    LOG.m(1, 'KeyboardablePanel._render appending', this._panelClass, 'to body, body exists=', !!document.body)
    document.body.appendChild(el)
    LOG.m(1, 'KeyboardablePanel._render done, el in DOM=', document.body.contains(el))
    this._updateItemSelection()
  }

  _renderFooter(el) {
    const buttons = this._getFooterButtons()
    if (!buttons.length) return

    const footer = document.createElement('div')
    footer.className = 'ftpanel__footer'

    this._footerBtns = buttons.map(({ label, type, action }) => {
      const span = document.createElement('span')
      span.className = type ? `ftpanel-btn ftpanel-btn--${type}` : 'ftpanel-btn'
      span.textContent = label
      return { el: span, action }
    })

    for (let i = this._footerBtns.length - 1; i >= 0; i--) {
      footer.appendChild(this._footerBtns[i].el)
    }

    el.appendChild(footer)
  }

  // ── Clavier ──────────────────────────────────────────────────────────────────

  _handleKey(event) {
    if (event.ctrlKey && event.shiftKey && !event.metaKey && !event.altKey &&
        ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      stopEvent(event)
      movePanel(this._el, event.key)
      return
    }
    const keyAction = this._footerKeyMap?.[event.key]
    if (keyAction) { stopEvent(event); keyAction(); return }
    if (!KeyboardablePanel.HANDLED_KEYS[event.key]) return
    if (!KeyboardablePanel.NOT_STOPPED_KEYS[event.key]) stopEvent(event)

    switch (event.key) {
      case 'Tab':
        stopEvent(event)
        this._footerFocusIdx++
        if (this._footerFocusIdx >= this._footerBtns.length) {
          this._footerFocusIdx = this._getItemCount() > 0 ? -1 : 0
        }
        this._updateFooterFocus()
        break

      case 'ArrowDown':
        if (this._footerFocusIdx < 0) {
          this._selectedIndex = Math.min(this._selectedIndex + 1, this._getItemCount() - 1)
          this._updateItemSelection()
        }
        break

      case 'ArrowUp':
        if (this._footerFocusIdx < 0) {
          this._selectedIndex = Math.max(this._selectedIndex - 1, 0)
          this._updateItemSelection()
        }
        break

      case 'Enter':
        if (event.metaKey) { this.close(); break }
        if (this._footerFocusIdx >= 0) {
          this._footerBtns[this._footerFocusIdx]?.action()
        } else {
          this._onEnterItem(this._selectedIndex)
        }
        break

      case ' ':
        /* TODO: cocher l'item sélectionné si cochable */
        break
    }
  }

  _updateItemSelection() {
    const items = this._el?.querySelectorAll('.ftpanel__item') ?? []
    items.forEach((item, i) => item.classList.toggle('selected', i === this._selectedIndex))
  }

  _updateFooterFocus() {
    this._footerBtns.forEach(({ el }, i) =>
      el.classList.toggle('ftpanel-btn--focused', i === this._footerFocusIdx)
    )
  }

}
