import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { BRIN_TYPE, BRIN_COLORS } from '../constants/Brin.js'
import BrinDom from '../dom/Brin.js'
import { raise } from '../../../system/Error.js'


export default class Brin extends Item {
  static get thingName() { return WORD_FORMS.Brin }
  static COLORS = BRIN_COLORS

  static markOf(data) { return data.badge }

  static generateUniqueBadge(brin) {
    const taken = new Set(this.existingBadges)
    let badge
    const title = brin.title || raise(10, brin.id)
    const words = title.trim().toUpperCase().split(/\s+/).filter(Boolean)
    while(words.length < 3) {words.push('A')}
    var iw1 = 0, iw2 = 1, iw3 = 0, iw4 = 0, ialpha = 0, ialpha2 = 0

    while(words.length >= 3){
      for (iw1, lenw1 = words[0].length; iw1 < lenw1 ; ++ iw1){
        let l1 = words[0][iw1]
        for(iw2, lenw2 = words[1].Length; iw2 < lenw2 ; ++ iw2){
          let l2 = words[1][iw2]
          for (iw3, lenw3 = words[2].length; iw3 < lenw3; ++ iw3){
            let l3 = words[2][iw3]
            let badge = l1+l2+l3
            if (!taken.has(badge)) return badge
          }
        }
      }
      if (words.length > 3) {
        words.splice(2, 1)
      }
      if (ialpha < 25) {
        words[2] = String.fromCharCode(65 + ialpha++)
      } else if (ialpha2 < 25) {
        words[1] = String.fromCharCode(65 + ialpha2++)
      } else {
        // Franchement, on a aucune chance d'arriver là
      }
    }

    // A→Z sur 3e char
    for (let k = 65; k <= 90; k++) {
      const c = c1 + c2 + String.fromCharCode(k)
      if (!taken.has(c)) return c
    }
    // A→Z sur 2e char (3e char cycle complet)
    for (let k2 = 65; k2 <= 90; k2++) {
      for (let k3 = 65; k3 <= 90; k3++) {
        const c = c1 + String.fromCharCode(k2) + String.fromCharCode(k3)
        if (!taken.has(c)) return c
      }
    }
    for (let n = 1; ; n++) {
      const b = 'B' + String(n).padStart(2, '0')
      if (!taken.has(b)) return b
    }
  }

  constructor(data = {}) {
    super(data)
    this.badge     = data.badge     || Brin.generateUniqueBadge(this)
    this.type      = data.type      ?? null
    this.perso_ids = data.perso_ids ?? []
  }

  existingBadges() {
    return (this.parentLister?.items ?? [])
      .filter(b => b.id !== this.id)
      .map(b => b.badge)
      .filter(Boolean)
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body', onchange: 'checkAndSetBadge'}
      , { name: 'badge', type: 'text'    , warper: 'edits', onchange: 'checkBadgeValue'}
      , { name: 'type',  type: 'select'  , warper: 'edits', values: BRIN_TYPE }
      , { name: 'color', type: 'color'   , warper: 'edits'}
      , { name: 'perso_ids', type: 'no-edit', warper: 'marks', value: 'persosMarks' }
    ])
  }
}

Object.assign(Brin.prototype, BrinDom)
