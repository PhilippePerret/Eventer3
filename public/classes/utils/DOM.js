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
    return el
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

  _fieldEl(field, item) {
    const minClass = item.constructor.name.toLowerCase()
    const el = document.createElement('span')
    el.className = `${minClass}-item__${field.name}`
    return el
  }

}
