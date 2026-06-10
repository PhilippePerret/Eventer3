export default class FilePicker {

  static open({ mode = 'folder', keyboardController }) {
    return new Promise((resolve) => {
      const picker = new FilePicker({
        mode,
        keyboardController,
        onSelect: (path) => resolve(path),
        onCancel: () => resolve(null),
      })
      picker._init().catch(console.error)
    })
  }

  constructor({ mode, keyboardController, onSelect, onCancel }) {
    this.mode = mode
    this.keyboardController = keyboardController
    this._onSelect = onSelect
    this._onCancel = onCancel
    this.currentPath = ''
    this.entries = []
    this.selectedIndex = 0
    this.recentPaths = []
    this.showingRecents = false
    this.showingPathMenu = false
    this._selectedRecentIndex = 0
    this._selectedPathMenuIndex = 0
    this._creatingFolder = false
  }

  async _init() {
    const [pathResp, recentsResp] = await Promise.all([
      fetch('/api/settings/last_path',    { cache: 'no-store' }),
      fetch('/api/settings/recent_paths', { cache: 'no-store' }),
    ])
    const pathData    = await pathResp.json()
    const recentsData = await recentsResp.json()
    this.recentPaths  = recentsData.value ? JSON.parse(recentsData.value) : []

    this._buildDOM()

    let startPath = pathData.value
    if (!startPath) {
      const fsResp = await fetch('/api/fs', { cache: 'no-store' })
      const fsData = await fsResp.json()
      startPath    = fsData.path
    }
    await this._navigateTo(startPath)

    this.keyboardController.pushMode({
      type: 'file-picker',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  _buildDOM() {
    this._overlay = document.createElement('div')
    this._overlay.className = 'file-picker-overlay'

    this._el = document.createElement('div')
    this._el.className = 'file-picker'

    // Barre de titre macOS
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
    this._folderNameEl.className = 'file-picker__folder-name'

    titleBar.appendChild(lights)
    titleBar.appendChild(this._folderNameEl)

    // Header : bouton récents
    const header = document.createElement('div')
    header.className = 'file-picker__header'

    this._recentsBtn = document.createElement('button')
    this._recentsBtn.className   = 'file-picker__recents-btn'
    this._recentsBtn.type        = 'button'
    this._recentsBtn.textContent = 'Récents ▾'
    this._recentsBtn.addEventListener('click', () => this._toggleRecents())

    header.appendChild(this._recentsBtn)

    // Panel récents (caché par défaut)
    this._recentsPanel = document.createElement('div')
    this._recentsPanel.className = 'file-picker__recents'
    this._recentsPanel.hidden    = true

    // Menu arborescence (caché par défaut)
    this._pathMenuEl = document.createElement('div')
    this._pathMenuEl.className = 'file-picker__path-menu'
    this._pathMenuEl.hidden    = true

    // Liste des entrées
    this._entriesEl = document.createElement('div')
    this._entriesEl.className = 'file-picker__entries'

    // Footer
    const footer = document.createElement('div')
    footer.className = 'file-picker__footer'

    this._cancelKeyEl = document.createElement('kbd')
    this._cancelKeyEl.className   = 'file-picker__cancel-key'
    this._cancelKeyEl.textContent = '␛'

    this._navHints = document.createElement('span')
    this._navHints.className = 'file-picker__nav-hints'

    this._selectBtn = document.createElement('button')
    this._selectBtn.type        = 'button'
    this._selectBtn.className   = 'file-picker__select-btn'
    this._selectBtn.textContent = '↩︎'
    this._selectBtn.addEventListener('click', () => {
      const entry = this.entries[this.selectedIndex]
      if (entry?.type === 'directory' || (this.mode === 'file' && entry)) {
        this._select(entry.path).catch(console.error)
      }
    })

    footer.appendChild(this._cancelKeyEl)
    footer.appendChild(this._navHints)
    footer.appendChild(this._selectBtn)

    this._el.appendChild(titleBar)
    this._el.appendChild(header)
    this._el.appendChild(this._recentsPanel)
    this._el.appendChild(this._pathMenuEl)
    this._el.appendChild(this._entriesEl)
    this._el.appendChild(footer)
    this._overlay.appendChild(this._el)
    document.body.appendChild(this._overlay)
  }

  async _navigateTo(path) {
    const resp = await fetch(`/api/fs?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
    if (!resp.ok) return
    const data = await resp.json()
    this.currentPath   = data.path
    this.entries       = data.entries
    this.selectedIndex = 0
    this._el.dataset.currentPath = this.currentPath
    this._renderFolderName()
    this._renderEntries()
    this._updateSelectBtn()
  }

  _renderFolderName() {
    const name = this.currentPath.split('/').at(-1) || '/'
    this._folderNameEl.textContent = name
  }

  _renderEntries() {
    this._entriesEl.innerHTML = ''
    this.entries.forEach((entry, i) => {
      const el = document.createElement('div')
      el.className   = 'file-picker__entry'
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

  _renderRecents() {
    this._recentsPanel.innerHTML = ''
    if (this.recentPaths.length === 0) {
      const empty = document.createElement('div')
      empty.className   = 'file-picker__recents-empty'
      empty.textContent = 'Aucun chemin récent'
      this._recentsPanel.appendChild(empty)
      return
    }
    this._selectedRecentIndex = 0
    this.recentPaths.forEach((p, i) => {
      const item = document.createElement('div')
      item.className   = 'file-picker__recents-item'
      if (i === 0) item.classList.add('selected')
      item.textContent  = p
      item.dataset.path = p
      this._recentsPanel.appendChild(item)
    })
  }

  _renderPathMenu() {
    this._pathMenuEl.innerHTML = ''
    const ancestors = this._buildAncestors(this.currentPath)
    this._selectedPathMenuIndex = 0
    ancestors.forEach((anc, i) => {
      const item = document.createElement('div')
      item.className   = 'file-picker__path-menu-item'
      if (i === 0) item.classList.add('selected')
      item.textContent  = anc.name
      item.dataset.path = anc.path
      this._pathMenuEl.appendChild(item)
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
    const isDir = entry?.type === 'directory'
    const selectable = isDir || (this.mode === 'file' && entry)
    this._selectBtn.classList.toggle('disabled', !selectable)

    const hints = []
    if (isDir) hints.push('<kbd>→</kbd> entrer')
    hints.push('<kbd>←</kbd> remonter')
    hints.push('<kbd>n</kbd> nouveau dossier')
    hints.push('<kbd>Tab</kbd> arborescence')
    this._navHints.innerHTML = hints.join(' &nbsp;·&nbsp; ')
  }

  _selectRecentAt(i) {
    const items = this._recentsPanel.querySelectorAll('.file-picker__recents-item')
    if (items[this._selectedRecentIndex]) items[this._selectedRecentIndex].classList.remove('selected')
    this._selectedRecentIndex = Math.max(0, Math.min(i, items.length - 1))
    if (items[this._selectedRecentIndex]) items[this._selectedRecentIndex].classList.add('selected')
  }

  _selectPathMenuAt(i) {
    const items = this._pathMenuEl.querySelectorAll('.file-picker__path-menu-item')
    if (items[this._selectedPathMenuIndex]) items[this._selectedPathMenuIndex].classList.remove('selected')
    this._selectedPathMenuIndex = Math.max(0, Math.min(i, items.length - 1))
    if (items[this._selectedPathMenuIndex]) items[this._selectedPathMenuIndex].classList.add('selected')
  }

  _handleKey(event) {
    if (this._creatingFolder) return

    event.preventDefault()

    if (this.showingPathMenu) {
      switch (event.key) {
        case 'ArrowDown': this._selectPathMenuAt(this._selectedPathMenuIndex + 1); break
        case 'ArrowUp':   this._selectPathMenuAt(this._selectedPathMenuIndex - 1); break
        case 'Enter': {
          const items = this._pathMenuEl.querySelectorAll('.file-picker__path-menu-item')
          const sel   = items[this._selectedPathMenuIndex]
          if (sel) this._navigateTo(sel.dataset.path).then(() => this._togglePathMenu()).catch(console.error)
          else this._togglePathMenu()
          break
        }
        case 'Tab':
        case 'Escape':
          this._togglePathMenu()
          break
      }
      return
    }

    if (this.showingRecents) {
      switch (event.key) {
        case 'ArrowDown': this._selectRecentAt(this._selectedRecentIndex + 1); break
        case 'ArrowUp':   this._selectRecentAt(this._selectedRecentIndex - 1); break
        case 'Enter': {
          const items = this._recentsPanel.querySelectorAll('.file-picker__recents-item')
          const sel   = items[this._selectedRecentIndex]
          if (sel) this._navigateTo(sel.dataset.path).then(() => this._toggleRecents()).catch(console.error)
          else this._toggleRecents()
          break
        }
        case 'Escape': this._toggleRecents(); break
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        this._selectEntryAt(this.selectedIndex + 1)
        break
      case 'ArrowUp':
        this._selectEntryAt(this.selectedIndex - 1)
        break
      case 'ArrowRight': {
        const entry = this.entries[this.selectedIndex]
        if (entry?.type === 'directory') this._navigateTo(entry.path).catch(console.error)
        break
      }
      case 'ArrowLeft':
        this._goUp().catch(console.error)
        break
      case 'n':
        this._startNewFolder()
        break
      case 'Tab':
        this._togglePathMenu()
        break
      case 'Enter': {
        const entry = this.entries[this.selectedIndex]
        if (entry?.type === 'directory' || (this.mode === 'file' && entry)) {
          this._select(entry.path).catch(console.error)
        }
        break
      }
      case 'Escape':
        this._cancel()
        break
    }
  }

  async _goUp() {
    const idx = this.currentPath.lastIndexOf('/')
    if (idx <= 0) return
    const parent = this.currentPath.substring(0, idx) || '/'
    await this._navigateTo(parent)
  }

  _toggleRecents() {
    if (this.showingPathMenu) this._togglePathMenu()
    this.showingRecents = !this.showingRecents
    this._recentsPanel.hidden = !this.showingRecents
    if (this.showingRecents) this._renderRecents()
  }

  _togglePathMenu() {
    if (this.showingRecents) this._toggleRecents()
    this.showingPathMenu = !this.showingPathMenu
    this._pathMenuEl.hidden = !this.showingPathMenu
    if (this.showingPathMenu) this._renderPathMenu()
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
        }).catch(console.error)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        input.removeEventListener('keydown', onKey)
        input.remove()
        this._creatingFolder = false
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
    const recents = [folderPath, ...this.recentPaths.filter(p => p !== folderPath)].slice(0, 10)
    await fetch('/api/settings/recent_paths', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ value: JSON.stringify(recents) }),
    })
    this._close()
    this._onSelect?.(folderPath)
  }

  _cancel() {
    this._close()
    this._onCancel?.()
  }

  _close() {
    this.keyboardController.popMode()
    this._overlay.remove()
  }

}
