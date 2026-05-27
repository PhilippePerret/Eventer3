import LOG from './system/LOG.js'

export default class KeyboardController {

  constructor() {
    this.activeLister = null
    this.mode = 'navigation'
    this.editor = null
  }

  register(lister) {
    LOG.m(2, 'Register lister', lister.id)
    this.activeLister = lister
  }

  observe() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  enterEditorMode(editor) {
    LOG.m(2, 'Enter editor mode')
    this.mode = 'editor'
    this.editor = editor
  }

  exitEditorMode() {
    LOG.m(2, 'Exit editor mode')
    this.mode = 'navigation'
    this.editor = null
  }

  onKeyDown(event) {

    if (this.mode === 'editor') {
      this.editor.onKeyDown(event)
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