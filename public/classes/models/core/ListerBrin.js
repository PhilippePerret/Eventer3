import Lister from '../abstract/Lister.js'
import Brin from './Brin.js'

export default class ListerBrin extends Lister {

  static ITEM_CLASS = Brin

  constructor(data = {}) {
    super(data)
    this.listerEvent = data.listerEvent ?? null
  }

  get selectedEvent() {
    const le = this.listerEvent
    return le?.items[le.selectedIndex] ?? null
  }

  load() {
    const brinsData = this.listerEvent?.brins ?? {}
    this.items = Object.entries(brinsData).map(([id, d]) => new Brin({ ...d, id }))
    this.item_ids = this.items.map(b => b.id)
    if (this.selectedIndex < 0 && this.items.length) this.selectedIndex = 0
    this._syncChecked()
  }

  _syncChecked() {
    const brinIds = this.selectedEvent?.brin_ids ?? []
    this.items.forEach(b => { b.checked = brinIds.includes(b.id) })
  }

  render() {
    const panel = document.querySelector('#brin-panel')
    panel.innerHTML = ''
    panel.classList.remove('hidden')
    this.container = panel
    this.items.forEach((item, i) => {
      item.parentLister = this
      const el = item.build()
      if (i === this.selectedIndex) el.classList.add('selected')
      if (item.checked) el.classList.add('checked')
      panel.appendChild(el)
    })
  }

  focusSelected() {
    const items = this.container?.querySelectorAll('.brin-item')
    items?.forEach((el, i) => el.classList.toggle('selected', i === this.selectedIndex))
  }

  applySelection(prevItem, nextItem) {
    prevItem?.el?.classList.remove('selected')
    nextItem?.el?.classList.add('selected')
  }

  toggleChecked() {
    const brin = this.items[this.selectedIndex]
    const ev = this.selectedEvent
    if (!brin || !ev) return
    ev.brin_ids = ev.brin_ids ?? []
    const i = ev.brin_ids.indexOf(brin.id)
    if (i > -1) ev.brin_ids.splice(i, 1)
    else ev.brin_ids.push(brin.id)
    brin.checked = ev.brin_ids.includes(brin.id)
    brin.el?.classList.toggle('checked', brin.checked)
    this._refreshEventMarks(ev)
    ev.save()
  }

  _refreshEventMarks(ev) {
    const marksEl = ev.el?.querySelector('.event-brins-marks')
    if (!marksEl) return
    const brins = this.listerEvent?.brins ?? {}
    marksEl.innerHTML = (ev.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-badge"${style}>${b.badge ?? '?'}</span>`
    }).join('')
  }

}
