import Item from './Item.js'

export default class Project extends Item {

  // Rendu de l'item quand c'est un PROJET
  render(div) {
    div.innerHTML = `
      <span class="project-listing__title">${this.title}</span>
      <span class="project-listing__id">${this.id}</span>
    `
  }

}