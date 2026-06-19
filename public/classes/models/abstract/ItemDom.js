import DOM from '../../utils/DOM.js'

const dom = new DOM()

export default class ItemDom {
  constructor(item) { this.item = item }

  build() {
    const el = dom.buildItem(this.item)
    el.setAttribute('tabindex', '-1')
    this.el = el
    this.item.Listener.attach(el)
    return el
  }
}