import LOG from '../../../system/LOG.js'

export default {

  render() {
    LOG.m(2, 'Lister.render', { items: this.items.length, selectedIndex: this.selectedIndex })
    const container = document.querySelector('#main-panel')
    container.innerHTML = ''
    if (this.minClass) container.className = `${this.minClass}-list`
    this.container = container
    this.items.forEach((item, i) => {
      item.parentLister = this
      const el = item.build()
      if (i === this.selectedIndex) el.classList.add('selected')
      container.appendChild(el)
    })
    this.focusSelected()
    return container
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
