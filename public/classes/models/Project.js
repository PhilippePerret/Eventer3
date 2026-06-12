import Item from './Item.js'
import { WORD_FORMS } from '../../constants.js'

export default class Project extends Item {

  static get thingName() {
    return WORD_FORMS.Project
  }

  static get idPrefix() {
    return 'p'
  }

  getEditorFields(type, itemElement) {
    return [{ name: 'title', property: 'title', selector: `.${type}-item__title`, placeholder: this.constructor.newItemPlaceholder }]
  }

  render(div) {
    div.innerHTML = `
      <span class="project-item__title">${this.renderedTitle}</span>
    `
  }

}
