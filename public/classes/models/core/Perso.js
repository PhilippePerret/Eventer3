import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { PERSO_TYPES, PERSO_FONCTIONS, PERSO_COLORS } from '../constants/Perso.js'
import PersoDom from '../dom/Perso.js'


export default class Perso extends Item {
  static get thingName() { return WORD_FORMS.Perso }
  static COLORS = PERSO_COLORS

  static markOf(data) { return data.avatar || data.badge }

  constructor(data = {}) {
    super(data)
    this.avatar = data.avatar ?? null
    this.badge  = data.badge  ?? ''
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body'}
      , { name: 'type', type: 'select' , warper: 'edits',  values: PERSO_TYPES }
      , { name: 'fonction', type: 'select-and-text' , multiple: true, warper: 'edits',  values: PERSO_FONCTIONS }
    ])
  }
}

Object.assign(Perso.prototype, PersoDom)
