import DOM from '../../utils/DOM.js'
import LOG from '../../../system/LOG.js'

const dom = new DOM()

export default {

  get minClass() { return this.constructor.name.toLowerCase() },

  openBrinPanel()  { dom.openBrinPanel(this) },
  openPersoPanel() { dom.openPersoPanel(this) },

  build() {
    LOG.m(1, 'Item.build', this.constructor.name, this.id)
    const el = document.createElement('div')
    el.className = `${this.minClass}-item`
    el.dataset.id = this.id
    el.setAttribute('tabindex', '-1')
    this._buildContent(el)
    this.el = el
    this.attach(el)
    return el
  },

  _buildContent(el) {
    const minClass = this.minClass

    const gutter = document.createElement('div')
    gutter.className = `item-check-gutter ${minClass}-check-gutter`
    const checkEl = document.createElement('span')
    checkEl.className = `item-check ${minClass}-check`
    checkEl.textContent = this.checked ? '✓' : ''
    gutter.appendChild(checkEl)
    el.appendChild(gutter)

    const body = document.createElement('div')
    body.className = `item-body ${minClass}-body${this.lister_id ? ' child-indicator' : ''}`
    const groups = {}
    for (const field of this.PROPS) {
      const w = field.warper
      if (!w || w === 'body') {
        body.appendChild(dom.buildField(field, this))
      } else {
        if (!groups[w]) {
          groups[w] = document.createElement('div')
          groups[w].className = `item-${w} ${minClass}-${w}`
          body.appendChild(groups[w])
        }
        groups[w].appendChild(dom.buildField(field, this))
      }
    }
    el.appendChild(body)
  },

  startEditing() {
    LOG.m(1, 'Item.startEditing', { id: this.id })
    this.editing = true
    for (const field of this.PROPS) field._curvalue = this[field.name]
    this.el.classList.add('editing')
    for (const field of this.PROPS) {
      const cls = field.cssClass ?? (field.warper ? `${this.minClass}-${field.name}` : `${this.minClass}-item__${field.name}`)
      const old = this.el.querySelector(`.${cls}`)
      if (old) old.replaceWith(dom.buildEditField(field, this))
    }
    this.el.querySelector('[data-field="title"]')?.focus()
  },

  revertValues() {
    for (const field of this.PROPS) this[field.name] = field._curvalue
  },

  _stopEditing() {
    LOG.m(1, 'Item._stopEditing', { id: this.id })
    this.editing = false
    try {
      this.el.classList.remove('editing')
      this.el.innerHTML = ''
      this._buildContent(this.el)
      this.el.focus()
      LOG.m(1, 'Item._stopEditing DONE')
    } catch(e) {
      LOG.m(1, 'Item._stopEditing ERREUR', e.message, e.stack)
    }
  },

  collectValues() {
    for (const field of this.PROPS) {
      if (field.type !== 'text') continue
      const el = this.el.querySelector(`[data-field="${field.name}"]`)
      if (el) this[field.name] = el.textContent
    }
  },

  focusNextField() {
    const fields = [...this.el.querySelectorAll('[data-field]')]
    const idx = fields.indexOf(document.activeElement)
    fields[(idx + 1) % fields.length]?.focus()
  },

}
