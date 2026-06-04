import Item from './Item.js'

export default class Project extends Item {

  static get thingName() {
    return { thing: 'projet', THING: 'PROJET', Thing: 'Projet', things: 'projets', THINGS: 'PROJETS', Things: 'Projets', the: 'le', THE: 'LE', The: 'Le' }
  }

  static get idPrefix() {
    return 'p'
  }

  render(div) {
    div.innerHTML = `
      <span class="project-item__title">${this.title}</span>
      <span class="project-item__id">${this.id}</span>
    `
  }

}
