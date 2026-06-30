import Item from '../abstract/Item.js'
import EventDom from '../dom/Event.js'
import { EventLi } from '../listen/Event.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { EVENT_STATE, EVENT_METEO, EVENT_EFFET, EVENT_COLORS } from '../constants/Event.js'


// tag::class-event[]
export default class Event extends Item {
// end::class-event[]

  static LISTENERS = { ...Item.LISTENERS, ...EventLi }
  static get thingName() { return WORD_FORMS.Event }
  static COLORS = EVENT_COLORS

  constructor(data = {}) {
    super(data)
    this.brin_ids  = data.brin_ids  ?? []
    this.perso_ids = data.perso_ids ?? []
    this.css       = data.css       ?? []
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title'         , type: 'text'    , warper: 'body'}
      , { name: 'state'         , type: 'select'  , warper: 'edits', values: EVENT_STATE }
      , { name: 'meteo'         , type: 'select'  , warper: 'edits', values: EVENT_METEO, onchange: 'setEffetPerMeteo', onchoose: 'checkCompatibiliteMeteoEffet' }
      , { name: 'effet'         , type: 'select'  , warper: 'edits', values: EVENT_EFFET, onchange: 'setMeteoPerEffet', onchoose: 'checkCompatibiliteMeteoEffet' }
      , { name: 'brin_ids'      , type: 'no-edit' , warper: 'marks', value: 'brinsMarks' }
      , { name: 'perso_ids'     , type: 'no-edit' , warper: 'marks', value: 'persosMarks' }
      , { name: 'css'           , type: 'no-edit'                                         }
    ])
  }
}

Object.assign(Event.prototype, EventDom)
