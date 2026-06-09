import ListerRepository from '../repositories/ListerRepository.js'
import FooterHelp from '../ui/FooterHelp.js'

const PREVIEW_TEXT = 'Il était une fois une histoire extraordinaire...'

export default class StyleLister {

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
    this.eventLister = eventLister
    this.keyboardController = keyboardController
    this.options = options
    this.editing = false
    this.selectedIndex = 0
    this.domItems = []
    this.domContainer = null
    this._styles = styles
    this._initItems()
  }

  _initItems() {
    const ev = this.selectedEvent
    const checkedNames = Array.isArray(ev?.css) ? ev.css : []
    const checkedStyles = checkedNames.map(n => this._styles.find(s => s.name === n)).filter(Boolean)
    const uncheckedStyles = this._styles.filter(s => !checkedNames.includes(s.name))
    this.items = [...checkedStyles, ...uncheckedStyles]
    this._checkedNames = new Set(checkedNames)
  }

  // ── Accessors ───────────────────────────────────────────────────────

  get uiModes() { return ['stylePanel', 'modalPanel'] }

  get backgroundLister() { return this.eventLister }

  get selectedEvent() {
    return this.eventLister.items[this.eventLister.selectedIndex]
  }

  checked(style) {
    return this._checkedNames.has(style.name)
  }

  // ── Render ──────────────────────────────────────────────────────────

  render() {
    const panel = document.querySelector('#style-panel')
    panel.innerHTML = ''
    panel.classList.remove('hidden')

    const card = document.createElement('div')
    card.className = 'style-panel__inner'
    panel.appendChild(card)

    const header = document.createElement('div')
    header.className = 'panel-header'
    const titleEl = document.createElement('span')
    titleEl.className = 'panel-title'
    titleEl.textContent = `Styles · ${this.selectedEvent?.title ?? ''}`
    header.appendChild(titleEl)
    card.appendChild(header)

    FooterHelp.update(this.uiModes)

    this.domContainer = card
    this.domItems = []
    this.selectedIndex = Math.max(0, Math.min(this.selectedIndex, Math.max(0, this.items.length - 1)))

    this.items.forEach((style, idx) => {
      const el = this._createItemElement(style, idx)
      this.domItems.push(el)
      card.appendChild(el)
    })

    if (this.keyboardController) this.keyboardController.register(this)
  }

  _createItemElement(style, idx) {
    const el = document.createElement('div')
    el.className = 'panel-row style-row style-item'
    el.dataset.name = style.name

    if (this.checked(style)) el.classList.add('checked')
    if (idx === this.selectedIndex) el.classList.add('selected')

    const check = document.createElement('div')
    check.className = 'panel-check'
    check.textContent = '✓'

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

  // ── Navigation ──────────────────────────────────────────────────────

  selectItemAt(i) {
    if (i < 0 || i >= this.domItems.length) return
    this.domItems[this.selectedIndex]?.classList.remove('selected')
    this.domItems[i].classList.add('selected')
    this.selectedIndex = i
  }

  selectNextItem() {
    if (this.selectedIndex < this.items.length - 1) this.selectItemAt(this.selectedIndex + 1)
  }

  selectPreviousItem() {
    if (this.selectedIndex > 0) this.selectItemAt(this.selectedIndex - 1)
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

  moveSelectedItemDown() { this._moveSelectedItem(1) }
  moveSelectedItemUp()   { this._moveSelectedItem(-1) }

  _moveSelectedItem(direction) {
    const current = this.selectedIndex
    const target = current + direction
    if (target < 0 || target >= this.items.length) return

    const [movedItem] = this.items.splice(current, 1)
    this.items.splice(target, 0, movedItem)

    const [movedEl] = this.domItems.splice(current, 1)
    this.domItems.splice(target, 0, movedEl)

    if (direction > 0) this.domItems[target - 1]?.after(movedEl)
    else               this.domItems[target + 1]?.before(movedEl)

    this.selectedIndex = target
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
    if (titleEl) titleEl.textContent = `Styles · ${ev?.title ?? ''}`

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
    const panel = document.querySelector('#style-panel')
    panel.classList.add('hidden')
    panel.innerHTML = ''
    FooterHelp.update(this.eventLister.uiModes)
    this.keyboardController.register(this.eventLister)
  }

  // ── No-ops requis par KeyboardController ─────────────────────────────

  editSelectedItem() {}
  createNewItem() {}
  createNewItemAfter() {}
  deleteSelectedItem() {}
  copySelectedItem() {}
  cutSelectedItem() {}
  async pasteItem() {}
  leaveToParent() {}

}
