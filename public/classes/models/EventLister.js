import Lister from './Lister.js'
import Event from './Event.js'
import BrinLister from './BrinLister.js'
import PersoLister from './PersoLister.js'
import ListerRepository from '../repositories/ListerRepository.js'

export default class EventLister extends Lister {

  constructor(data = {}) {
    super({ type: 'events', ...data })
    this.itemClass = Event
  }

  get uiModes() { return ['listerRoot', 'eventsRoot'] }

  get childListerClass() {
    return EventLister
  }

  _updateCheckVisual(el, isChecked) {
    const checkEl = el.querySelector('.event-check')
    if (checkEl) checkEl.textContent = isChecked ? '✓' : ''
  }

  async _saveAfterToggle(item) {
    await ListerRepository.saveItem(item, { checked: item.checked })
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

  render() {
    const result = super.render()
    void this._loadAndRenderPersoMarks()
    return result
  }

  async _loadAndRenderPersoMarks() {
    const projectId = this.parentItem?.id
    if (!projectId) return

    const [brinsData, persoData] = await Promise.all([
      ListerRepository.loadItems({ id: `${projectId}-brins` }),
      ListerRepository.loadItems({ id: `${projectId}-persos` })
    ])

    const persoMarks = {}
    Object.entries(persoData).forEach(([id, data]) => {
      persoMarks[id] = data.avatar ?? data.badge ?? '--'
    })

    this.items.forEach((event, idx) => {
      const el = this.domItems[idx]
      if (!el) return
      const marksEl = el.querySelector('.event-persos-marks')
      if (!marksEl) return
      marksEl.innerHTML = ''
      const allPersoIds = new Set(event.perso_ids ?? [])
      ;(event.brin_ids ?? []).forEach(brinId => {
        const brin = brinsData[brinId]
        if (!brin) return
        ;(brin.brin_perso_ids ?? brin.perso_ids ?? []).forEach(pid => allPersoIds.add(pid))
      })
      allPersoIds.forEach(id => {
        const mark = persoMarks[id]
        if (!mark) return
        const span = document.createElement('span')
        span.className = 'perso-mark'
        span.textContent = mark
        marksEl.appendChild(span)
      })
    })
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
