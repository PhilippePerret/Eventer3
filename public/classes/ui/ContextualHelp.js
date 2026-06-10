import { HELP_PER_CONTEXT } from '../../constants.js'

export default class ContextualHelp {

  // ── Pile de contextes ──────────────────────────────────────────
  static _stack = []

  static get currentContext() {
    return this._stack[this._stack.length - 1] ?? null
  }

  static setContext(key) {
    this._stack.push(key)
  }

  static resetContext(key) {
    this._stack = [key]
  }

  static restoreContext() {
    this._stack.pop()
  }

  // ── Ouverture du panneau ───────────────────────────────────────
  static open(keyboardController) {
    new ContextualHelp(keyboardController)._init()
  }

  constructor(keyboardController) {
    this.keyboardController = keyboardController
    this._selectedIndex     = 0
    this._shortcuts         = []
  }

  _buildShortcuts() {
    const ctx = HELP_PER_CONTEXT[ContextualHelp.currentContext]
    if (!ctx) {
      this._shortcuts = [{ sc: '—', ef: 'Raccourcis à définir' }]
      return
    }
    for (const otherKey of (ctx.other_contexts ?? [])) {
      const other = HELP_PER_CONTEXT[otherKey]
      if (other?.shortcuts) this._shortcuts.push(...other.shortcuts)
    }
    this._shortcuts.push(...(ctx.shortcuts ?? []))
  }

  _init() {
    this._buildShortcuts()
    this._buildDOM()
    this.keyboardController.pushMode({
      type: 'contextual-help',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    const ctx = HELP_PER_CONTEXT[ContextualHelp.currentContext]

    this._overlay = document.createElement('div')
    this._overlay.className = 'contextual-help-overlay'

    this._el = document.createElement('div')
    this._el.className = 'contextual-help'

    const title = document.createElement('div')
    title.className   = 'contextual-help__title'
    title.textContent = ctx?.title ?? '— Contexte non défini'
    this._el.appendChild(title)

    const list = document.createElement('div')
    list.className = 'contextual-help__list'

    this._shortcuts.forEach((sc, i) => {
      const row = document.createElement('div')
      row.className = 'contextual-help__row'
      if (i === 0) row.classList.add('selected')

      const kbd = document.createElement('kbd')
      kbd.className   = 'contextual-help__key'
      kbd.textContent = sc.sc

      const ef = document.createElement('span')
      ef.className   = 'contextual-help__effect'
      ef.textContent = sc.ef

      row.appendChild(kbd)
      row.appendChild(ef)
      list.appendChild(row)
    })

    this._el.appendChild(list)
    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
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
      case 'Enter': {
        const sc = this._shortcuts[this._selectedIndex]
        this._close()
        if (sc?.key) {
          const synthetic = new KeyboardEvent('keydown', {
            key:      sc.key,
            metaKey:  sc.metaKey  ?? false,
            shiftKey: sc.shiftKey ?? false,
            altKey:   sc.altKey   ?? false,
            ctrlKey:  sc.ctrlKey  ?? false,
            bubbles:  true,
          })
          this.keyboardController.onKeyDown(synthetic)
        }
        break
      }
      case 'Escape':
        this._close()
        break
    }
  }

  _selectAt(i) {
    const rows = this._el.querySelectorAll('.contextual-help__row')
    rows[this._selectedIndex]?.classList.remove('selected')
    this._selectedIndex = Math.max(0, Math.min(i, rows.length - 1))
    rows[this._selectedIndex]?.classList.add('selected')
    rows[this._selectedIndex]?.scrollIntoView({ block: 'nearest' })
  }

  _close() {
    this.keyboardController.popMode()
    this._overlay.remove()
  }

}
