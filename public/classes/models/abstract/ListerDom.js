import LOG from '../../../system/LOG.js'

export default class ListerDom {
  constructor(lister) { this.lister = lister }

  render() {
    LOG.m(2, 'ListerDom.render', { items: this.lister.items.length, selectedIndex: this.lister.selectedIndex })
    const container = document.querySelector('#main-panel')
    container.innerHTML = ''
    if (this.lister.minClass) container.className = `${this.lister.minClass}-list`
    this.container = container
    this.lister.items.forEach((item, i) => {
      item.parentLister = this.lister
      const el = item.build()
      if (i === this.lister.selectedIndex) el.classList.add('selected')
      container.appendChild(el)
    })
    this.focusSelected()
    return container
  }

  focusSelected() {
    const item = this.lister.items[this.lister.selectedIndex]
    LOG.m(2, 'ListerDom.focusSelected', { selectedIndex: this.lister.selectedIndex, itemExists: !!item, elExists: !!item?.el })
    item?.el?.focus()
  }

  removeEl(item) {
    item.el?.remove()
  }

  applySelection(prevItem, nextItem) {
    prevItem?.el?.classList.remove('selected')
    nextItem?.el?.classList.add('selected')
    nextItem?.el?.focus()
  }
}
