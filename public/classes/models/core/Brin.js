import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { } from '../constants/Brins.js'


export default class Brin extends Item {
  static get thingName() { return WORD_FORMS.Brin }

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body'}
      , { name: 'type', type: 'select' , warper: 'left',  values: EVENT_STATE }
    ])
  }
}
