import DOM from '../../utils/DOM.js'
import BrinPanel from '../../ui/BrinPanel.js'

const brinPanel = new BrinPanel()

Object.assign(DOM.prototype, {
  openBrinPanel(item) { brinPanel.open(item, item.parentLister) },
  openPersoPanel(_item) { /* TODO */ },
})
