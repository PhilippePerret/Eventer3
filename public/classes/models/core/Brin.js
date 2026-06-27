import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { BRIN_TYPE, BRIN_COLORS } from '../constants/Brin.js'
import BrinDom from '../dom/Brin.js'
import { raise, getErr } from '../../../system/Error.js'
import Notification from '../../ui/Notification.js'


export default class Brin extends Item {
  static get thingName() { return WORD_FORMS.Brin }
  static COLORS = BRIN_COLORS

  static markOf(data) { return data.badge }

  constructor(data = {}) {
    super(data)
    this.badge     = data.badge     || Brin.generateUniqueBadge(this)
    this.type      = data.type      ?? null
    this.perso_ids = data.perso_ids ?? []
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body', oncreating: 'setBadgeOnCreating'}
      , { name: 'badge', type: 'text'    , warper: 'edits', onchange: 'checkBadgeValue', unique: true}
      , { name: 'type',  type: 'select'  , warper: 'edits', values: BRIN_TYPE }
      , { name: 'color', type: 'color'   , warper: 'edits'}
      , { name: 'perso_ids', type: 'no-edit', warper: 'marks', value: 'persosMarks' }
    ])
  }



  /**
   * 
   * ================================================================
   *        MÉTHODES (CLASS/INSTANCE) POUR LES ***BADGES***
   */

  /** 
   * Méthode appelée par le pseudo (title) et le patronyme à la première création
   * du personnage
   * Reçoit le champ (title ou patronyme), trouve le badge unique et renseigne le
   * champ badge
  */
  setBadgeOnCreating(el){
    const val = el.textContent?.trim()
    if (!val || (this.badge && !this.__isTemporary)) return
    this.badge = Brin.generateUniqueBadge(this)
    const badgeEl = this.el?.querySelector('[data-field="badge"]') ?? this.el?.querySelector('.brin-badge')
    if (badgeEl) badgeEl.textContent = this.badge
  }

  /**
   * Méthode appelé quand on change le badge du personnage
   * S'assure qu'il est unique
   */
  checkBadgeValue(el){
    const val = el.textContent?.trim()
    const badgeField = this.PROPS.find(f => f.name === 'badge')
    if (val === badgeField._curvalue) return
    if (this.parentLister.existingBadges.has(val)) {
      Notification.show(getErr(2010, val))
      el.textContent = badgeField._curvalue
    }
  }

  static generateUniqueBadge(brin) {
    const taken = brin.parentLister.existingBadges
    let badge
    const title = brin.title ?? raise(10, brin.id)
    const words = title.trim().toUpperCase().split(/\s+/).filter(Boolean)
    while(words.length < 3) {words.push('A')}
    var iw1 = 0, iw2 = 0, iw3 = 0, iw4 = 0, ialpha = 0, ialpha2 = 0, lenw1, lenw2, lenw3

    while(words.length >= 3){
      for (iw1, lenw1 = words[0].length; iw1 < lenw1 ; ++ iw1){
        let l1 = words[0][iw1]
        for(iw2, lenw2 = words[1].length; iw2 < lenw2 ; ++ iw2){
          let l2 = words[1][iw2]
          for (iw3, lenw3 = words[2].length; iw3 < lenw3; ++ iw3){
            let l3 = words[2][iw3]
            let badge = l1+l2+l3
            if (!taken.has(badge)) {
              taken.add(badge)
              return badge
            }
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
        break  // épuisé toutes les combos, passe au dernier recours
      }
    }

    for (let n = 1; ; n++) {
      const b = 'B' + String(n).padStart(2, '0')
      if (!taken.has(b)) return b
    }
  }

} // class Brin

Object.assign(Brin.prototype, BrinDom)
