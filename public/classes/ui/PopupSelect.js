import { stopEvent } from '../utils/events.js'

export default class PopupSelect {

  static HANDLEKEYS       = { ArrowDown: true, ArrowUp: true, Escape: true, Enter: true, Tab: true, ' ': true }
  static NOT_STOPPED_KEYS = { Tab: true, Enter: true, ' ': true }

  constructor({ options, currentValue, multi = false, allowCustom = false, onSelect, onCancel, onChange = null, onTab = null, keyboardController = null, disabledValues = [], title = null, showSearch = true }) {
    this.options = options
    this.multi = multi
    this.allowCustom = allowCustom
    this.onSelect = onSelect
    this.onCancel = onCancel
    this.onChange = onChange
    this.onTab = onTab
    this.keyboardController = keyboardController
    this.disabledValues = disabledValues
    this.currentValue = currentValue
    this.title = title
    this.showSearch = showSearch
    this.selectedValues = multi ? (Array.isArray(currentValue) ? [...currentValue] : []) : []
    this.focusedIndex = 0
    this.filteredOptions = [...options]
    this.popupElement = null
    this.searchInput = null
    this.listElement = null
    this._boundKeyDown = null
  }

  attachAnchor(el) {
    this._anchor = el
    el.addEventListener('keydown', ev => this.handleKeyDown(ev, null))
  }

  open(anchorElement) {
    this._render(anchorElement)
    if (this.keyboardController) {
      this.keyboardController.pushMode({
        type: 'popup-select',
        onKeyDown: (event, controller) => this.handleKeyDown(event, controller)
      })
    } else {
      this._boundKeyDown = (event) => {
        const intercepted = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', ' ']
        if (intercepted.includes(event.key)) event.stopPropagation()
        this.handleKeyDown(event, null)
      }
      document.addEventListener('keydown', this._boundKeyDown, { capture: true })
    }
    requestAnimationFrame(() => { if (this.searchInput) this.searchInput.focus() })
  }

  close() {
    if (this.keyboardController) {
      this.keyboardController.popMode()
    } else if (this._boundKeyDown) {
      document.removeEventListener('keydown', this._boundKeyDown, { capture: true })
      this._boundKeyDown = null
    }
    this.popupElement?.remove()
    this.popupElement = null
  }

  _render(anchorElement) {
    const popup = document.createElement('div')
    popup.className = 'popup-select'

    const rect = anchorElement.getBoundingClientRect()
    popup.style.top = `${rect.bottom + 4}px`
    popup.style.left = `${rect.left}px`  // ajusté après rendu si débordement

    if (this.title) {
      const titleEl = document.createElement('div')
      titleEl.className   = 'popup-select__title'
      titleEl.textContent = this.title
      popup.appendChild(titleEl)
    }

    let search = null
    if (this.showSearch) {
      search = document.createElement('input')
      search.type = 'text'
      search.className = 'popup-select__search'
      search.placeholder = 'Filtrer…'
      search.addEventListener('input', () => this._onSearchInput())
      popup.appendChild(search)
    }

    const list = document.createElement('ul')
    list.className = 'popup-select__list'
    popup.appendChild(list)

    if (this.multi) {
      const footer = document.createElement('div')
      footer.className = 'popup-select__footer'
      footer.textContent = 'Space : cocher · ↵ confirmer · Esc annuler'
      popup.appendChild(footer)
    }

    document.body.appendChild(popup)
    this.popupElement = popup
    this.searchInput  = search
    this.listElement  = list

    if (!this.multi && this.currentValue !== undefined) {
      const idx = this.options.findIndex(o => o.value === this.currentValue)
      if (idx >= 0) this.focusedIndex = idx
    }

    this._renderOptions()

    const popupRect = popup.getBoundingClientRect()

    const overflowRight = popupRect.right - window.innerWidth
    if (overflowRight > 0) {
      popup.style.left = `${Math.max(8, rect.left - overflowRight - 8)}px`
    }

    const overflowBottom = popupRect.bottom - window.innerHeight
    if (overflowBottom > 0) {
      this.listElement.style.maxHeight = `${this.listElement.offsetHeight - overflowBottom - 8}px`
    }
  }

