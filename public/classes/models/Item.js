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

  createEditorElement(type, keyboardController) {

    const itemElement = this.createElement(type)

    const titleElement = document.createElement('span')
    titleElement.className = `${type}-listing__title`
    titleElement.textContent = this.title

    const idElement = document.createElement('span')
    idElement.className = `${type}-listing__id`
    idElement.textContent = this.id

    const titleInput = document.createElement('input')
    titleInput.className = titleElement.className
    titleInput.value = this.title || ''
    titleInput.placeholder = this.constructor.newItemPlaceholder

    const idInput = document.createElement('input')
    idInput.className = idElement.className
    idInput.value = this.id || ''
    idInput.placeholder = 'identifiant'

    itemElement.appendChild(titleInput)
    itemElement.appendChild(idInput)

    keyboardController.pushMode({

      onKeyDown: event => {

        switch (event.key) {

          case 'Tab':
            event.preventDefault()
            if (document.activeElement === titleInput) idInput.focus()
            else titleInput.focus()
            return

          case 'Escape':
            keyboardController.popMode()
            itemElement.remove()
            return

          case 'Enter':
            this.title = titleInput.value.trim()
            this.id = idInput.value.trim()
            titleElement.textContent = this.title
            idElement.textContent = this.id
            titleInput.replaceWith(titleElement)
            idInput.replaceWith(idElement)
            keyboardController.popMode()
            return

        }

      }

    })

    requestAnimationFrame(() => {
      titleInput.focus()
      titleInput.select()
    })

    return itemElement

  }

}
