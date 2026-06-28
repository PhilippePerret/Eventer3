import Lister from './Lister.js'
import ListerRepository from '../repositories/ListerRepository.js'
import ContextualHelp from '../ui/ContextualHelp.js'

const PREVIEW_TEXT = 'Il était une fois une histoire extraordinaire...'

export default class StyleLister extends Lister {

  // ── Static ──────────────────────────────────────────────────────────

  static async open(eventLister, options = {}) {
    const styles = await StyleLister.loadStyles()
    const styleLister = new StyleLister({ eventLister, styles, keyboardController: eventLister.keyboardController, options })
    styleLister.render()
  }

  static async loadStyles() {
    const res = await fetch('/api/themes', { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  }

  static applyToEventElement(event, eventEl, styles) {
    if (!eventEl) return
    const styleId = `ev-style-${event.id}`
    let styleEl = document.getElementById(styleId)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    const css = Array.isArray(event.css) ? event.css : []
    if (css.length === 0) {
      styleEl.textContent = ''
      return
    }
    const rules = css
      .map(name => {
        const style = styles.find(s => s.name === name)
        return style ? `.event-item[data-id="${event.id}"] .event-text { ${style.css} }` : ''
      })
      .filter(Boolean)
      .join('\n')
    const selectedRule = `.event-item[data-id="${event.id}"].selected:not(.editing) .event-text { color: white !important; }`
    styleEl.textContent = rules + '\n' + selectedRule
  }

  // ── Constructor ─────────────────────────────────────────────────────

  constructor({ eventLister, styles, keyboardController, options = {} }) {
    super({ type: 'styles', keyboardController })
    this.eventLister = eventLister
    this.options = options
    this._styles = styles
    this._initItems()
  }

  // ── Filter ──────────────────────────────────────────────────────────

  get filterField() { return 'name' }

  // ── Accessors ───────────────────────────────────────────────────────

  get uiModes() { return ['stylePanel', 'modalPanel'] }

  get backgroundLister() { return this.eventLister }

  get selectedEvent() {
    return this.eventLister.items[this.eventLister.selectedIndex]
  }

  checked(style) {
    return this._checkedNames.has(style.name)
  }

  // ── Items init ──────────────────────────────────────────────────────

  _initItems() {
    const ev = this.selectedEvent
    const checkedNames = Array.isArray(ev?.css) ? ev.css : []
    const checkedStyles = checkedNames.map(n => this._styles.find(s => s.name === n)).filter(Boolean)
    const uncheckedStyles = this._styles.filter(s => !checkedNames.includes(s.name))
    this.items = [...checkedStyles, ...uncheckedStyles]
    this._checkedNames = new Set(checkedNames)
    this._initialCss = [...checkedNames]
  }

  // ── Render ──────────────────────────────────────────────────────────

  render() {
    ContextualHelp.setContext('style-list')
    const panel = document.querySelector('#style-panel')
    panel.innerHTML = ''
    panel.classList.remove('hidden')

    const card = document.createElement('div')
    card.className = 'style-panel__inner floating-panel'
    panel.appendChild(card)

    this._renderPanelHeader(card, '')
    const titleEl = card.querySelector('.panel-title')
    if (titleEl) titleEl.innerHTML = `Styles · ${this.selectedEvent?.renderedTitle ?? ''}`

    this.domContainer = card
    this.domItems = []
    this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, Math.max(0, this.items.length - 1)))

    this.items.forEach((style, idx) => {
      const el = this._createItemElement(style, idx)
      this.domItems.push(el)
      card.appendChild(el)
    })

    this._renderFooter(card)

    if (this.keyboardController) this.keyboardController.register(this)
  }

  _renderFooter(card) {
    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'

    const escBtn = document.createElement('span')
    escBtn.className = 'panel-footer-key'
    escBtn.textContent = '␛ Fermer'

    const hints = document.createElement('span')
    hints.style.display = 'flex'
    hints.style.gap = '12px'

    const hint1 = document.createElement('span')
    hint1.className = 'panel-footer-hint'
    hint1.textContent = '↩︎/␣ Choisir'

    const hint2 = document.createElement('span')
    hint2.className = 'panel-footer-hint'
    hint2.textContent = '⌘↓/⌘↑ Déplacer'

    hints.appendChild(hint1)
    hints.appendChild(hint2)

    const applyBtn = document.createElement('span')
    applyBtn.className = 'panel-footer-key'
    applyBtn.textContent = '⌘ ↩︎ Appliquer'

    footer.appendChild(escBtn)
    footer.appendChild(hints)
    footer.appendChild(applyBtn)
    card.appendChild(footer)
  }

