import StatusBar from './StatusBar.js'

export default class FilterBar {

  static get el() { return document.getElementById('filter-bar') }

  static showHint() {
    const el = FilterBar.el
    if (!el) return
    el.textContent = 'Filtre — t=titre  b=brins  p=persos  ⎋=annuler'
    el.classList.remove('hidden')
    StatusBar.setFilterState('mode')
  }

  static update(filterState, lister = null) {
    const el = FilterBar.el
    if (!el) return
    if (filterState.isEmpty()) {
      StatusBar.setFilterState('none')
      el.classList.add('hidden')
      el.textContent = ''
      return
    }
    const hasHidden = lister ? lister.items.some(i => i._visible === false) : false
    StatusBar.setFilterState(hasHidden ? 'active' : 'mode')
    const parts = []
    for (const [field, query] of filterState.textFields) {
      const label = field === 'title' ? 'titre' : field
      parts.push(`${label} : "${query}"`)
    }
    el.textContent = parts.join('  ·  ')
    el.classList.remove('hidden')
  }

  static clear(el) {
    const target = el ?? FilterBar.el
    if (!target) return
    target.textContent = ''
    target.classList.add('hidden')
    StatusBar.setFilterState('none')
  }

}
