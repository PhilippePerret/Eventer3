import { SHORTCUTS } from '../../constants.js'

export default class ShortcutsPanel {

  constructor() {
    this.el = document.querySelector('#shortcuts-panel')
    this.contextIndex = 0
    this.contexts = SHORTCUTS
  }

  get isVisible() {
    return !this.el.classList.contains('hidden')
  }

  open() {
    this._render()
    this.el.classList.remove('hidden')
  }

  close() {
    this.el.classList.add('hidden')
  }

  nextContext() {
    if (this.contextIndex < this.contexts.length - 1) {
      this.contextIndex++
      this._render()
    }
  }

  previousContext() {
    if (this.contextIndex > 0) {
      this.contextIndex--
      this._render()
    }
  }

  _render() {
    const ctx = this.contexts[this.contextIndex]
    if (!ctx) return
    const nav = this.contexts.length > 1
      ? `<p class="shortcuts-panel__nav">⌘↑↓ — contexte ${this.contextIndex + 1}/${this.contexts.length}</p>`
      : ''
    const rows = (ctx.shortcuts ?? []).map(({ sc, ef }) =>
      `<tr><td class="sc-key">${sc}</td><td class="sc-effect">${ef}</td></tr>`
    ).join('')
    this.el.innerHTML = `
      <div class="shortcuts-panel__inner">
        <h2 class="shortcuts-panel__title">${ctx.contextName}</h2>
        ${nav}
        <table class="shortcuts-panel__table"><tbody>${rows}</tbody></table>
        <p class="shortcuts-panel__close">⌘↩︎ pour fermer</p>
      </div>
    `
  }

}
