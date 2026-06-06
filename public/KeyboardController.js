import LOG from './system/LOG.js'
import ShortcutsPanel from './classes/ui/ShortcutsPanel.js'
import ToolsPanel from './classes/ui/ToolsPanel.js'

export default class KeyboardController {

  constructor() {
    this.activeLister = null
    this.modeStack = []
    this.shortcutsPanel = new ShortcutsPanel()
    this.toolsPanel = new ToolsPanel()
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

    const initialValue = defaultInput?.value ?? ''

    requestAnimationFrame(() => {

      if (!defaultInput) return

      defaultInput.focus()
      if (initialValue) defaultInput.select()

    })

  }

  onKeyDown(event) {

    // Règle globale : Cmd+Enter ferme le panneau ouvert (raccourcis ou lister courant)
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      if (this.shortcutsPanel.isVisible) {
        this.shortcutsPanel.close()
      } else {
        this.activeLister?.close()
      }
      return
    }

    // Modes spéciaux (popup-select…)
    const currentMode = this.getCurrentMode()
    if (currentMode) {
      void currentMode.onKeyDown(event, this)
      return
    }

    // Édition contentEditable en cours
    if (this.activeLister?.editing) {
      this.activeLister._handleEditingKeyDown(event)
      return
    }

    if (event.key === '?' && !event.metaKey && !event.ctrlKey) {
      event.preventDefault()
      this.shortcutsPanel.open()
      return
    }

    if (!this.activeLister) return

    // Sur Mac, Alt+lettre produit event.key modifié ('˜','µ'…) — event.code est fiable
    if (event.altKey && !event.metaKey && !event.ctrlKey && event.code === 'KeyN') {
      this.activeLister.createNewItemAfter?.()
      event.preventDefault()
      return
    }

    LOG.m(3, 'Keyboard event', event.key, { metaKey: event.metaKey, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey })

    switch (event.key) {

      case 'Enter':
        this.activeLister.editSelectedItem()
        event.preventDefault()
        return

      case 'n':
        if (event.metaKey || event.ctrlKey) return
        if (event.altKey) {
          this.activeLister.createNewItemAfter?.()
        } else {
          LOG.m(2, 'Create new item')
          this.activeLister.createNewItem()
        }
        event.preventDefault()
        return

      case ' ':
        this.activeLister.toggleSelectedItemChecked?.()
        event.preventDefault()
        return

      case 'b':
        if (typeof this.activeLister.openBrinPanel === 'function') {
          this.activeLister.openBrinPanel().catch(err => console.error('openBrinPanel:', err))
          event.preventDefault()
        }
        return

      case 'k':
        if (event.metaKey || event.ctrlKey) {
          this.activeLister.openToolsPanel?.()
          event.preventDefault()
        }
        return

      case 'm':
        if (event.metaKey || event.ctrlKey) {
          this.activeLister.toggleDisplayMode?.()
          event.preventDefault()
        }
        return

      case 'p':
        if (typeof this.activeLister.openPersoPanel === 'function') {
          this.activeLister.openPersoPanel().catch(err => console.error('openPersoPanel:', err))
          event.preventDefault()
        }
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
          if (this.shortcutsPanel.isVisible) this.shortcutsPanel.nextContext()
          else this.activeLister.moveSelectedItemDown()
        } else {
          this.activeLister.selectNextItem()
        }
        event.preventDefault()
        return

      case 'ArrowUp':
        if (event.metaKey) {
          if (this.shortcutsPanel.isVisible) this.shortcutsPanel.previousContext()
          else this.activeLister.moveSelectedItemUp()
        } else {
          this.activeLister.selectPreviousItem()
        }
        event.preventDefault()
        return

      case 'c':
        if (event.metaKey || event.ctrlKey) {
          this.activeLister.copySelectedItem?.()
          event.preventDefault()
        }
        return

      case 'x':
        if (event.metaKey || event.ctrlKey) {
          this.activeLister.cutSelectedItem?.()
          event.preventDefault()
        }
        return

      case 'v':
        if (event.metaKey || event.ctrlKey) {
          this.activeLister.pasteItem?.().catch(err => console.error('pasteItem:', err))
          event.preventDefault()
        }
        return

      case 'Delete':
        this.activeLister.deleteSelectedItem?.()
        event.preventDefault()
        return

      case 'Escape':
        this.activeLister.close()
        event.preventDefault()
        return

    }

  }

}