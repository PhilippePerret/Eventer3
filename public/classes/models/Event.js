import Item from './Item.js'

export default class Event extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouvel évènement'
  }

  render(div) {
    div.innerHTML = `<span class="event-item__title">${this.title}</span>`
  }

}
