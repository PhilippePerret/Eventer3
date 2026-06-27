import DOM from '../../utils/DOM.js'
import BrinPanel from '../../ui/BrinPanel.js'
import PersoPanel from '../../ui/PersoPanel.js'

const brinPanel  = new BrinPanel()
const persoPanel = new PersoPanel()

Object.assign(DOM.prototype, {
  async openBrinPanel(item)  { await brinPanel.open(item, item.parentLister) },
  async openPersoPanel(item) { await persoPanel.open(item, item.parentLister) },
})
