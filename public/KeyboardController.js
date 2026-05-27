export default class KeyboardController {

  constructor(lister) {
    this.lister = lister
  }

  observe() {
    document.addEventListener(
      'keydown',
      this.onKeyDown.bind(this)
    )
  }

  onKeyDown(event) {

    switch(event.key) {

      case 'ArrowDown':
        this.lister.selectNextItem()
        break

      case 'ArrowUp':
        this.lister.selectPreviousItem()
        break

    }

  }

}