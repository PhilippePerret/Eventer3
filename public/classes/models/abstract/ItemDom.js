import DOM from '../../utils/DOM.js'
import LOG from '../../../system/LOG.js'

const dom = new DOM()

export default class ItemDom {
  constructor(item) { this.item = item }

  get minClass() { return this.item.constructor.name.toLowerCase() }

  build() {
    const el = document.createElement('div')
    el.className = `${this.minClass}-item`
    el.dataset.id = this.item.id
    el.setAttribute('tabindex', '-1')
    this._buildContent(el)
    this.el = el
    this.item.Listener.attach(el)
    return el
  }

  _buildContent(el) {
    const minClass = this.minClass

    const gutter = document.createElement('div')
    gutter.className = `item-check-gutter ${minClass}-check-gutter`
    const checkEl = document.createElement('span')
    checkEl.className = `item-check ${minClass}-check`
    checkEl.textContent = this.item.checked ? '✓' : ''
    gutter.appendChild(checkEl)
    el.appendChild(gutter)

    const body = document.createElement('div')
    body.className = `item-body ${minClass}-body`
    const groups = {}
    for (const field of this.item.PROPS) {
      const w = field.warper
      if (!w || w === 'body') {
        body.appendChild(dom.buildField(field, this.item))
      } else {
        if (!groups[w]) {
          groups[w] = document.createElement('div')
          groups[w].className = `item-${w} ${minClass}-${w}`
          body.appendChild(groups[w])
        }
        groups[w].appendChild(dom.buildField(field, this.item))
      }
    }
    el.appendChild(body)
  }

  startEditing() {
    for (const field of this.item.PROPS) field._curvalue = this.item[field.name]
    this.el.classList.add('editing')
    for (const field of this.item.PROPS) {
      const cls = field.cssClass ?? (field.warper ? `${this.minClass}-${field.name}` : `${this.minClass}-item__${field.name}`)
      const old = this.el.querySelector(`.${cls}`)
      if (old) old.replaceWith(dom.buildEditField(field, this.item))
    }
    this.el.querySelector('[data-field="title"]')?.focus()
  }

  revertValues() {
    for (const field of this.item.PROPS) this.item[field.name] = field._curvalue
  }

  stopEditing() {
    LOG.m(1, 'ItemDom.stopEditing START')
    try {
      this.el.classList.remove('editing')
      this.el.innerHTML = ''
      this._buildContent(this.el)
      this.el.focus()
      LOG.m(1, 'ItemDom.stopEditing DONE')
    } catch(e) {
      LOG.m(1, 'ItemDom.stopEditing ERREUR', e.message, e.stack)
    }
  }

  collectValues() {
    for (const field of this.item.PROPS) {
      if (field.type !== 'text') continue
      const el = this.el.querySelector(`[data-field="${field.name}"]`)
      if (el) this.item[field.name] = el.textContent
    }
  }

  focusNextField() {
    const fields = [...this.el.querySelectorAll('[data-field]')]
    const idx = fields.indexOf(document.activeElement)
    fields[(idx + 1) % fields.length]?.focus()
  }
}
