import Texte from '../../system/Texte.js'
import Item from './Item.js'

export default class Project extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouveau projet'
  }

  static createEmpty() {
    return new this({ id: '', title: '', type: 'project', active: true, hasLister: false })
  }

  getEditorFields(type, itemElement) {
    return [{ name: 'title', property: 'title', selector: `.${type}-item__title`, placeholder: this.constructor.newItemPlaceholder }, { name: 'id', property: 'id', selector: `.${type}-item__id`, placeholder: 'identifiant' }]
  }

  render(div) {
    div.innerHTML = `
      <span class="project-item__title">${this.title}</span>
      <span class="project-item__id">${this.id}</span>
    `
  }

  createEditorElement(type, keyboardController) {
    const itemElement = super.createEditorElement(type, keyboardController)
    const inputs = itemElement.querySelectorAll('input')

    inputs[0].addEventListener('input', () => {
      this.id = Texte.slugify(inputs[0].value)
      inputs[1].value = this.id
    })

    return itemElement
  }

}
