export default class ListerDom {
  constructor(lister) { this.lister = lister }

  render() {
    const container = document.querySelector('#main-panel')
    container.innerHTML = ''
    if (this.lister.minClass) container.className = `${this.lister.minClass}-list`
    this.container = container
    this.lister.items.forEach((item, i) => {
      item.parentLister = this.lister
      const el = item.Dom.build()
      if (i === this.lister.selectedIndex) el.classList.add('selected')
      container.appendChild(el)
    })
    this.focusSelected()
    return container
  }

  focusSelected() {
    const item = this.lister.items[this.lister.selectedIndex]
    item?.Dom.el?.focus()
  }

  removeEl(item) {
    item.Dom.el?.remove()
  }

  applySelection(prevItem, nextItem) {
    prevItem?.Dom.el?.classList.remove('selected')
    nextItem?.Dom.el?.classList.add('selected')
    nextItem?.Dom.el?.focus()
  }
}