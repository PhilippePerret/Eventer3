import LOG from '../../system/LOG.js'
import Texte from '../../system/Texte.js'

export default class Item {

  static get newItemPlaceholder() {
    return 'Titre du nouvel item'
  }

  static create({ type, lister, keyboardController, insertionIndex, currentItemElement }) {
    const item = this.createEmpty()
    item.__isTemporary = true
    item.previousSelectedIndex = insertionIndex
    const itemElement = item.createEditorElement(type, keyboardController)

    if (currentItemElement) currentItemElement.before(itemElement)
    else document.querySelector(`#main-panel .${type}-list`).appendChild(itemElement)

    lister.clearSelection()
    lister.selectItemAt(insertionIndex)

    const domItem = itemElement
    domItem.classList.add('selected')

    return item
  }

  static createEmpty() {
    return new this({ id: '', title: '' })
  }


  constructor(data = {}) {
    this.id = data.id ?? null
    this.title = data.title ?? ''
    this.hasLister = data.hasLister ?? false
    this.type = data.type ?? []
    this.color = data.color ?? null
    this.checked = data.checked ?? false
    this.pos = data.pos ?? 0
    this.state = data.state ?? 0
    this.duration = data.duration ?? null
    this.path = data.path ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.badge = data.badge ?? null
    this.patronyme = data.patronyme ?? null
    this.fonction = data.fonction ?? null
  }

  createElement(type) {
    const itemElement = document.createElement('div')
    itemElement.classList.add('item')
    itemElement.classList.add(`${type}-item`)
    return itemElement
  }

  getEditorFields(type, itemElement) {
    return [{ name: 'title', property: 'title', selector: `.${type}-item__title`, placeholder: this.constructor.newItemPlaceholder }]
  }

  createInputFromElement(element, field) {
    const input = document.createElement('input')
    input.name = field.name
    input.type = 'text'
    input.className = element.className
    input.value = this[field.property] ?? ''
    input.placeholder = field.placeholder ?? ''
    input.style.border = '0'
    input.style.outline = '0'
    input.style.background = 'transparent'
    input.style.color = 'inherit'
    input.style.font = 'inherit'
    input.style.padding = '0'
    input.style.margin = '0'
    input.style.width = '100%'
    input.style.minWidth = '0'
    input.style.appearance = 'none'
    return input
  }

  createEditorElement(type, keyboardController) {
    LOG.m(2, 'Item.createEditorElement', { type, hasKeyboardController: Boolean(keyboardController) })
    if (!keyboardController) throw new Error('Item.createEditorElement: keyboardController missing')
    if (typeof keyboardController.enterItemEdition !== 'function') throw new Error('Item.createEditorElement: keyboardController.enterItemEdition missing')
    const itemElement = this.createElement(type)
    if (typeof this.render === 'function') this.render(itemElement)
    LOG.m(3, 'Editor itemElement', itemElement.outerHTML)
    const fields = this.getEditorFields(type, itemElement)
    const inputs = fields.map(field => this.createEditorInput(itemElement, field))
    keyboardController.enterItemEdition({ defaultInput: inputs[0], onKeyDown: (event, controller) => this.handleEditionKeyDown(event, controller, itemElement, fields, inputs) })
    return itemElement
  }

  createEditorInput(itemElement, field) {
    const element = itemElement.querySelector(field.selector)
    if (!element) throw new Error(`Item.createEditorInput: ${field.selector} missing`)
    const input = this.createInputFromElement(element, field)
    element.replaceWith(input)
    return input
  }

  cancelEditor(keyboardController, itemElement) {
    const lister = keyboardController.activeLister
    keyboardController.popMode()
    itemElement.remove()
    lister.selectItemAt(this.previousSelectedIndex)
    LOG.m(2, 'Item.creation.cancelled')
  }

  async handleEditionKeyDown(event, keyboardController, itemElement, fields, inputs) {
    LOG.m(3, 'Item.handleEditionKeyDown', { key: event.key, item: this.id })
    switch (event.key) {
      case 'Tab':
        event.preventDefault()
        this.focusNextEditionInput(inputs)
        return
      case 'Escape':
        event.preventDefault()
        this.cancelEditor(keyboardController, itemElement)
        return
      case 'Enter':
        LOG.m(2, 'ENTER VALIDATION', { id: this.id, title: this.title, temporary: this.__isTemporary })
        event.preventDefault()
        if (!inputs[0].value.trim()) {
          this.cancelEditor(keyboardController, itemElement)
          LOG.m(2, 'Item.creation.cancelled.emptyTitle')
          return
        }
        this.commitEdition(itemElement, fields, inputs)
        const lister = keyboardController.activeLister
        const insertionIndex = lister.selectedIndex
        if (this.__isTemporary) {
          delete this.__isTemporary
          await lister.commitNewItem(this, itemElement, insertionIndex)
        }
        keyboardController.popMode()
        LOG.m(2, 'Item.edition.committed', { id: this.id, title: this.title })
        return
    }
  }

  focusNextEditionInput(inputs) {
    const currentIndex = inputs.indexOf(document.activeElement)
    const nextIndex = currentIndex < 0 || currentIndex === inputs.length - 1 ? 0 : currentIndex + 1
    inputs[nextIndex].focus()
    inputs[nextIndex].select()
  }

  commitEdition(itemElement, fields, inputs) {
    LOG.m(2, 'Item.commitEdition', { title: this.title, id: this.id })
    fields.forEach((field, index) => this[field.property] = inputs[index].value.trim())
    itemElement.innerHTML = ''
    if (typeof this.render === 'function') this.render(itemElement)
  }

}