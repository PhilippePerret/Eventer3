import Lister from './Lister.js'
import Event from './Event.js'

export default class EventLister extends Lister {

  constructor(data = {}) {
    super(data)
    this.itemClass = Event
  }

  get childListerClass() {
    return EventLister
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
