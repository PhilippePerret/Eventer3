import PopupSelect from '../ui/PopupSelect.js'
import { stopEvent } from './events.js'
import Texte from '../../system/Texte.js'
import { attachTextEdit } from '../models/listen/TextEdit.js'

export default class DOM {

  buildTextField(field, item) {
    const el  = this._fieldEl(field, item)
    const val = field.value ? item[field.value]?.() : item[field.name]
    el.innerHTML = Texte.render(val ?? '')
    return el
  }

  buildSelect(field, item) {
    const el = this._fieldEl(field, item)
    el.classList.add('display-select')
    const val = item[field.name]
    const values = this._normalizeValues(field.values)
    const found = values.find(v => v.value === val)
    el.textContent = found ? (found.label ?? found.name ?? val) : (val ?? '')
    this._applyValuesWidth(el, field)
    return el
  }

  buildEditTextField(field, item) {
    const el = this._fieldEl(field, item)
    el.setAttribute('contenteditable', 'true')
    el.setAttribute('data-field', field.name)
    el.setAttribute('tabindex', '0')
    el.textContent = item[field.name] ?? ''
    attachTextEdit(el)
    if (field.onchange)   el.addEventListener('input', () => item[field.onchange](el, field))
    if (field.oncreating) el.addEventListener('input', () => item[field.oncreating](el, field))
    return el
  }

  buildEditSelectField(field, item) {
    const el = this._fieldEl(field, item)
    el.classList.add('display-select')
    el.setAttribute('data-field', field.name)
    el.setAttribute('tabindex', '0')
    const values = this._normalizeValues(field.values)
    const found = values.find(v => v.value === item[field.name])
    el.textContent = found ? (found.label ?? found.name ?? item[field.name]) : (item[field.name] ?? '')

    const disabledValues = field.onchoose ? (item[field.onchoose]?.(field.name) ?? []) : []
    const popup = new PopupSelect({
      options: values,
      currentValue: item[field.name],
      multi: field.multiple ?? false,
      disabledValues,
      onSelect: val => {
        item[field.name] = val
        const f = values.find(v => v.value === val)
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
      case 'select':  return this.buildEditSelectField(field, item)
      case 'no-edit': return this.buildNoEditField(field, item)
      default:        return this.buildEditTextField(field, item)
    }
  }

  buildNoEditField(field, item) {
    const el = this._fieldEl(field, item)
    el.innerHTML = item[field.value]?.() ?? ''
    return el
  }

  buildField(field, item) {
    switch (field.type) {
      case 'text':    return this.buildTextField(field, item)
      case 'select':  return this.buildSelect(field, item)
      case 'no-edit': return this.buildNoEditField(field, item)
      default:        return this.buildTextField(field, item)
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
    const values = this._normalizeValues(field.values)
    if (!values.length) return
    const maxLen = Math.max(...values.map(v => (v.label ?? v.name ?? '').length))
    el.style.minWidth = `${maxLen + 2}ch`
  }

  _normalizeValues(values) {
    if (!values) return []
    if (Array.isArray(values)) {
      return values.map(v => {
        if (typeof v === 'object' && v !== null && ('value' in v || 'label' in v)) return v
        if (v === null) return { value: null, label: '' }
        if (v !== null && typeof v === 'object') {
          const [key, label] = Object.entries(v)[0] ?? []
          return { value: key, label: label ?? key }
        }
        return { value: v, label: String(v) }
      })
    }
    return Object.entries(values).map(([value, label]) => ({ value, label: String(label) }))
  }

  _fieldEl(field, item) {
    const minClass = item.constructor.name.toLowerCase()
    const el = document.createElement('span')
    el.className = field.cssClass ?? (field.warper ? `${minClass}-${field.name}` : `${minClass}-item__${field.name}`)
    return el
  }

}
