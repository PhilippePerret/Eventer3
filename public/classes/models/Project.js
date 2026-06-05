import Item from './Item.js'
import Texte from '../../system/Texte.js'

export default class Project extends Item {

  static get thingName() {
    return { thing: 'projet', THING: 'PROJET', Thing: 'Projet', things: 'projets', THINGS: 'PROJETS', Things: 'Projets', the: 'le', THE: 'LE', The: 'Le', of: 'du '}
  }

  static get idPrefix() {
    return 'p'
  }

  getEditorFields(type, itemElement) {
    const titleField = { name: 'title', property: 'title', selector: `.${type}-item__title`, placeholder: this.constructor.newItemPlaceholder }
    if (this.hasLister) return [titleField]
    return [titleField, { name: 'id', property: 'id', selector: `.${type}-item__id`, placeholder: 'identifiant' }]
  }

  createEditorElement(keyboardController) {
    const itemElement = super.createEditorElement(keyboardController)
    if (this.__isTemporary) {
      const inputs = itemElement.querySelectorAll('input')
      if (inputs.length >= 2) {
        inputs[0].addEventListener('input', () => {
          inputs[1].value = Texte.slugify(inputs[0].value)
        })
      }
    }
    return itemElement
  }

  render(div) {
    div.innerHTML = `
      <span class="project-item__title">${this.title}</span>
      <span class="project-item__id">${this.id ?? ''}</span>
    `
  }

}
