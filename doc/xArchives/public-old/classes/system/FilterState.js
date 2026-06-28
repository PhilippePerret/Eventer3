import Texte from '../../system/Texte.js'

export default class FilterState {

  constructor() {
    this.textFields = new Map()
    this.brinIds    = new Set()
    this.persoIds   = new Set()
  }

  isEmpty() {
    return this.textFields.size === 0 && this.brinIds.size === 0 && this.persoIds.size === 0
  }

  clear(condition = null) {
    if (!condition) {
      this.textFields.clear()
      this.brinIds.clear()
      this.persoIds.clear()
      return
    }
    if (condition === 'brins')  { this.brinIds.clear();  return }
    if (condition === 'persos') { this.persoIds.clear(); return }
    this.textFields.delete(condition)
  }

  matches(item) {
    for (const [field, query] of this.textFields) {
      const value = item[field]
      if (value == null) return false
      if (!Texte.normalize(value).toLowerCase().includes(Texte.normalize(query).toLowerCase())) return false
    }
    if (this.brinIds.size > 0) {
      const ids = item.brin_ids
      if (!ids || !ids.some(id => this.brinIds.has(id))) return false
    }
    if (this.persoIds.size > 0) {
      const ids = item.perso_ids
      if (!ids || !ids.some(id => this.persoIds.has(id))) return false
    }
    return true
  }

}
