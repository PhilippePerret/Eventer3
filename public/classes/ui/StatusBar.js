export default class StatusBar {

  static _displayMode = 'NESTING'
  static _filterState = 'none'  // 'none' | 'mode' | 'active'
  static _currentListerType = 'events'

  static update(listerType) {
    StatusBar._currentListerType = listerType
    const el = document.querySelector('#status-bar')
    if (!el) return
    let text
    if (listerType === 'projects') {
      text = 'DISP MODE PROJECTS'
    } else {
      text = `DISP MODE ${StatusBar._displayMode}`
    }
    let badge = ''
    if (StatusBar._filterState === 'mode') {
      badge = '<span class="status-filter-badge status-filter-badge--mode">FILTRE</span>'
    } else if (StatusBar._filterState === 'active') {
      badge = '<span class="status-filter-badge status-filter-badge--active">FILTRE</span>'
    }
    el.innerHTML = `<span>${text}</span>${badge}`
  }

  static setFilterState(state) {
    StatusBar._filterState = state
    StatusBar.update(StatusBar._currentListerType)
  }

  static toggleDisplayMode() {
    StatusBar._displayMode = StatusBar._displayMode === 'NESTING' ? 'LEVEL' : 'NESTING'
    StatusBar.update('events')
    return StatusBar._displayMode
  }

  static get displayMode() {
    return StatusBar._displayMode
  }

  static resetToNesting() {
    StatusBar._displayMode = 'NESTING'
  }

}
