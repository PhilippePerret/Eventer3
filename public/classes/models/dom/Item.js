import DOM from '../../utils/DOM.js'
import LOG from '../../../system/LOG.js'

const dom = new DOM()

export default {

  get minClass() { return this.constructor.name.toLowerCase() },

  build() {
    LOG.m(1, 'Item.build', this.constructor.name, this.id)
    const el = document.createElement('div')
    el.className = `${this.minClass}-item`
    el.dataset.id = this.id
    el.setAttribute('tabindex', '-1')
    if (this === this.parentLister?.items[this.parentLister?.selectedIndex]) el.classList.add('selected')
    if (this.checked)   el.classList.add('checked')
    if (this.inherited) el.classList.add('inherited')
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
    checkEl.className = `item-check ${minClass}-check panel-check`
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
    this.editing = true
    for (const field of this.PROPS) field._curvalue = this[field.name]
    this._editingFields = []
    this._editingFieldIdx = 0
    this.el.classList.add('editing')
    for (const field of this.PROPS) {
      if (field.type === 'no-edit') continue
      const cls = field.cssClass ?? (field.warper ? `${this.minClass}-${field.name}` : `${this.minClass}-item__${field.name}`)
      const old = this.el.querySelector(`.${cls}`)
      if (!old) continue
      const editEl = dom.buildEditField(field, this)
      old.replaceWith(editEl)
      this._editingFields.push(editEl)
    }
    this._editingFields[0]?.focus()
  },

  revertValues() {
    for (const field of this.PROPS) this[field.name] = field._curvalue
  },

  _stopEditing() {
    this.editing = false
    this._editingFields = []
    this._editingFieldIdx = 0
    try {
      this.el.classList.remove('editing')
      this.el.innerHTML = ''
      this._buildContent(this.el)
      this.el.focus()
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
    if (this._editingFields.length < 2) return
    this._editingFieldIdx = (this._editingFieldIdx + 1) % this._editingFields.length
    this._editingFields[this._editingFieldIdx]?.focus()
  },

  colorFor(index) {
    const colors = this.constructor.COLORS
    if (!colors?.length) return null
    return colors[index % colors.length]
  },

  customInit(index) {
    this.color = this.colorFor(index)
  },

  toggleChecked() {
    const item = this
    this.checked = !this.checked
    this.el?.classList.toggle('checked', this.checked)
    const checkEl = this.el?.querySelector('.panel-check')
    if (checkEl) checkEl.textContent = this.checked ? '✓' : ''
    this._afterToggle(this, ctx) //????
    ctx.scheduleSave() // ??????
  }

}
