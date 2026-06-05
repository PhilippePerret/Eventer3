import Lister from './Lister.js'
import Event from './Event.js'
import BrinLister from './BrinLister.js'
import PersoLister from './PersoLister.js'

export default class EventLister extends Lister {

  constructor(data = {}) {
    super({ type: 'events', ...data })
    this.itemClass = Event
  }

  get uiModes() { return ['listerRoot', 'eventsRoot'] }

  get childListerClass() {
    return EventLister
  }

  async commitNewItem(item, itemElement, insertionIndex) {
    const wasVirtual = this.__isVirtual
    await super.commitNewItem(item, itemElement, insertionIndex)
    if (wasVirtual) await BrinLister.init(this)
  }

  async openBrinPanel() {
    await BrinLister.open(this)
  }

  async openPersoPanel() {
    await PersoLister.open(this)
  }

  renderHeader() {
    if (!this.parentItem) return null
    const nav = document.createElement('nav')
    nav.className = 'eventer-breadcrumbs'
    const btn = document.createElement('button')
    btn.className = 'breadcrumb-item'
    btn.textContent = this.parentItem.title
    btn.addEventListener('click', () => this.leaveToParent())
    const sep = document.createElement('span')
    sep.className = 'breadcrumb-separator'
    sep.textContent = '‹'
    nav.appendChild(btn)
    nav.appendChild(sep)
    return nav
  }

}
