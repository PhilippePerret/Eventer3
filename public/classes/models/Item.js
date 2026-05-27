export default class Item {

  static get newItemPlaceholder() {
    return 'Titre du nouvel item'
  }

  static createEmpty() {
    return new this({ id: '', title: '' })
  }

  constructor(data = {}) {
    this.id         = data.id ?? null
    this.title      = data.title ?? ''
    this.hasLister  = data.hasLister ?? false
    this.type       = data.type ?? []
    this.color      = data.color ?? null
    this.checked    = data.checked ?? false
    this.pos        = data.pos ?? 0
    this.state      = data.state ?? 0
    this.duration   = data.duration ?? null
    this.path       = data.path ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.badge      = data.badge ?? null
    this.patronyme  = data.patronyme ?? null
    this.fonction   = data.fonction ?? null
  }

  createElement(type) {
    const itemElement = document.createElement('div')
    itemElement.classList.add('item')
    itemElement.classList.add(`${type}-item`)
    return itemElement
  }

  createEditorElement(type) {
    const itemElement = this.createElement(type)
    const inputElement = document.createElement('input')
    inputElement.value = ''
    inputElement.placeholder = this.constructor.newItemPlaceholder
    itemElement.appendChild(inputElement)
    return itemElement
  }

}