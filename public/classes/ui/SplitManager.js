import PopupSelect from './PopupSelect.js'

export default class SplitManager {
  static openSplitChoice(keyboardController) {
    if (window === window.parent) return
    const anchor = {
      getBoundingClientRect: () => ({
        bottom: window.innerHeight / 2,
        left:   window.innerWidth  / 2 - 80,
        right:  window.innerWidth  / 2 + 80,
        top:    window.innerHeight / 2,
      })
    }
    new PopupSelect({
      options: [
        { value: 'vertical',   label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
      ],
      keyboardController,
      onSelect: (value) => {
        window.parent.postMessage({ type: 'shell-action', action: 'split-open', direction: value }, '*')
      }
    }).open(anchor)
  }

  static cyclePanes() {
    if (window === window.parent) return false
    const pane2 = window.parent.document.getElementById('pane-2')
    if (!pane2?.hasAttribute('data-split-active')) return false
    const myPaneId = window.frameElement?.id
    const action = myPaneId === 'pane-2' ? 'focus-pane-1' : 'focus-pane-2'
    window.parent.postMessage({ type: 'shell-action', action }, '*')
    return true
  }
}
