import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { PERSO_TYPES, PERSO_FONCTIONS, PERSO_COLORS } from '../constants/Perso.js'
import PersoDom from '../dom/Perso.js'


export default class Perso extends Item {
  static get thingName() { return WORD_FORMS.Perso }
  static COLORS = PERSO_COLORS

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body'}
      , { name: 'type', type: 'select' , warper: 'edits',  values: PERSO_TYPES }
      , { name: 'fonction', type: 'select-and-text' , multiple: true, warper: 'edits',  values: PERSO_FONCTIONS }
    ])
  }
}

Object.assign(Perso.prototype, PersoDom)
