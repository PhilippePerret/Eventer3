import Brin from '../core/Brin.js'

export default {
  // Event : persos directs + persos hérités de ses brins (override du défaut de Item)
  _persoIdsForMarks() {
    const ids = new Set(this.perso_ids ?? [])
    const brins = this.project.itemsById['brins']
    for (const brinId of (this.brin_ids ?? [])) {
      brins[brinId]?.perso_ids?.forEach(pid => ids.add(pid))
    }
    return [...ids]
  },

  /**
   * Retourne les marks (badges pour le moment) de tous les brins de l'event
   */
  brinsMarks() {
    const brins = this.project.itemsById['brins']
    const content = (this.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-mark"${style}>${Brin.markOf(b)}</span>`
    }).join('')
    return `<div class="brins-marks ${this.minClass}-brins-marks">${content}</div>`
  }
}
