import Item from './Item.js'

const COLORS = ['#c9b99a', '#9ab8c9', '#9ac9a2', '#c9c39a', '#b89ac9', '#c99ab8', '#9ac9c3']

export default class Brin extends Item {

  static get newItemPlaceholder() {
    return 'Titre du nouveau brin'
  }

  static get idPrefix() {
    return 'b'
  }

  static generateBadge(title) {
    const words = (title ?? '').trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return '?'
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase()
    return words.slice(0, 4).map(w => w[0]).join('').toUpperCase()
  }

  static colorFor(index) {
    return COLORS[(index - 1) % COLORS.length]
  }

  createElement(type) {
    const el = super.createElement(type)
    el.classList.add('panel-row', 'brin-row')
    return el
  }

  render(div) {
    const colorStyle = this.color ? `background:${this.color}` : ''
    div.innerHTML = `
      <span class="panel-check">✓</span>
      <span class="panel-color-dot" style="${colorStyle}"></span>
      <span class="badge brin brin-item__badge">${this.badge ?? ''}</span>
      <span class="brin-item__title">${this.title}</span>
      <span class="panel-type"></span>
      <span></span>
      <span></span>
    `
  }

  getEditorFields(type, itemElement) {
    return [
      { name: 'title',  property: 'title',  selector: '.brin-item__title',  placeholder: this.constructor.newItemPlaceholder },
      { name: 'badge',  property: 'badge',  selector: '.brin-item__badge',  placeholder: 'sigle' }
    ]
  }

}
