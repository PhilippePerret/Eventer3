import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { BRIN_TYPE, BRIN_COLORS } from '../constants/Brin.js'
import BrinDom from '../dom/Brin.js'


export default class Brin extends Item {
  static get thingName() { return WORD_FORMS.Brin }
  static COLORS = BRIN_COLORS

  static markOf(data) { return data.badge }

  constructor(data = {}) {
    super(data)
    this.badge     = data.badge     ?? ''
    this.type      = data.type      ?? null
    this.perso_ids = data.perso_ids ?? []
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body', onchange: 'checkAndSetBadge'}
      , { name: 'color', type: 'color'   , warper: 'edits'}
      , { name: 'badge', type: 'text'    , warper: 'edits', onchange: 'checkBadgeValue'}
      , { name: 'type',  type: 'select'  , warper: 'edits', values: BRIN_TYPE }
      , { name: 'perso_ids', type: 'no-edit', warper: 'marks', value: 'persosMarks' }
    ])
  }
}

Object.assign(Brin.prototype, BrinDom)
