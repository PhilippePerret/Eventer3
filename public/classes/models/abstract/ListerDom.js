export default class ListerDom {
  constructor(lister) { this.lister = lister }

  render() {
    const container = document.querySelector('#main-panel')
    container.innerHTML = ''
    const minClass = this.lister.constructor.ITEM_CLASS?.name.toLowerCase()
    if (minClass) container.className = `${minClass}-list`
    this.lister.items.forEach((item, i) => {
      const el = item.Dom.build()
      if (i === this.lister.selectedIndex) el.classList.add('selected')
      container.appendChild(el)
    })
    return container
  }
}