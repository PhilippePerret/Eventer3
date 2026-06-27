import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { PERSO_TYPES, PERSO_FONCTIONS, PERSO_COLORS, PERSO_AVATARS } from '../constants/Perso.js'
import PersoDom from '../dom/Perso.js'
import { raise, getErr } from '../../../system/Error.js'
import Notification from '../../ui/Notification.js'


export default class Perso extends Item {
  static get thingName() { return WORD_FORMS.Perso }
  static COLORS = PERSO_COLORS

  static markOf(data) { return data.avatar || data.badge }
  markOf() { return Perso.markOf(this) }

  constructor(data = {}) {
    super(data)
    this.badge  = data.badge  || Perso.generateUniqueBadge(this)
    this.avatar = data.avatar ?? null
    this.patronyme = data.patronyme ?? null
  }

  // INTERDICTION FORMELLE D'AJOUTER UNE PROPRIÉTÉ cssClass OU CONSORT !!! TOUTES LES PROPRIÉTÉS CSS DÉCOULENT NATURELLEMENT DE LA CLASSE MINUSCULE, DU :name ET DU :warper. CES TROIS VALEURS SUFFISENT AMPLEMENT POUR DÉSIGNER PRÉCISÉMENT L'ÉLÉMENT.
  get PROPS() {
    return this._props || (this._props = [
        { name: 'title', type: 'text'   , warper: 'body', oncreating: 'setBadgeOnCreating', unique: true}
      , { name: 'patronyme', type: 'text'   , warper: 'edits', oncreating: 'setBadgeOnCreating', unique: true}
      , { name: 'avatar', type: 'select'   , warper: 'edits', values: PERSO_AVATARS}
      , { name: 'badge', type: 'text'   , warper: 'edits', onchange: 'checkBadgeValue', unique: true, value: 'markOf'}
      , { name: 'type', type: 'select' , warper: 'edits',  values: PERSO_TYPES }
      , { name: 'fonction', type: 'select-and-text' , multiple: true, warper: 'edits',  values: PERSO_FONCTIONS }
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
  setBadgeOnCreating(el, field) {
    const val = el.textContent?.trim()
    if (!val || (this.badge && !this.__isTemporary)) return
    const oldVal        = this[field.name]
    this[field.name]    = val
    this.badge          = Perso.generateUniqueBadge(this)
    this[field.name]    = oldVal
    const badgeEl = this.el?.querySelector('[data-field="badge"]') ?? this.el?.querySelector('.perso-badge')
    if (badgeEl) badgeEl.textContent = this.markOf()
  }

  /**
   * Méthode appelé quand on change le badge du personnage
   * S'assure qu'il est unique
   */
  checkBadgeValue(el, field) {
    const val = el.textContent?.trim()
    if (val === field._curvalue) return
    if (this.parentLister.existingBadges.has(val)) {
      Notification.show(getErr(3010, val))
      el.textContent = field._curvalue
    }
  }

  static generateUniqueBadge(perso) {
    const taken = perso.parentLister.existingBadges
    const pseudo = (perso.title     ?? raise(11, perso.id)).toUpperCase()
    const patron = (perso.patronyme ?? '').toUpperCase()

    const badge = patron
      ? this.generateUniqueBadgeFromPatronyme(taken, patron)
      : this.generateUniqueBadgeFromPseudo(taken, pseudo)
    taken.add(badge)
    return badge
  }
  static generateUniqueBadgeFromPatronyme(taken, base){
    let bg
    const words = base.split(/\s+/), word1 = words[0], word2 = words[1] || 'A'
    for(var i1 = 0, len1 = word1.length; i1 < len1; ++ i1) {
      for(var i2 = 0, len2 = word2.length; i2 < len2; ++i2){
        if (!taken.has(bg = word1[i1] + word2[i2])) return bg
      }
    }
    return this.badgePerDepit(word1[0], taken)
  }
  static generateUniqueBadgeFromPseudo(taken, base) {
    const len = base.length
    let root = base[0]
    var i = 1
    var bg
    // On essaie avec toutes les lettres du pseudo
    for (var i = 1; i < len; ++i){
      if (!taken.has(bg = root + base[i])) return bg
    }
    return this.badgePerDepit(root, taken)
  }

  static badgePerDepit(root, taken){
    let bg
    // On essaie avec toutes les lettres avec la première (A->Z)
    for(var c=65;c<=90;++c){if (!taken.has(bg = root + String.fromCharCode(c))){ return bg}}
    // On essaie toutes les combinaisons de lettres
    for(c=65;c<=90;++c){
      root = String.fromCharCode(c)
      for(var c2=65;c2<=90;++c2){
        if (!taken.has(bg = root + String.fromCharCode(c2))){ return bg}
      }
    }
    // Par dépit, on met un nombre de 10 à 99
    for (var i = 10; i < 100; ++i) {if (!taken.has(bg = String(i))) return bg }
  }

} // class Perso

Object.assign(Perso.prototype, PersoDom)
