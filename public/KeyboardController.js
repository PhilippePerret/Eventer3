import LOG from './system/LOG.js'

export default class KeyboardController {

  constructor() {
    this.currentLister = null
  }

  setCurrentLister(lister) {
    this.currentLister = lister
  }

  observe() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyDown(event) {

    if (!this.currentLister) return

    LOG.m(3, 'Keyboard event', event.key)

    switch (event.key) {

      case 'ArrowDown':
        LOG.m(2, 'Select next item')
        this.currentLister.selectNextItem()
        event.preventDefault()
        break

      case 'ArrowUp':
        LOG.m(2, 'Select previous item')
        this.currentLister.selectPreviousItem()
        event.preventDefault()
        break

    }

  }

}