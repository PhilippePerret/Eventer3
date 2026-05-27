import LOG from './system/LOG.js'

export default class KeyboardController {

  constructor() {
    this.activeLister = null
  }

  register(lister) {
    LOG.m(2, 'Register lister', lister)
    this.activeLister = lister
  }

  observe() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyDown(event) {

    if (!this.activeLister) return

    LOG.m(3, 'Keyboard event key', event.key, 'meta', event.metaKey, 'maj', event.shiftKey, 'ctrl', event.controlKey)

  if (event.metaKey) {

      switch (event.key) {

        case 'ArrowDown':
          LOG.m("[KeyboardController.js] Demande de déplacement vers le bas")
          this.activeLister.moveSelectedItemDown()
          event.preventDefault()
          return

        case 'ArrowUp':
          LOG.m("[KeyboardController.js] Demande de déplacement vers le haut")
          this.activeLister.moveSelectedItemUp()
          event.preventDefault()
          return

      }

    }
    switch (event.key) {

      case 'ArrowDown':
        LOG.m("[KeyboardController.js] Demande de sélection de l'item suivant")
        this.activeLister.selectNextItem()
        event.preventDefault()
        break

      case 'ArrowUp':
        LOG.m("[KeyboardController.js] Demande de sélection de l'item précédent")
        this.activeLister.selectPreviousItem()
        event.preventDefault()
        break

    }

  }

}