import Item from '../abstract/Item.js'
import StyleDom from '../dom/Style.js'

export default class Style extends Item {

  static get thingName() { return { thing: 'style', things: 'styles' } }

  get PROPS() { return [] }

  constructor(data = {}) {
    super({ ...data, title: data.name ?? data.title })
    this.name = data.name ?? ''
    this.css  = data.css  ?? ''
  }

}

Object.assign(Style.prototype, StyleDom)
