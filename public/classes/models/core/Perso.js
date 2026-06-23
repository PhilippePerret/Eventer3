import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { PERSO_TYPES, PERSO_FONCTIONS } from '../constants/Perso.js'


export default class Perso extends Item {
  static get thingName() { return WORD_FORMS.Perso }

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body'}
      , { name: 'type', type: 'select' , warper: 'left',  values: PERSO_TYPES }
      , { name: 'fonction', type: 'select-and-text' , multiple: true, warper: 'left',  values: PERSO_FONCTIONS }
    ])
  }
}
