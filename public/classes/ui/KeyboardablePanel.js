export default class KeyboardablePanel {

  constructor({ title, modeType, panelClass, keyboardController }) {
    this._title           = title
    this._modeType        = modeType ?? 'keyboardable-panel'
    this._panelClass      = panelClass ?? ''
    this._kc              = keyboardController ?? null
    this._selectedIndex   = 0
    this._footerBtns      = []   // [{el, action}] dans l'ordre TAB
    this._footerFocusIdx  = -1   // -1 = focus sur les items
    this._el              = null
  }

  // ── Méthodes abstraites ──────────────────────────────────────────────────────

  _renderContent(zone)    {}
  _getItemCount()         { return 0 }
  _onEnterItem(index)     {}
  _getFooterButtons()     { return [] }  // [{label, variant, action}] ordre TAB

  // ── Ouverture / fermeture ────────────────────────────────────────────────────

  open() {
    this._selectedIndex  = 0
    this._footerFocusIdx = -1
    this._render()
    this._kc.pushMode({
      type: this._modeType,
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  close() {
    this._kc?.popMode()
    this._el?.remove()
    this._el = null
    this._kc = null
  }

  // ── Rendu ────────────────────────────────────────────────────────────────────

  _render() {
    const el = document.createElement('div')
    el.className = ('floating-panel ' + this._panelClass).trim()

    const titleEl = document.createElement('div')
    titleEl.className = 'floating-panel__title'
    titleEl.textContent = this._title
    el.appendChild(titleEl)

    const sep = document.createElement('div')
    sep.className = 'floating-panel__separator'
    el.appendChild(sep)

    const zone = document.createElement('div')
    zone.className = 'floating-panel__zone'
    this._renderContent(zone)
    el.appendChild(zone)

    this._renderFooter(el)

    this._el = el
    document.body.appendChild(el)
    this._updateItemSelection()
  }

  _renderFooter(el) {
    const buttons = this._getFooterButtons()
    if (!buttons.length) return

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'

    // Créer les spans dans l'ordre TAB (sera l'ordre de _footerBtns)
    this._footerBtns = buttons.map(({ label, variant, action }) => {
      const span = document.createElement('span')
      span.className = `panel-btn panel-btn--${variant}`
      span.textContent = label
      return { el: span, action }
    })

    // DOM order : cancel à gauche, primary à droite (␛/Fermer toujours à gauche)
    const cancelIdx  = buttons.findIndex(b => b.variant === 'cancel')
    const primaryIdx = buttons.findIndex(b => b.variant === 'primary')

    if (cancelIdx  >= 0) footer.appendChild(this._footerBtns[cancelIdx].el)
    this._footerBtns.forEach(({ el: span }, i) => {
      if (i !== cancelIdx && i !== primaryIdx) footer.appendChild(span)
    })
    if (primaryIdx >= 0) footer.appendChild(this._footerBtns[primaryIdx].el)

    el.appendChild(footer)
  }

  // ── Clavier ──────────────────────────────────────────────────────────────────

  _handleKey(event) {
    switch (event.key) {
      case 'Tab':
        event.preventDefault()
        this._footerFocusIdx++
        if (this._footerFocusIdx >= this._footerBtns.length) this._footerFocusIdx = -1
        this._updateFooterFocus()
        break

      case 'ArrowDown':
        if (this._footerFocusIdx < 0) {
          event.preventDefault()
          this._selectedIndex = Math.min(this._selectedIndex + 1, this._getItemCount() - 1)
          this._updateItemSelection()
        }
        break

      case 'ArrowUp':
        if (this._footerFocusIdx < 0) {
          event.preventDefault()
          this._selectedIndex = Math.max(this._selectedIndex - 1, 0)
          this._updateItemSelection()
        }
        break

      case 'Enter':
        event.preventDefault()
        if (this._footerFocusIdx >= 0) {
          this._footerBtns[this._footerFocusIdx]?.action()
        } else {
          this._onEnterItem(this._selectedIndex)
        }
        break
    }
  }

  _updateItemSelection() {
    const items = this._el?.querySelectorAll('.floating-panel__item') ?? []
    items.forEach((item, i) => item.classList.toggle('selected', i === this._selectedIndex))
  }

  _updateFooterFocus() {
    this._footerBtns.forEach(({ el }, i) =>
      el.classList.toggle('panel-btn--focused', i === this._footerFocusIdx)
    )
  }

}
