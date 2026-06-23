import PopupSelect from '../ui/PopupSelect.js'
export { StopEvent } from './events.js'

export default class DOM {

  buildTextField(field, item) {
    const el = this._fieldEl(field, item)
    el.textContent = item[field.name] ?? ''
    return el
  }

  buildSelect(field, item) {
    const el = this._fieldEl(field, item)
    el.classList.add('display-select')
    const val = item[field.name]
    const found = (field.values ?? []).find(v => v.value === val)
    el.textContent = found ? (found.label ?? found.name ?? val) : (val ?? '---')
    this._applyValuesWidth(el, field)
    return el
  }

  buildEditTextField(field, item) {
    const el = this._fieldEl(field, item)
    el.setAttribute('contenteditable', 'true')
    el.setAttribute('data-field', field.name)
    el.setAttribute('tabindex', '0')
    el.textContent = item[field.name] ?? ''
    return el
  }

  buildEditSelectField(field, item) {
    const el = this._fieldEl(field, item)
    el.classList.add('display-select')
    el.setAttribute('data-field', field.name)
    el.setAttribute('tabindex', '0')
    const found = (field.values ?? []).find(v => v.value === item[field.name])
    el.textContent = found ? (found.label ?? found.name ?? item[field.name]) : (item[field.name] ?? '---')

    const popup = new PopupSelect({
      options: field.values,
      currentValue: item[field.name],
      multi: field.multiple ?? false,
      onSelect: val => {
        item[field.name] = val
        const f = (field.values ?? []).find(v => v.value === val)
        el.textContent = f ? (f.label ?? f.name ?? val) : val
        el.focus()
        if (field.onchange) item[field.onchange](val)
      },
      onCancel: () => el.focus()
    })

    popup.attachAnchor(el)
    this._applyValuesWidth(el, field)
    return el
  }

  buildEditField(field, item) {
    switch (field.type) {
      case 'select': return this.buildEditSelectField(field, item)
      default:       return this.buildEditTextField(field, item)
    }
  }

  buildField(field, item) {
    switch (field.type) {
      case 'text':   return this.buildTextField(field, item)
      case 'select': return this.buildSelect(field, item)
      default:       return this.buildTextField(field, item)
    }
  }

  buildItem(item) {
    const minClass = item.constructor.name.toLowerCase()
    const el = document.createElement('div')
    el.className = `${minClass}-item`
    el.dataset.id = item.id
    for (const field of (item.PROPS ?? [])) {
      el.appendChild(this.buildField(field, item))
    }
    return el
  }

  _applyValuesWidth(el, field) {
    if (!field.values?.length) return
    const maxLen = Math.max(...field.values.map(v => (v.label ?? v.name ?? '').length))
    el.style.minWidth = `${maxLen + 2}ch`
  }

  _fieldEl(field, item) {
    const minClass = item.constructor.name.toLowerCase()
    const el = document.createElement('span')
    el.className = field.cssClass ?? (field.warper ? `${minClass}-${field.name}` : `${minClass}-item__${field.name}`)
    return el
  }

}
