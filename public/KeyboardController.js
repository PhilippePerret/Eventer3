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
    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  pushMode(mode) {
    LOG.m(2, 'KeyboardController.pushMode', mode)
    this.modeStack.push(mode)
  }

  popMode() {
    LOG.m(2, 'KeyboardController.popMode')
    this.modeStack.pop()
  }

  getCurrentMode() {
    return this.modeStack[this.modeStack.length - 1] ?? null
  }

  enterItemEdition({ defaultInput = null, onKeyDown }) {

    this.pushMode({
      type: 'item-edition',
      onKeyDown
    })

    requestAnimationFrame(() => {

      if (!defaultInput) return

      defaultInput.focus()
      defaultInput.select()

    })

  }

  onKeyDown(event) {

    const currentMode = this.getCurrentMode()

    if (currentMode) {
      void currentMode.onKeyDown(event, this)
      return
    }

    if (!this.activeLister) return

    LOG.m(3, 'Keyboard event', event.key, { metaKey: event.metaKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey })

    switch (event.key) {

      case 'n':
        LOG.m(2, 'Create new item')
        this.activeLister.createNewItem()
        event.preventDefault()
        return

      case 'ArrowRight':
        this.activeLister.enterSelectedItem().catch(err => console.error('enterSelectedItem:', err))
        event.preventDefault()
        return

      case 'ArrowLeft':
        LOG.m(2, 'Leave current lister')
        this.activeLister.leaveToParent()
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