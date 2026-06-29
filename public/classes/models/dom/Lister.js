import LOG from '../../../system/LOG.js'
import { raise } from '../../../system/Error.js'
import { ERRORS } from '../../../system/Locales.js'

export default {

  _ensureContainer() {
    const id = this.constructor.PANEL_ID || raise(ERRORS[50], this.constructor.name)
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('div')
      el.id = id
      el.classList.add('hidden')
      document.querySelector('#main-panels-container').appendChild(el)
      this.attach(el)
    }
    return el
  },

  _ensurePanelStructure(container) {
    let panel = container.querySelector(':scope > .lister-panel')
    if (panel) return panel

    panel = document.createElement('div')
    panel.className = 'lister-panel'

    const header = document.createElement('div')
    header.className = 'lister-panel__header'
    const title = document.createElement('div')
    title.className = 'panel__title'
    header.appendChild(title)
    panel.appendChild(header)

    const body = document.createElement('div')
    body.className = 'lister-panel__body'
    panel.appendChild(body)

    const footer = document.createElement('div')
    footer.className = 'lister-panel__footer'
    panel.appendChild(footer)

    container.appendChild(panel)
    return panel
  },

  build() {
    LOG.m(2, 'Lister.build', { items: this.items.length, selectedIndex: this.selectedIndex })
    this.container = this._ensureContainer()
    this.container.classList.add(`${this.minClass}-list`)
    const panel = this._ensurePanelStructure(this.container)
    const body  = panel.querySelector('.lister-panel__body')

    body.innerHTML = ''
    this.items.forEach(item => {
      item.parentLister = this
      body.appendChild(item.build())
    })
    LOG.m(2, 'Lister.build done', { children: body.children.length, firstClass: body.children[0]?.className })
  },

  activate() {
    this.container.classList.remove('hidden')
    this.focusSelected()
  },

  hideContainer() {
    this.container?.classList.add('hidden')
  },

  hide() {
    this.hideContainer()
  },

  focusSelected() {
    const item = this.items[this.selectedIndex]
    LOG.m(2, 'Lister.focusSelected', { selectedIndex: this.selectedIndex, itemExists: !!item, elExists: !!item?.el })
    item?.el?.focus()
  },

  removeEl(item) {
    item.el?.remove()
  },

  applySelection(prevItem, nextItem) {
    prevItem?.el?.classList.remove('selected')
    nextItem?.el?.classList.add('selected')
    nextItem?.el?.focus()
  },

}
