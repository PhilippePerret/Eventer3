import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { BRIN_TYPE, BRIN_COLORS } from '../constants/Brin.js'
import BrinDom from '../dom/Brin.js'


export default class Brin extends Item {
  static get thingName() { return WORD_FORMS.Brin }
  static COLORS = BRIN_COLORS

  constructor(data = {}) {
    super(data)
    this.badge  = data.badge  ?? ''
    this.type   = data.type   ?? null
    this.persos = data.persos ?? []
  }

  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body', onchange: 'checkAndSetBadge'}
      , { name: 'color', type: 'color'   , warper: 'edits'}
      , { name: 'badge', type: 'text'    , warper: 'edits', onchange: 'checkBadgeValue'}
      , { name: 'type',  type: 'select'  , warper: 'edits', values: BRIN_TYPE }
      , { name: 'persos', type: 'no-edit', warper: 'marks' }
    ])
  }
}

Object.assign(Brin.prototype, BrinDom)
