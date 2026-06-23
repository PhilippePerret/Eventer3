export default {
  /** Retourne les marks des personnages (avatar ou badge) de l'event et de tous ses brins */
  persosMarks() {

    
  },

  /**
   * Retourne les marks (badges pour le moment) de tous les brins de l'event
   */
  brinsMarks() {
    const brins = this.parentLister?.brins ?? {}
    return (this.brin_ids ?? []).map(id => {
      const b = brins[id]
      if (!b) return ''
      const style = b.color ? ` style="background:${b.color}"` : ''
      return `<span class="panel-badge"${style}>${b.badge ?? '?'}</span>`
    }).join('')
  }
}
