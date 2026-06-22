import { StopEvent } from '../utils/events.js'
import PopupSelect from './PopupSelect.js'

export default class FilePicker {

  static open({ mode = 'folder', restoreFocusTo = null } = {}) {
    return new Promise((resolve) => {
      const picker = new FilePicker({
        mode,
        restoreFocusTo,
        onSelect: (path) => resolve(path),
        onCancel: () => resolve(null),
      })
      picker._init().catch(console.error)
    })
  }

  constructor({ mode, onSelect, onCancel, restoreFocusTo = null }) {
    this.mode             = mode
    this._onSelect        = onSelect
    this._onCancel        = onCancel
    this._restoreFocusTo  = restoreFocusTo
    this.currentPath      = ''
    this.entries          = []
    this.selectedIndex    = 0
    this._creatingFolder  = false
    this._focusableItems  = []
    this._focusIdx        = -1
  }

  async _init() {
    const pathResp = await fetch('/api/settings/last_path', { cache: 'no-store' })
    const pathData = await pathResp.json()

    this._buildDOM()

    let startPath = pathData.value
    if (!startPath) {
      const fsResp = await fetch('/api/fs', { cache: 'no-store' })
      const fsData = await fsResp.json()
      startPath    = fsData.path
    }
    await this._navigateTo(startPath)
  }

  _buildDOM() {
    this._overlay = document.createElement('div')
    this._overlay.className = 'file-picker-overlay'

    this._el = document.createElement('div')
    this._el.className = 'file-picker'
    this._el.setAttribute('tabindex', '-1')
    this._el.addEventListener('keydown', (e) => this._handleKey(e))

    // ── Titlebar (titre fixe) ─────────────────────────────────────────────
    const titleBar = document.createElement('div')
    titleBar.className = 'file-picker__titlebar'

    const lights = document.createElement('div')
    lights.className = 'file-picker__lights'
    ;['close', 'minimize', 'maximize'].forEach(cls => {
      const dot = document.createElement('span')
      dot.className = `file-picker__light file-picker__light--${cls}`
      lights.appendChild(dot)
    })

    this._folderNameEl = document.createElement('div')
    this._folderNameEl.className   = 'file-picker__folder-name'
    this._folderNameEl.textContent = 'Choisir un dossier'

    titleBar.appendChild(lights)
    titleBar.appendChild(this._folderNameEl)

    // ── Rangée chemin + Choisir ───────────────────────────────────────────
    const pathRow = document.createElement('div')
    pathRow.className = 'file-picker__header'

    this._pathBtn = document.createElement('span')
    this._pathBtn.className = 'file-picker__path'

    this._selectBtn = document.createElement('span')
    this._selectBtn.className   = 'file-picker__select-btn disabled'
    this._selectBtn.textContent = 'Choisir'

    pathRow.appendChild(this._pathBtn)
    pathRow.appendChild(this._selectBtn)

    // ── Liste ────────────────────────────────────────────────────────────
    this._entriesEl = document.createElement('div')
    this._entriesEl.className = 'file-picker__entries'

    // ── Footer : faux-btn Annuler ────────────────────────────────────────
    const footer = document.createElement('div')
    footer.className = 'file-picker__footer'

    const annulerBtn = document.createElement('span')
    annulerBtn.className   = 'ftpanel-btn file-picker__annuler-btn'
    annulerBtn.textContent = 'Annuler'
    footer.appendChild(annulerBtn)

    // ── Assemblage ───────────────────────────────────────────────────────
    this._el.appendChild(titleBar)
    this._el.appendChild(pathRow)
    this._el.appendChild(this._entriesEl)
    this._el.appendChild(footer)
    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
    this._el.focus()

    // Tab cycle : path (0) → annulerBtn (1) → liste (-1)
    this._focusableItems = [
      { el: this._pathBtn, focusClass: 'file-picker__path--focused', action: () => this._openPathPopup() },
      { el: annulerBtn,    focusClass: 'ftpanel-btn--focused',        action: () => this._cancel() },
    ]
  }