  _createItemElement(style, idx) {
    const el = document.createElement('div')
    el.className = 'panel-row style-row style-item'
    el.dataset.name = style.name

    if (this.checked(style)) el.classList.add('checked')
    if (idx === this.selectedIndex) el.classList.add('selected')

    const check = document.createElement('div')
    check.className = 'panel-check'
    const letter = String.fromCharCode(97 + idx)
    check.innerHTML = `<span class="style-item__letter">${letter}</span><span class="style-item__checkmark">✓</span>`

    const preview = document.createElement('div')
    preview.className = 'style-item__preview'
    preview.textContent = PREVIEW_TEXT
    if (style.css) preview.style.cssText = style.css

    el.appendChild(check)
    el.appendChild(preview)

    el.addEventListener('click', () => {
      const i = this.domItems.indexOf(el)
      if (i >= 0) this.selectItemAt(i)
    })

    return el
  }

  // ── Toggle ──────────────────────────────────────────────────────────

  toggleSelectedItemChecked() {
    const style = this.items[this.selectedIndex]
    const el = this.domItems[this.selectedIndex]
    if (!style || !el) return
    if (this._checkedNames.has(style.name)) {
      this._checkedNames.delete(style.name)
      el.classList.remove('checked')
    } else {
      this._checkedNames.add(style.name)
      el.classList.add('checked')
    }
    this._syncEventCss()
  }

  // ── Move ────────────────────────────────────────────────────────────

  _onAfterMoveItem() {
    this._syncEventCss()
  }

  // ── CSS sync ────────────────────────────────────────────────────────

  _syncEventCss() {
    const ev = this.selectedEvent
    if (!ev) return
    ev.css = this.items.filter(s => this._checkedNames.has(s.name)).map(s => s.name)
    const eventEl = this.eventLister.domItems[this.eventLister.selectedIndex]
    StyleLister.applyToEventElement(ev, eventEl, this._styles)
    void this._saveEventCss(ev)
  }

  async _saveEventCss(ev) {
    await ListerRepository.saveItem(ev, { css: ev.css })
  }

  // ── Background selection change ──────────────────────────────────────

  onBackgroundSelectionChange() {
    const ev = this.selectedEvent
    const titleEl = this.domContainer?.querySelector('.panel-title')
    if (titleEl) titleEl.innerHTML = `Styles · ${ev?.renderedTitle ?? ''}`

    this._initItems()
    this.selectedIndex = 0

    this.domItems.forEach(el => el.remove())
    this.domItems = []

    this.items.forEach((style, idx) => {
      const el = this._createItemElement(style, idx)
      this.domItems.push(el)
      this.domContainer.appendChild(el)
    })
  }

  // ── Close ────────────────────────────────────────────────────────────

  close() {
    ContextualHelp.restoreContext()
    const panel = document.querySelector('#style-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    this.keyboardController.register(this.eventLister)
  }

  // ── Cancel (Escape) ──────────────────────────────────────────────────

  cancel() {
    const ev = this.selectedEvent
    if (ev) {
      ev.css = [...this._initialCss]
      const eventEl = this.eventLister.domItems[this.eventLister.selectedIndex]
      StyleLister.applyToEventElement(ev, eventEl, this._styles)
      void this._saveEventCss(ev)
    }
    this.close()
  }

  // ── Lettre → toggle à l'index ────────────────────────────────────────

  handleLetterKey(letter) {
    const idx = letter.charCodeAt(0) - 97
    if (idx < 0 || idx >= this.items.length) return false
    const style = this.items[idx]
    const el = this.domItems[idx]
    if (!style || !el) return false
    if (this._checkedNames.has(style.name)) {
      this._checkedNames.delete(style.name)
      el.classList.remove('checked')
    } else {
      this._checkedNames.add(style.name)
      el.classList.add('checked')
    }
    this._syncEventCss()
    return true
  }

  // ── No-ops requis par KeyboardController ─────────────────────────────

  editSelectedItem() { this.toggleSelectedItemChecked() }
  createNewItem() {}
  createNewItemAfter() {}
  deleteSelectedItem() {}
  copySelectedItem() {}
  cutSelectedItem() {}
  async pasteItem() {}
  leaveToParent() {}

}
