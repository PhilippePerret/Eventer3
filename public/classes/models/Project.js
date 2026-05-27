import Item from './Item.js'

export default class Project extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouveau projet'
  }

  render(div) {
    div.innerHTML = `
      <span class="project-item__title">${this.title}</span>
      <span class="project-item__id">${this.id}</span>
    `
  }

}