  async _navigateTo(path) {
    const resp = await fetch(`/api/fs?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
    if (!resp.ok) return
    const data = await resp.json()
    this.currentPath   = data.path
    this.entries       = data.entries
    this.selectedIndex = 0
    this._el.dataset.currentPath = this.currentPath
    this._renderPathBtn()
    this._renderEntries()
    this._updateSelectBtn()
  }

  _renderPathBtn() {
    if (this._pathBtn) this._pathBtn.textContent = this.currentPath.split('/').at(-1) || '/'
  }

  _renderEntries() {
    if (this._creatingFolder) return
    this._entriesEl.innerHTML = ''
    this.entries.forEach((entry, i) => {
      const el = document.createElement('div')
      el.className    = 'file-picker__entry'
      if (i === this.selectedIndex) el.classList.add('selected')
      el.dataset.type = entry.type
      el.dataset.path = entry.path

      const icon = document.createElement('span')
      icon.className = 'file-picker__entry-icon'

      const name = document.createElement('span')
      name.className   = 'file-picker__entry-name'
      name.textContent = entry.name

      el.appendChild(icon)
      el.appendChild(name)
      this._entriesEl.appendChild(el)
    })
  }

  _buildAncestors(path) {
    const result = []
    let current = path
    while (current && current.length > 1) {
      const name = current.split('/').at(-1) || current
      result.push({ name, path: current })
      const idx = current.lastIndexOf('/')
      if (idx <= 0) break
      current = current.substring(0, idx)
    }
    return result
  }

  _openPathPopup() {
    const ancestors = this._buildAncestors(this.currentPath)
    const options   = ancestors.map(a => ({ value: a.path, label: a.name }))
    const restore   = () => {
      this._focusIdx = -1
      this._updateFocusableItems()
      this._el.focus()
    }
    new PopupSelect({
      options,
      showSearch: false,
      onSelect: (path) => {
        this._navigateTo(path).catch(console.error)
        restore()
      },
      onCancel: restore,
    }).open(this._pathBtn)
  }

  _selectEntryAt(i) {
    const els = this._entriesEl.querySelectorAll('.file-picker__entry')
    if (els[this.selectedIndex]) els[this.selectedIndex].classList.remove('selected')
    this.selectedIndex = Math.max(0, Math.min(i, this.entries.length - 1))
    if (els[this.selectedIndex]) {
      els[this.selectedIndex].classList.add('selected')
      els[this.selectedIndex].scrollIntoView({ block: 'nearest' })
    }
    this._updateSelectBtn()
  }

  _updateSelectBtn() {
    const entry = this.entries[this.selectedIndex]
    const selectable = entry?.type === 'directory' || (this.mode === 'file' && entry)
    this._selectBtn.classList.toggle('disabled', !selectable)
  }

  _cycleFocus() {
    this._focusIdx++
    if (this._focusIdx >= this._focusableItems.length) {
      this._focusIdx = this.entries.length > 0 ? -1 : 0
    }
    this._updateFocusableItems()
  }

  _updateFocusableItems() {
    this._focusableItems.forEach(({ el, focusClass }, i) =>
      el.classList.toggle(focusClass, i === this._focusIdx)
    )
    this._el.classList.toggle('file-picker--btns-focused', this._focusIdx >= 0)
  }

  _handleKey(event) {
    if (this._creatingFolder) return
    StopEvent(event)

    switch (event.key) {
      case 'Tab':
        this._cycleFocus()
        break

      case 'Enter':
        if (this._focusIdx >= 0) {
          this._focusableItems[this._focusIdx]?.action()
        } else {
          const entry = this.entries[this.selectedIndex]
          if (entry?.type === 'directory' || (this.mode === 'file' && entry)) {
            this._select(entry.path).catch(console.error)
          }
        }
        break

      case 'ArrowDown':
        if (this._focusIdx === 0) this._openPathPopup()
        else if (this._focusIdx < 0) this._selectEntryAt(this.selectedIndex + 1)
        break

      case 'ArrowUp':
        if (this._focusIdx < 0) this._selectEntryAt(this.selectedIndex - 1)
        break

      case 'ArrowRight':
        if (this._focusIdx < 0) {
          const entry = this.entries[this.selectedIndex]
          if (entry?.type === 'directory') this._navigateTo(entry.path).catch(console.error)
        }
        break

      case 'ArrowLeft':
        if (this._focusIdx < 0) this._goUp().catch(console.error)
        break

      case 'n':
      case 'N':
        this._startNewFolder()
        break
    }
  }

  async _goUp() {
    const idx = this.currentPath.lastIndexOf('/')
    if (idx <= 0) return
    const parent = this.currentPath.substring(0, idx) || '/'
    await this._navigateTo(parent)
  }

  _startNewFolder() {
    this._creatingFolder = true
    const input = document.createElement('input')
    input.type        = 'text'
    input.className   = 'file-picker__new-folder-input'
    input.placeholder = 'Nom du nouveau dossier'

    const onKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        const name = input.value.trim()
        if (!name) return
        const newPath = this.currentPath + '/' + name
        fetch('/api/fs/mkdir', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ path: newPath }),
        }).then(async (resp) => {
          if (!resp.ok) return
          input.removeEventListener('keydown', onKey)
          input.remove()
          this._creatingFolder = false
          await this._navigateTo(this.currentPath)
          const idx = this.entries.findIndex(e => e.name === name)
          if (idx >= 0) this._selectEntryAt(idx)
          this._el.focus()
        }).catch(console.error)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        input.removeEventListener('keydown', onKey)
        input.remove()
        this._creatingFolder = false
        this._el.focus()
      }
    }

    input.addEventListener('keydown', onKey)
    this._entriesEl.insertBefore(input, this._entriesEl.firstChild)
    input.focus()
  }

  async _select(folderPath) {
    await fetch('/api/settings/last_path', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ value: this.currentPath }),
    })
    this._close()
    this._onSelect?.(folderPath)
  }

  _cancel() {
    this._close()
    this._onCancel?.()
  }

  _close() {
    this._overlay.remove()
    this._restoreFocusTo?.focus()
  }

}
