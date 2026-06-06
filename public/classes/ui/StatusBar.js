export default class StatusBar {

  static _displayMode = 'NESTING'

  static update(listerType) {
    const el = document.querySelector('#status-bar')
    if (!el) return
    if (listerType === 'projects') {
      el.textContent = 'DISP MODE PROJECTS'
    } else {
      el.textContent = `DISP MODE ${StatusBar._displayMode}`
    }
  }

  static toggleDisplayMode() {
    StatusBar._displayMode = StatusBar._displayMode === 'NESTING' ? 'LEVEL' : 'NESTING'
    StatusBar.update('events')
    return StatusBar._displayMode
  }

  static get displayMode() {
    return StatusBar._displayMode
  }

}
