import Item from '../abstract/Item.js'

export default class Event extends Item {
  get PROPS() {
    return [{ name: 'title', type: 'text' }]
  }
}
