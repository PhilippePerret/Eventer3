import DOM from '../../utils/DOM.js'

const dom = new DOM()

export default class ItemDom {
  constructor(item) { this.item = item }

  build() { return dom.buildItem(this.item) }
}