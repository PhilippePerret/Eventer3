import { HELP_PER_CONTEXT } from '../../constants.js'

export default class ContextualHelp {

  // ── Cache de résolution de templates ──────────────────────────
  static _templateCache = new WeakMap()

  static _resolveTemplate(text, ctx) {
    if (!text) return ''
    if (!ctx) return text.replace(/\{[^}]+\}/g, '')
    let cache = this._templateCache.get(ctx)
    if (!cache) { cache = new Map(); this._templateCache.set(ctx, cache) }
    if (cache.has(text)) return cache.get(text)
    const wf = ctx.wf
    const result = text.replace(/\{wf\.(\w+)\}|\{(\w+)\}/g, (match, wfKey, directKey) => {
      if (wfKey) return wf?.[wfKey] ?? ''
      return String(ctx[directKey] ?? '')
    })
    cache.set(text, result)
    return result
  }

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
    this._shortcuts         = []  // raccourcis navigables (sans en-têtes)
    this._items             = []  // liste de rendu (shortcuts + en-têtes de section)
  }

  _buildShortcuts() {
    const ctx = HELP_PER_CONTEXT[ContextualHelp.currentContext]
    if (!ctx) {
      const fallback = { sc: '—', ef: 'Raccourcis à définir' }
      this._items     = [fallback]
      this._shortcuts = [fallback]
      return
    }
    const expand = (shortcuts, except = []) => {
      for (const sc of (shortcuts ?? [])) {
        if (sc.context) {
          const sub = HELP_PER_CONTEXT[sc.context]
          if (!sub) continue
          if (sub.title) this._items.push({ __section: true, title: sub.title })
          expand(sub.shortcuts, sc.except ?? [])
        } else {
          if (except.includes(sc.sc)) continue
          this._items.push(sc)
          this._shortcuts.push(sc)
        }
      }
    }
    for (const otherKey of (ctx.other_contexts ?? [])) {
      const other = HELP_PER_CONTEXT[otherKey]
      if (!other) continue
      if (other.title) this._items.push({ __section: true, title: other.title })
      expand(other.shortcuts)
    }
    expand(ctx.shortcuts)

    const clipboard   = this.keyboardController?.clipboard
    const activeLister = this.keyboardController?.activeLister
    if (clipboard && activeLister && clipboard.minClass === activeLister.itemClass?.minClass) {
      const wf         = activeLister.itemClass.thingName
      const isMultiple = Array.isArray(clipboard.data)
      const ef         = 'Coller ' + (isMultiple ? 'les ' + wf.things : wf.the + wf.thing)
      const paste = { sc: '⌘ + v', ef, key: 'v', metaKey: true }
      this._items.unshift(
        { __section: true, title: 'Presse-papier' },
        paste,
        { __group_end: true }
      )
      this._shortcuts.unshift(paste)
    }
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
    const resolve = (text) => ContextualHelp._resolveTemplate(text, ctx)

    this._overlay = document.createElement('div')
    this._overlay.className = 'contextual-help-overlay'

    this._el = document.createElement('div')
    this._el.className = 'contextual-help'

    const title = document.createElement('div')
    title.className   = 'contextual-help__title'
    title.textContent = resolve(ctx?.title ?? '— Contexte non défini')
    this._el.appendChild(title)

    const list = document.createElement('div')
    list.className = 'contextual-help__list'

    let rowIndex    = 0
    let currentGroup = null
    this._items.forEach((item) => {
      if (item.__group_end) { currentGroup = null; return }
      if (item.__section) {
        currentGroup = document.createElement('div')
        currentGroup.className = 'contextual-help__group'
        const legend = document.createElement('div')
        legend.className   = 'contextual-help__group-title'
        legend.textContent = resolve(item.title)
        currentGroup.appendChild(legend)
        list.appendChild(currentGroup)
        return
      }
      const row = document.createElement('div')
      row.className = 'contextual-help__row'
      if (rowIndex === 0) row.classList.add('selected')

      const kbd = document.createElement('kbd')
      kbd.className   = 'contextual-help__key'
      kbd.textContent = item.sc

      const ef = document.createElement('span')
      ef.className   = 'contextual-help__effect'
      ef.textContent = resolve(item.ef)

      row.appendChild(kbd)
      row.appendChild(ef)
      ;(currentGroup ?? list).appendChild(row)
      rowIndex++
    })

    this._el.appendChild(list)

    const footer = document.createElement('div')
    footer.className = 'contextual-help__footer'

    const applyHint = document.createElement('span')
    applyHint.className   = 'contextual-help__apply-hint'
    applyHint.textContent = '↩︎ Appliquer le raccourci sélectionné'
    footer.appendChild(applyHint)

    const closeBtn = document.createElement('div')
    closeBtn.className   = 'panel-footer-key contextual-help__close-btn'
    closeBtn.textContent = '⌘ ↩︎ Fermer'
    closeBtn.addEventListener('click', () => this._close())
    footer.appendChild(closeBtn)
    this._el.appendChild(footer)

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
        if (event.metaKey) { this._close(); break }
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
