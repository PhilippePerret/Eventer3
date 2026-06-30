import { raise } from '../../../system/Error.js'
import { ERRORS } from '../../../system/Locales.js'
import LOG from '../../../system/LOG.js'

export default class KeyDispatcher {

  /**
   * Dispatch keyboard event to the right method via LISTENERS table.
   * LISTENERS = { 'key': { 'nokey': 'methodName', 'meta': 'otherMethod', ... } }
   * null value = key explicitly disabled in this class.
   */
  getMethod(ev, dm) {
    const meta = ev.metaKey, alt = ev.altKey, maj = ev.shiftKey, ctrl = ev.ctrlKey
    let m = null
    if (meta) {
      if (alt  && (m = dm['meta+alt']))  return m
      if (ctrl && (m = dm['meta+ctrl'])) return m
      if (maj  && (m = dm['meta+maj']))  return m
      if ((m = dm['meta'])) return m
    } else if (alt) {
      if (ctrl && (m = dm['ctrl+alt'])) return m
      if (maj  && (m = dm['maj+alt']))  return m
      if ((m = dm['alt'])) return m
    } else if (ctrl) {
      if ((m = dm['ctrl'])) return m
    } else if ((m = dm['nokey'])) return m
    return null
  }

  attach(el) {
    el._activeKeyDispatcher?.detach()
    el._activeKeyDispatcher = this
    this._abort?.abort()
    this._abort = new AbortController()
    el.addEventListener('keydown', ev => this.onkeydown(ev), { signal: this._abort.signal })
  }

  detach() {
    this._abort?.abort()
    this._abort = null
  }

  get target() { return this }

  onkeydown(ev) {
    LOG.m(1, 'KeyDispatcher.onkeydown', { key: ev.key, listener: this.constructor.name, target: ev.target?.className })
    const dm = this.constructor.LISTENERS?.[ev.key] ?? this.constructor.LISTENERS?.[ev.key.toLowerCase()]
    if (!dm) return
    const method = this.getMethod(ev, dm)
    if (!method) return
    this.target[method] || raise(ERRORS[100], ev.key, ev, this)
    ev.preventDefault()
    if (this.target[method](ev) !== false) ev.stopPropagation()
  }

}
