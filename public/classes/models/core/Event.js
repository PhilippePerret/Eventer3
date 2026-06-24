import Item from '../abstract/Item.js'
import EventDom from '../dom/Event.js'
import { EventLi } from '../listen/Event.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET, EVENT_COLORS } from '../constants/Event.js'


export default class Event extends Item {

  static LISTENERS = { ...Item.LISTENERS, ...EventLi }
  static get thingName() { return WORD_FORMS.Event }
  static COLORS = EVENT_COLORS

  constructor(data = {}) {
    super(data)
    this.brin_ids  = data.brin_ids  ?? []
    this.perso_ids = data.perso_ids ?? []
  }

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title'         , type: 'text'    , warper: 'body'}
      , { name: 'state'         , type: 'select'  , warper: 'edits', values: EVENT_STATE }
      , { name: 'meteo'         , type: 'select'  , warper: 'edits', values: EVENT_METEO, onchange: 'setEffetPerMeteo', onchoose: 'checkCompatibiliteMeteoEffet' }
      , { name: 'effet'         , type: 'select'  , warper: 'edits', values: EVENT_EFFET, onchange: 'setMeteoPerEffet', onchoose: 'checkCompatibiliteMeteoEffet' }
      , { name: 'brins-marks'   , type: 'no-edit' , warper: 'marks', value: 'brinsMarks' }
      , { name: 'persos-marks'  , type: 'no-edit' , warper: 'marks', value: 'persosMarks' }
    ])
  }
}

Object.assign(Event.prototype, EventDom)
