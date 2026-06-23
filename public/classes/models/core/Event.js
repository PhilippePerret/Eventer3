import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET } from '../constants/Event.js'


export default class Event extends Item {
  static get thingName() { return WORD_FORMS.Event }

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body'}
      , { name: 'state', type: 'select' , warper: 'left-col', values: EVENT_STATE }
      , { name: 'meteo', type: 'select' , warper: 'left-col', values: EVENT_METEO, onchange: 'setEffetPerMeteo', onchoose: 'checkCompatibiliteMeteoEffet' }
      , { name: 'effet', type: 'select' , warper: 'left-col', values: EVENT_EFFET, onchange: 'setMeteoPerEffet', onchoose: 'checkCompatibiliteMeteoEffet' }
    ])
  }
}
