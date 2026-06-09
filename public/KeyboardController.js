import LOG from './system/LOG.js'
import ShortcutsPanel from './classes/ui/ShortcutsPanel.js'
import ToolsPanel from './classes/ui/ToolsPanel.js'
import FilterBar from './classes/ui/FilterBar.js'
import Notification from './classes/ui/Notification.js'
import ListerRepository from './classes/repositories/ListerRepository.js'
import Brin from './classes/models/Brin.js'
import Perso from './classes/models/Perso.js'

export default class KeyboardController {

  // Panels ordered by z-index ascending (reversed = highest first)
  static MOVABLE_PANEL_IDS = ['#filter-selector-panel', '#brin-panel', '#perso-panel', '#style-panel', '#shortcuts-panel', '#tools-panel']

  constructor() {
    this.activeLister = null
    this.modeStack = []
    this.shortcutsPanel = new ShortcutsPanel()
    this.toolsPanel = new ToolsPanel()
    this._panelOffsets = new WeakMap()
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

    // Ctrl+Shift+Arrow : déplacer le panneau au premier plan
    if (event.ctrlKey && event.shiftKey && !event.metaKey && ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const el = this._getMovableElement()
      if (el) {
        this._movePanel(el, event.key)
        event.preventDefault()
        return
      }
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
      this.activeLister.createNewItem?.()
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
          this.activeLister.createNewItem?.()
        } else {
          LOG.m(2, 'Create new item after')
          this.activeLister.createNewItemAfter?.()
        }
        event.preventDefault()
        return

      case ' ':
        this.activeLister.toggleSelectedItemChecked?.()
        event.preventDefault()
        return

      case 'b': case 'B':
        if (this.activeLister.constructor.name === 'BrinLister') {
          this.activeLister.close()
          event.preventDefault()
        } else if (typeof this.activeLister.openBrinPanel === 'function') {
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

      case 'p': case 'P':
        if (this.activeLister.constructor.name === 'PersoLister') {
          this.activeLister.close()
          event.preventDefault()
        } else if (typeof this.activeLister.openPersoPanel === 'function') {
          this.activeLister.openPersoPanel().catch(err => console.error('openPersoPanel:', err))
          event.preventDefault()
        }
        return

      case 's': case 'S':
        if (this.activeLister.constructor.name === 'StyleLister') {
          this.activeLister.close()
          event.preventDefault()
        } else if (typeof this.activeLister.openStylePanel === 'function') {
          this.activeLister.openStylePanel({ applyToCheckedEvents: event.shiftKey }).catch(err => console.error('openStylePanel:', err))
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
        } else if (event.altKey && this.activeLister.backgroundLister) {
          this.activeLister.backgroundLister.selectNextItem()
          void this.activeLister.onBackgroundSelectionChange?.()
        } else {
          this.activeLister.selectNextItem()
        }
        event.preventDefault()
        return

      case 'ArrowUp':
        if (event.metaKey) {
          if (this.shortcutsPanel.isVisible) this.shortcutsPanel.previousContext()
          else this.activeLister.moveSelectedItemUp()
        } else if (event.altKey && this.activeLister.backgroundLister) {
          this.activeLister.backgroundLister.selectPreviousItem()
          void this.activeLister.onBackgroundSelectionChange?.()
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

      case ':':
        if (event.metaKey || event.ctrlKey) {
          this._enterFilterSequence()
          event.preventDefault()
        }
        return

      case 'Escape':
        this.activeLister.close()
        event.preventDefault()
        return

    }

  }

  _getMovableElement() {
    const ids = [...KeyboardController.MOVABLE_PANEL_IDS].reverse()
    for (const id of ids) {
      const el = document.querySelector(id)
      if (!el || el.classList.contains('hidden')) continue
      const kids = el.children
      return kids.length === 1 ? kids[0] : el
    }
    return null
  }

  _movePanel(el, direction) {
    const step = 50
    if (!this._panelOffsets.has(el)) this._panelOffsets.set(el, { dx: 0, dy: 0 })
    const offset = this._panelOffsets.get(el)
    if (direction === 'ArrowDown')  offset.dy += step
    if (direction === 'ArrowUp')    offset.dy -= step
    if (direction === 'ArrowRight') offset.dx += step
    if (direction === 'ArrowLeft')  offset.dx -= step
    el.style.translate = `${offset.dx}px ${offset.dy}px`
  }

  _enterFilterSequence() {
    FilterBar.showHint()
    this.pushMode({
      type: 'filter-sequence',
      onKeyDown: (event, kc) => {
        event.preventDefault()
        kc.popMode()
        if (event.key === ':') {
          kc._clearAllFilters()
          return
        }
        FilterBar.update(kc.activeLister.filterState, kc.activeLister)
        if (event.key === 't') kc._enterFilterText()
        else if (event.key === 'b') kc._enterFilterBrins()
        else if (event.key === 'p') kc._enterFilterPersos()
        // Escape ou autre touche : quitte silencieusement
      }
    })
  }

  _enterFilterText() {
    const input = document.getElementById('filter-input')
    if (!input) return
    input.value = ''
    input.classList.remove('hidden')
    input.focus()

    const applyLive = () => {
      const query = input.value.trim()
      const lister = this.activeLister
      if (!lister) return
      if (query) {
        lister.filterState.textFields.set('title', query)
      } else {
        lister.filterState.textFields.delete('title')
      }
      lister.applyFilter()
      FilterBar.update(lister.filterState, lister)
    }

    input.addEventListener('input', applyLive)

    this.pushMode({
      type: 'filter-text',
      onKeyDown: (event, kc) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          input.removeEventListener('input', applyLive)
          input.classList.add('hidden')
          FilterBar.update(kc.activeLister.filterState, kc.activeLister)
          kc.popMode()
        } else if (event.key === 'Escape') {
          event.preventDefault()
          input.removeEventListener('input', applyLive)
          input.value = ''
          input.classList.add('hidden')
          kc.activeLister.filterState.textFields.delete('title')
          kc.activeLister.applyFilter()
          FilterBar.update(kc.activeLister.filterState, kc.activeLister)
          kc.popMode()
        }
        // autres touches : ne pas intercepter → input reçoit le caractère
      }
    })
  }

  _enterFilterBrins()  { return this._enterFilterByType(Brin) }
  _enterFilterPersos() { return this._enterFilterByType(Perso) }

  async _enterFilterByType(ItemClass) {
    const singular = ItemClass.name.toLowerCase()
    const ids      = this.activeLister?.parentItem?.[`${singular}_ids`] ?? []
    const tn       = ItemClass.thingName
    if (ids.length === 0) {
      Notification.show(`Aucun ${tn.thing} à filtrer pour le moment`)
      return
    }
    const panel = document.getElementById('filter-selector-panel')
    if (!panel) return
    const data = await ListerRepository.loadItems({ id: `${this.activeLister.parentItem.id}-${singular}s` })
    this._openFilterSelector(panel, ids, data, `Filtrer par ${tn.thing}`, `${singular}Ids`)
  }

  _openFilterSelector(panel, ids, data, titleText, filterKey) {
    panel.innerHTML = ''

    const titleEl = document.createElement('div')
    titleEl.className = 'filter-selector-title'
    titleEl.textContent = titleText
    panel.appendChild(titleEl)

    const rows = []
    ids.forEach(id => {
      const item = data[id]
      if (!item) return
      const row = document.createElement('div')
      row.className = 'filter-selector-row'
      row.dataset.id = id
      if (this.activeLister.filterState[filterKey].has(id)) row.classList.add('checked')

      const badge = document.createElement('span')
      badge.className = 'filter-selector-badge'
      badge.textContent = item.badge ?? item.avatar ?? '?'
      if (item.color) badge.style.background = item.color
      row.appendChild(badge)

      const label = document.createElement('span')
      label.className = 'filter-selector-label'
      label.textContent = item.title ?? id
      row.appendChild(label)

      rows.push({ el: row, id })
      panel.appendChild(row)
    })

    if (rows.length > 0) rows[0].el.classList.add('focused')
    let focusIdx = 0
    panel.classList.remove('hidden')

    this.pushMode({
      type: 'filter-selector',
      onKeyDown: (event, kc) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          panel.classList.add('hidden')
          kc.popMode()
          FilterBar.update(kc.activeLister.filterState, kc.activeLister)
        } else if (event.key === 'Enter') {
          event.preventDefault()
          panel.classList.add('hidden')
          kc.popMode()
          kc.activeLister.applyFilter()
          FilterBar.update(kc.activeLister.filterState, kc.activeLister)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          rows[focusIdx]?.el.classList.remove('focused')
          focusIdx = (focusIdx + 1) % rows.length
          rows[focusIdx]?.el.classList.add('focused')
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          rows[focusIdx]?.el.classList.remove('focused')
          focusIdx = (focusIdx - 1 + rows.length) % rows.length
          rows[focusIdx]?.el.classList.add('focused')
        } else if (event.key === ' ') {
          event.preventDefault()
          const row = rows[focusIdx]
          if (!row) return
          const set = kc.activeLister.filterState[filterKey]
          if (set.has(row.id)) { set.delete(row.id); row.el.classList.remove('checked') }
          else                  { set.add(row.id);    row.el.classList.add('checked') }
        }
      }
    })
  }

  _clearAllFilters() {
    if (!this.activeLister) return
    this.activeLister.filterState.clear()
    this.activeLister.applyFilter()
    FilterBar.clear()
  }

}