  _renderOptions() {
    this.listElement.innerHTML = ''

    this.filteredOptions.forEach((opt, i) => {
      const li = document.createElement('li')
      li.className = 'popup-select__option'
      if (i === this.focusedIndex) li.classList.add('focused')

      if (this.multi) {
        const checked = this.selectedValues.includes(opt.value)
        if (checked) li.classList.add('checked')
        const check = document.createElement('span')
        check.className = 'popup-select__check'
        check.textContent = checked ? '✓' : ''
        li.appendChild(check)
        li.appendChild(document.createTextNode(' ' + opt.label))
      } else {
        if (opt.value === this.currentValue) li.classList.add('current')
        const check = document.createElement('span')
        check.className = 'popup-select__check'
        li.appendChild(check)
        li.appendChild(document.createTextNode(opt.label))
      }

      if (this.disabledValues.includes(opt.value)) {
        li.classList.add('disabled')
      }

      li.dataset.index = i
      li.dataset.value = String(opt.value)
      li.addEventListener('click', () => { if (!this.disabledValues.includes(opt.value)) this._selectByIndex(i) })
      this.listElement.appendChild(li)
    })

    if (this.allowCustom && this.searchInput?.value.trim()) {
      const query = this.searchInput.value.trim()
      const exactMatch = this.filteredOptions.some(o => o.label.toLowerCase() === query.toLowerCase())
      if (!exactMatch) {
        const li = document.createElement('li')
        li.className = 'popup-select__option popup-select__option--custom'
        li.textContent = `Ajouter « ${query} »`
        li.addEventListener('click', () => this._addCustomValue(query))
        this.listElement.appendChild(li)
      }
    }

    const focused = this.listElement.querySelector('.popup-select__option.focused')
    if (focused) focused.scrollIntoView({ block: 'nearest' })
  }

  _onSearchInput() {
    const query = this.searchInput.value.toLowerCase()
    this.filteredOptions = query
      ? this.options.filter(o => o.label.toLowerCase().includes(query))
      : [...this.options]
    this.focusedIndex = 0
    this._renderOptions()
  }

  _focusOption(index) {
    const len = this.filteredOptions.length
    if (len === 0) return
    if (index < 0) index = len - 1
    if (index >= len) index = 0
    this.focusedIndex = index
    this._renderOptions()
  }

  _selectByIndex(index) {
    const opt = this.filteredOptions[index]
    if (!opt) return
    if (this.disabledValues.includes(opt.value)) return
    if (this.multi) {
      const i = this.selectedValues.indexOf(opt.value)
      if (i >= 0) this.selectedValues.splice(i, 1)
      else this.selectedValues.push(opt.value)
      this._renderOptions()
      this.onChange?.([...this.selectedValues])
    } else {
      this.currentValue = opt.value
      this.close()
      this.onSelect(opt.value)
    }
  }

  _addCustomValue(label) {
    if (this.multi) {
      if (!this.selectedValues.includes(label)) this.selectedValues.push(label)
      this.searchInput.value = ''
      this._onSearchInput()
    } else {
      this.close()
      this.onSelect(label)
    }
  }

  _confirm() {
    if (this.multi) {
      this.close()
      this.onSelect([...this.selectedValues])
    } else {
      const opt = this.filteredOptions[this.focusedIndex]
      if (opt) {
        this.currentValue = opt.value
        this.close()
        this.onSelect(opt.value)
      }
    }
  }

  handleKeyDown(event, _controller) {
    if (!PopupSelect.HANDLEKEYS[event.key]) return
    if (!PopupSelect.NOT_STOPPED_KEYS[event.key]) stopEvent(event)

    switch (event.key) {
      case 'Tab':
        this.close()
        if (this.onTab) this.onTab()
        else if (this.onCancel) this.onCancel()
        return
      case 'ArrowDown':
        if (!this.popupElement) { this.open(this._anchor); return }
        this._focusOption(this.focusedIndex + 1)
        return
      case 'ArrowUp':
        if (!this.popupElement) return
        this._focusOption(this.focusedIndex - 1)
        return
      case 'Enter':
        stopEvent(event)
        if (!this.popupElement) { this.open(this._anchor); return }
        if (this.allowCustom && this.searchInput.value.trim()) {
          const query = this.searchInput.value.trim()
          const match = this.filteredOptions.find(o => o.label.toLowerCase() === query.toLowerCase())
          if (match) this._selectByIndex(this.filteredOptions.indexOf(match))
          else this._addCustomValue(query)
        } else {
          this._confirm()
        }
        return
      case ' ':
        if (this.multi && !this.searchInput?.value) {
          stopEvent(event)
          this._selectByIndex(this.focusedIndex)
        }
        return
      case 'Escape':
        this.close()
        if (this.onCancel) this.onCancel()
        return
    }
  }
}
