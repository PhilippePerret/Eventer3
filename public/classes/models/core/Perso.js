import Item from '../abstract/Item.js'
import { WORD_FORMS } from '../../../constants/constants.js'
import { PERSO_TYPES, PERSO_FONCTIONS, PERSO_COLORS } from '../constants/Perso.js'
import PersoDom from '../dom/Perso.js'


export default class Perso extends Item {
  static get thingName() { return WORD_FORMS.Perso }
  static COLORS = PERSO_COLORS

  static markOf(data) { return data.avatar || data.badge }

  static generateBadge(patronyme, title) {
    if (patronyme && patronyme.trim()) {
      const parts = patronyme.trim().split(/\s+/)
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
      const p = parts[0].toUpperCase()
      return p.length >= 2 ? p.slice(0, 2) : p.padEnd(2, p[0])
    }
    if (!title || !title.trim()) return null
    const t = title.trim().toUpperCase()
    return t.length >= 2 ? t.slice(0, 2) : t.padEnd(2, t[0])
  }

  static generateUniqueBadge(perso) {
    const taken = perso.parentLister.existingBadges
    const pseudo = perso.title.toUpperCase()
    const patron = perso.patronyme.toUpperCase()

    const badge = patron
      ? this.generateUniqueBadgeFromPatronyme(taken, patron)
      : this.generateUniqueBadgeFromPseudo(taken, pseudo)
    taken.add(badge)
    return badge
  }
  static generateUniqueBadgeFromPatronyme(taken, base){
    let bg
    const words = base.split(/\s+/), word1 = words[0], word2 = words[1]
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
    return badgePerDepit(root, taken)
  }

  static badgePerDepit(root, taken){
    let bg
    // On essaie avec toutes les lettres avec la première (A->Z)
    for(var c=65;c<90;++c){if (!taken.has(bg = root + String.fromCharCode(c))){ return bg}}
    // On essaie toutes les combinaisons de lettres
    for(c=65;c<90;++c){
      root = String.fromCharCode(c)
      for(var c2=65;c2<90;++c2){
        if (!taken.has(bg = root + String.fromCharCode(c2))){ return bg}
      }
    }
    // Par dépit, on met un nombre de 10 à 99
    for (i = 10; i < 100; ++i) {if (!taken.has(bg = String(i))) return bg }
  }

  constructor(data = {}) {
    super(data)
    this.badge  = data.badge  || Perso.generateBadge(this.patronyme, this.title)
    this.avatar = data.avatar ?? null
  }

  existingBadges() {
    return (this.parentLister?.items ?? [])
      .filter(p => p.id !== this.id)
      .map(p => p.badge)
      .filter(Boolean)
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
