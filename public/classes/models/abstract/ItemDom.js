import DOM from '../../utils/DOM.js'
import LOG from '../../../system/LOG.js'

const dom = new DOM()

export default class ItemDom {
  constructor(item) { this.item = item }

  build() {
    const el = dom.buildItem(this.item)
    el.setAttribute('tabindex', '-1')
    this.el = el
    this.item.Listener.attach(el)
    return el
  }

  startEditing() {
    for (const field of this.item.PROPS ?? []) field._curvalue = this.item[field.name]
    this.el.classList.add('editing')
    const minClass = this.item.constructor.name.toLowerCase()
    for (const field of this.item.PROPS ?? []) {
      const old = this.el.querySelector(`.${minClass}-item__${field.name}`)
      if (old) old.replaceWith(dom.buildEditField(field, this.item))
    }
    this.el.querySelector('[data-field="title"]')?.focus()
  }

  revertValues() {
    for (const field of this.item.PROPS ?? []) this.item[field.name] = field._curvalue
  }

  stopEditing() {
    LOG.m(1, 'ItemDom.stopEditing START', { el: this.el?.className, connected: this.el?.isConnected })
    try {
      this.el.classList.remove('editing')
      this.el.innerHTML = ''
      for (const field of this.item.PROPS ?? []) {
        LOG.m(3, 'ItemDom.stopEditing buildField', field.name)
        const built = dom.buildField(field, this.item)
        LOG.m(3, 'ItemDom.stopEditing built', field.name, built?.tagName)
        this.el.appendChild(built)
        LOG.m(3, 'ItemDom.stopEditing appended', field.name)
      }
      this.el.focus()
      LOG.m(1, 'ItemDom.stopEditing DONE')
    } catch(e) {
      LOG.m(1, 'ItemDom.stopEditing ERREUR', e.message, e.stack)
    }
  }

  collectValues() {
    for (const field of this.item.PROPS ?? []) {
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
