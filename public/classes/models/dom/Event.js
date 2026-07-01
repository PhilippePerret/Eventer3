import Brin from '../core/Brin.js'
import { EVENT_METEO_EXLUSIONS } from '../constants/Event.js'

export default {

  checkCompatibiliteMeteoEffet(fieldName) {
    if (fieldName === 'effet') return EVENT_METEO_EXLUSIONS[this.meteo] ?? []
    if (fieldName === 'meteo') {
      return Object.entries(EVENT_METEO_EXLUSIONS)
        .filter(([, excl]) => excl.includes(this.effet))
        .map(([m]) => m)
    }
    return []
  },

  setEffetPerMeteo(val) {
    const excl = EVENT_METEO_EXLUSIONS[val] ?? []
    if (excl.includes(this.effet)) this.effet = null
  },

  setMeteoPerEffet(val) {
    const incompatMeteos = Object.entries(EVENT_METEO_EXLUSIONS)
      .filter(([, excl]) => excl.includes(val))
      .map(([m]) => m)
    if (incompatMeteos.includes(this.meteo)) this.meteo = null
  },
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
  openStylePanel() { this.project.listerStyle.display(this) },

  _afterBuild() {
    if (this.css?.length) this.project?.listerStyle?.applyEventCss(this)
  },

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
