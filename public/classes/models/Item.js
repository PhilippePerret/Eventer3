import LOG from '../../system/LOG.js'
import Texte from '../../system/Texte.js'
import {ItemDataMapper} from '../repositories/Mapper.js'
import ListerRepository from '../repositories/ListerRepository.js'
import PopupSelect from '../ui/PopupSelect.js'


export default class Item {

  static get newItemPlaceholder() {
    return 'Titre du nouvel item'
  }

  static get idPrefix() {
    return null
  }

  static create({ type, lister, keyboardController, insertionIndex, currentItemElement }) {
    const item = this.createEmpty()
    item.__isTemporary = true
    item.previousSelectedIndex = insertionIndex
    const itemElement = item.createEditorElement(type, keyboardController)

    if (currentItemElement) currentItemElement.before(itemElement)
    else lister.domContainer.appendChild(itemElement)

    lister.selectElement(itemElement)

    return item
  }

  static createEmpty() {
    return new this({ id: '', title: '' })
  }


  constructor(data = {}) {
    data = ItemDataMapper.toRuntime(data)
    this.id = data.id ?? null
    this.title = data.title ?? ''
    this.active = data.active ?? true
    this.hasLister = data.hasLister ?? false
    this.type = data.type ?? []
    this.color = data.color ?? null
    this.checked = data.checked ?? false
    this.state = data.state ?? 0
    this.duration = data.duration ?? null
    this.path = data.path ?? null
    this.created_at = data.created_at ?? null
    this.updated_at = data.updated_at ?? null
    this.badge = data.badge ?? null
    this.brin_ids = data.brin_ids ?? []
    this.patronyme = data.patronyme ?? null
    this.fonction = data.fonction ?? null
    // -- ajouté au runtime --
    this.parentLister = data.parentLister ?? null
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
    if (field.type === 'popup-select') return this.createPopupSelectTrigger(itemElement, field)
    const element = itemElement.querySelector(field.selector)
    if (!element) throw new Error(`Item.createEditorInput: ${field.selector} missing`)
    if (field.type === 'native') return element
    const input = this.createInputFromElement(element, field)
    element.replaceWith(input)
    return input
  }

  createPopupSelectTrigger(itemElement, field) {
    const element = itemElement.querySelector(field.selector)
    if (!element) throw new Error(`Item.createPopupSelectTrigger: ${field.selector} missing`)
    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.className = element.className
    trigger.classList.add('popup-select-trigger')
    trigger.dataset.type = 'popup-select'
    trigger.dataset.fieldName = field.name
    const currentOpt = field.options.find(o => o.value === this[field.property])
    trigger.textContent = currentOpt ? currentOpt.label : ''
    element.replaceWith(trigger)
    return trigger
  }

  _openPopupSelect(triggerElement, fields, inputs, keyboardController) {
    const field = fields.find(f => f.name === triggerElement.dataset.fieldName)
    if (!field) return
    const popup = new PopupSelect({
      options: field.options,
      currentValue: this[field.property],
      multi: field.multi ?? false,
      allowCustom: field.allowCustom ?? false,
      keyboardController,
      onSelect: (value) => {
        this[field.property] = value
        const opt = field.options.find(o => o.value === value)
        triggerElement.textContent = opt ? opt.label : String(value)
        inputs[0].focus()
        if (typeof inputs[0].select === 'function') inputs[0].select()
      },
      onCancel: () => { triggerElement.focus() },
    })
    popup.open(triggerElement)
  }

  enterEdition(type, keyboardController, itemElement) {
    LOG.m(2, 'Item.enterEdition', { id: this.id, title: this.title })
    const fields = this.getEditorFields(type, itemElement)
    const originalData = {}
    fields.forEach(field => { originalData[field.property] = this[field.property] })
    const inputs = fields.map(field => this.createEditorInput(itemElement, field))
    keyboardController.enterItemEdition({
      defaultInput: inputs[0],
      onKeyDown: (event, controller) => this.handleEditionKeyDown(event, controller, itemElement, fields, inputs, { originalData })
    })
  }

  cancelEditor(keyboardController, itemElement) {
    const lister = keyboardController.activeLister
    keyboardController.popMode()
    itemElement.remove()
    lister.selectItemAt(this.previousSelectedIndex)
    LOG.m(2, 'Item.creation.cancelled')
  }

  async handleEditionKeyDown(event, keyboardController, itemElement, fields, inputs, options = {}) {
    const { originalData } = options
    LOG.m(3, 'Item.handleEditionKeyDown', { key: event.key, item: this.id })
    switch (event.key) {
      case 'Tab':
        event.preventDefault()
        this.focusNextEditionInput(inputs)
        return
      case ' ':
        if (document.activeElement?.dataset.type === 'popup-select') {
          event.preventDefault()
          this._openPopupSelect(document.activeElement, fields, inputs, keyboardController)
        }
        return
      case 'Escape':
        event.preventDefault()
        if (this.__isTemporary) {
          this.cancelEditor(keyboardController, itemElement)
        } else {
          if (originalData) Object.assign(this, originalData)
          itemElement.innerHTML = ''
          if (typeof this.render === 'function') this.render(itemElement)
          keyboardController.popMode()
        }
        return
      case 'Enter':
        LOG.m(2, 'ENTER VALIDATION', { id: this.id, title: this.title, temporary: this.__isTemporary })
        event.preventDefault()
        if (document.activeElement?.dataset.type === 'popup-select') {
          this._openPopupSelect(document.activeElement, fields, inputs, keyboardController)
          return
        }
        if (!inputs[0].value.trim()) {
          this.cancelEditor(keyboardController, itemElement)
          LOG.m(2, 'Item.creation.cancelled.emptyTitle')
          return
        }
        const oldId = this.id
        this.commitEdition(itemElement, fields, inputs)
        const lister = keyboardController.activeLister
        const insertionIndex = lister.selectedIndex
        if (this.__isTemporary) {
          delete this.__isTemporary
          await lister.commitNewItem(this, itemElement, insertionIndex)
        } else {
          const fieldsToSave = {}
          fields.forEach(field => { fieldsToSave[field.property] = this[field.property] })
          await ListerRepository.saveItem(this, fieldsToSave, { oldId })
          if (oldId !== this.id) {
            const idx = lister.item_ids.indexOf(oldId)
            if (idx >= 0) lister.item_ids[idx] = this.id
            await ListerRepository.save(lister)
          }
        }
        keyboardController.popMode()
        LOG.m(2, 'Item.edition.committed', { id: this.id, title: this.title })
        return
    }
  }

  focusNextEditionInput(inputs) {
    const currentIndex = inputs.indexOf(document.activeElement)
    const nextIndex = currentIndex < 0 || currentIndex === inputs.length - 1 ? 0 : currentIndex + 1
    const next = inputs[nextIndex]
    next.focus()
    if (typeof next.select === 'function') next.select()
  }

  commitEdition(itemElement, fields, inputs) {
    LOG.m(2, 'Item.commitEdition', { title: this.title, id: this.id })
    fields.forEach((field, index) => {
      if (field.type !== 'popup-select') this[field.property] = inputs[index].value.trim()
      // popup-select values already updated via onSelect callback
    })
    itemElement.innerHTML = ''
    if (typeof this.render === 'function') this.render(itemElement)
  }

}