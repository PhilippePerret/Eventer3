import Item from '../abstract/Item.js'
import StyleDom from '../dom/Style.js'
import { ItemLi } from '../listen/Item.js'

export default class Style extends Item {

  static get thingName() { return { thing: 'style', things: 'styles' } }
  static LISTENERS = { ...ItemLi, a: null, g: null, k: null, o: null, q: null }

  get PROPS() { return [] }

  constructor(data = {}) {
    super({ ...data, title: data.name ?? data.title })
    this.name = data.name ?? ''
    this.css  = data.css  ?? ''
  }

  onEnter() { this.toggleChecked() }

}

Object.assign(Style.prototype, StyleDom)
