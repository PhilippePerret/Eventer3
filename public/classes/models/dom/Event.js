import Brin from '../core/Brin.js'
import ListerBrin from '../core/ListerBrin.js'
import Perso from '../core/Perso.js'
import ListerPerso from '../core/ListerPerso.js'

export default {
  /** Retourne les marks des personnages (avatar ou badge) de l'event et de tous ses brins */
  persosMarks() {
    const persos = ListerPerso.pool
    const content = (this.perso_ids ?? []).map(id => {
      const p = persos[id]
      if (!p) return ''
      const style = p.color ? ` style="background:${p.color}"` : ''
      return `<span class="panel-mark"${style}>${Perso.markOf(p)}</span>`
    }).join('')
    return `<div class="persos-marks ${this.minClass}-persos-marks">${content}</div>`
  },

  /**
   * Retourne les marks (badges pour le moment) de tous les brins de l'event
   */
  brinsMarks() {
    const brins = ListerBrin.pool
    const content = (this.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-mark"${style}>${Brin.markOf(b)}</span>`
    }).join('')
    return `<div class="brins-marks ${this.minClass}-brins-marks">${content}</div>`
  }
}
