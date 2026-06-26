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

  static generateUniqueBadge(patronyme, title, existingBadges) {
    const taken = new Set(existingBadges)
    const try_ = c => (c && !taken.has(c)) ? c : null
    const fallback = () => { for (let n = 1; ; n++) { const b = 'C' + n; if (!taken.has(b)) return b } }

    if (patronyme && patronyme.trim()) {
      const parts = patronyme.trim().toUpperCase().split(/\s+/)
      const c1  = parts[0]?.[0]
      const nom = parts[1] ?? ''
      if (!c1) return fallback()
      // step 1: c1 + nom[0]
      if (nom) { const r = try_(c1 + nom[0]); if (r) return r }
      // step 2: c1 + nom[1], nom[2]…
      for (let i = 1; i < nom.length; i++) { const r = try_(c1 + nom[i]); if (r) return r }
      // step 3: c1 + nextAlpha(nom[i])
      for (let i = 0; i < nom.length; i++) {
        const r = try_(c1 + String.fromCharCode(((nom.charCodeAt(i) - 65 + 1) % 26) + 65))
        if (r) return r
      }
      return fallback()
    }

    if (!title || !title.trim()) return fallback()
    const t = title.trim().toUpperCase()
    if (t.length === 1) {
      for (let k = 65; k <= 90; k++) { const r = try_(t[0] + String.fromCharCode(k)); if (r) return r }
      return fallback()
    }
    // step 1: t[0] + t[1]
    { const r = try_(t[0] + t[1]); if (r) return r }
    // step 2: t[0] + t[2], t[3]…
    for (let i = 2; i < t.length; i++) { const r = try_(t[0] + t[i]); if (r) return r }
    // step 3: t[0] + nextAlpha(t[i])
    for (let i = 1; i < t.length; i++) {
      const r = try_(t[0] + String.fromCharCode(((t.charCodeAt(i) - 65 + 1) % 26) + 65))
      if (r) return r
    }
    return fallback()
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
