import LOG from './system/LOG.js'

export default class KeyboardController {

  constructor() {
    this.activeLister = null
    this.modeStack = []
  }

  register(lister) {
    LOG.m(2, 'Register lister', lister.id)
    this.activeLister = lister
  }

  observe() {
    document.addEventListener('keydown', event => {
      const mode = this.getCurrentMode()
      if (mode) {
        mode.onKeyDown(event)
        return
      }
      this.onKeyDown(event)
    })
  }

  pushMode(mode) {
    this.modeStack.push(mode)
  }

  popMode() {
    this.modeStack.pop()
  }

  getCurrentMode() {
    return this.modeStack[this.modeStack.length - 1]
  }

  onKeyDown(event) {

    if (!this.activeLister) return

    LOG.m(3, 'Keyboard event', event.key, { metaKey: event.metaKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey })

    switch (event.key) {

      case 'n':
        this.activeLister.createNewItem()
        event.preventDefault()
        return

      case 'ArrowDown':

        if (event.metaKey) {
          this.activeLister.moveSelectedItemDown()
        } else {
          this.activeLister.selectNextItem()
        }

        event.preventDefault()
        return

      case 'ArrowUp':

        if (event.metaKey) {
          this.activeLister.moveSelectedItemUp()
        } else {
          this.activeLister.selectPreviousItem()
        }

        event.preventDefault()
        return

    }

  }

}
