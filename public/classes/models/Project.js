import Item from './Item.js'

export default class Project extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouveau projet'
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

}
