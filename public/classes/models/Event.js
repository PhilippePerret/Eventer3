import Item from './Item.js'

export default class Event extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouvel évènement'
  }

  static get idPrefix() {
    return 'e'
  }

  render(div) {
    div.innerHTML = `<span class="event-item__title">${this.title}</span>`
  }

}
