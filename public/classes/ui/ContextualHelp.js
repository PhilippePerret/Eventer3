import KeyboardablePanel from './KeyboardablePanel.js'
import { HELP_PER_CONTEXT } from '../../constants/contextual_help.js'

export default class ContextualHelp extends KeyboardablePanel {

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

  static open(item) { new ContextualHelp(item).open() }

  constructor(item) {
    super({ panelClass: 'contextual-help' })
    this._item       = item
    this.itemMode = item.editing ? 'editing' : 'list'
    this._contextKey = `${item.minClass}-${this.itemMode}`
    console.log("Contexte d'aide demandé : %s", this._contextKey)
    this._shortcuts  = []
    this._renderItems = []
    this._buildShortcuts()
    const ctx = HELP_PER_CONTEXT[this._contextKey]
    this._title = ContextualHelp._resolveTemplate(ctx?.title ?? '— Contexte non défini', ctx)
  }

  _getFooterButtons() {
    return [
      { label: '↩︎ Jouer', type: 'play',  action: () => this._playSelected() },
      { label: 'Fermer',   type: 'close', action: () => this.close()         }
    ]
  }

  _getItemCount() { return this._shortcuts.length }

  _renderContent(zone) {
    zone.classList.add('contextual-help__list')
    const ctx     = HELP_PER_CONTEXT[this._contextKey]
    const resolve = (text) => ContextualHelp._resolveTemplate(text, ctx)
    let currentGroup = null

    for (const item of this._renderItems) {
      if (item.__group_end) { currentGroup = null; continue }
      if (item.__section) {
        currentGroup = document.createElement('div')
        currentGroup.className = 'contextual-help__group'
        const legend = document.createElement('div')
        legend.className   = 'contextual-help__group-title'
        legend.textContent = resolve(item.title)
        currentGroup.appendChild(legend)
        zone.appendChild(currentGroup)
        continue
      }
      const row = document.createElement('div')
      row.className = 'contextual-help__row ftpanel__item'
      const kbd = document.createElement('kbd')
      kbd.className   = 'contextual-help__key'
      kbd.textContent = item.sc
      const ef = document.createElement('span')
      ef.className   = 'contextual-help__effect'
      ef.textContent = resolve(item.ef)
      row.appendChild(kbd)
      row.appendChild(ef)
      ;(currentGroup ?? zone).appendChild(row)
    }
  }

  close() {
    super.close()
    this._item.el?.focus()
  }

  _onEnterItem(index) {
    const sc = this._shortcuts[index]
    this.close()
    if (sc?.key) {
      const ev = new KeyboardEvent('keydown', {
        key:      sc.key,
        metaKey:  sc.metaKey  ?? false,
        shiftKey: sc.shiftKey ?? false,
        altKey:   sc.altKey   ?? false,
        ctrlKey:  sc.ctrlKey  ?? false,
        bubbles:  true,
      })
      this._item.el?.dispatchEvent(ev)
    }
  }

  _playSelected() { this._onEnterItem(this._selectedIndex) }

  _buildShortcuts() {
    const ctx = HELP_PER_CONTEXT[this._contextKey]
    if (!ctx) {
      const fallback = { sc: '—', ef: 'Raccourcis à définir' }
      this._renderItems = [fallback]
      this._shortcuts   = [fallback]
      return
    }

    const expand = (shortcuts, except = []) => {
      for (const sc of (shortcuts ?? [])) {
        if (sc.context) {
          const sub = HELP_PER_CONTEXT[sc.context]
          if (!sub) continue
          if (sub.title) this._renderItems.push({ __section: true, title: sub.title })
          expand(sub.shortcuts, sc.except ?? [])
        } else {
          if (except.includes(sc.sc)) continue
          this._renderItems.push(sc)
          this._shortcuts.push(sc)
        }
      }
    }

    for (const otherKey of (ctx.other_contexts ?? [])) {
      const other = HELP_PER_CONTEXT[otherKey]
      if (!other) continue
      if (other.title) this._renderItems.push({ __section: true, title: other.title })
      expand(other.shortcuts)
    }
    expand(ctx.shortcuts)
  }

}
