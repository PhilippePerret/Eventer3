const ROWS_PER_COLUMN = 10

export default class ConstantsPanel {

  static async open(projectId, keyboardController) {
    if (!projectId) return
    const panel = new ConstantsPanel({ projectId, keyboardController })
    await panel._init()
  }

  constructor({ projectId, keyboardController }) {
    this._projectId        = projectId
    this._keyboardController = keyboardController
    this._selectedIndex    = 0
    this._rows             = []
  }

  async _init() {
    const constants = await this._loadConstants()
    this._render(constants)
    this._keyboardController.pushMode({
      type: 'constants-panel',
      onKeyDown: (e) => this._handleKey(e),
    })
  }

  async _loadConstants() {
    const resp = await fetch(`/api/constants?project_id=${this._projectId}`, { cache: 'no-store' })
    if (!resp.ok) return []
    return resp.json()
  }

  _render(constants) {
    const el = document.getElementById('constants-panel')
    el.innerHTML = ''
    el.classList.remove('hidden')

    const title = document.createElement('div')
    title.className   = 'floating-panel__title'
    title.textContent = 'Constantes du projet'
    el.appendChild(title)

    const body = document.createElement('div')
    body.className = 'constants-panel__body'

    const col1 = document.createElement('div')
    col1.className = 'constants-panel__column'
    const hdr1 = document.createElement('div')
    hdr1.className = 'constants-panel__col-header'
    hdr1.innerHTML = '<span>Constante</span><span>Remplacer par…</span>'
    col1.appendChild(hdr1)

    const col2 = document.createElement('div')
    col2.className = 'constants-panel__column'
    const hdr2 = document.createElement('div')
    hdr2.className = 'constants-panel__col-header'
    hdr2.innerHTML = '<span>Constante</span><span>Valeur</span>'
    col2.appendChild(hdr2)

    this._rows = []
    const total = ROWS_PER_COLUMN * 2

    for (let i = 0; i < total; i++) {
      const c   = constants.find(k => k.position === i) || { name: '', value: '' }
      const row = this._buildRow(i, c.name, c.value)
      this._rows.push(row)
      if (i < ROWS_PER_COLUMN) col1.appendChild(row)
      else                      col2.appendChild(row)
    }

    body.append(col1, col2)
    el.appendChild(body)

    const sep = document.createElement('div')
    sep.className = 'floating-panel__separator'
    el.appendChild(sep)

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'
    footer.innerHTML = '<span class="floating-panel__footer-action"><kbd>⇥</kbd> Éditer</span><span class="floating-panel__footer-action"><kbd>⌘↩</kbd> Fermer</span>'
    el.appendChild(footer)

    this._selectRow(0)
  }

  _buildRow(index, name, value) {
    const row = document.createElement('div')
    row.className    = 'constants-row'
    row.dataset.index = index

    const nameInput = document.createElement('input')
    nameInput.type      = 'text'
    nameInput.className = 'constants-row__name'
    nameInput.value     = name

    const valueInput = document.createElement('input')
    valueInput.type      = 'text'
    valueInput.className = 'constants-row__value'
    valueInput.value     = value

    const arrowNav = (e, delta) => {
      e.preventDefault()
      e.stopPropagation()
      e.target.blur()
      const next = Math.max(0, Math.min(this._rows.length - 1, index + delta))
      this._selectRow(next)
    }

    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); valueInput.focus() }
      else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault(); e.stopPropagation()
        const prevIdx = index - 1
        if (prevIdx >= 0) {
          this._selectRow(prevIdx)
          this._rows[prevIdx].querySelector('.constants-row__value').focus()
        }
      }
      else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'ArrowDown') arrowNav(e, +1)
      else if (e.key === 'ArrowUp')   arrowNav(e, -1)
    })

    valueInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault(); e.stopPropagation()
        const nextIdx = index + 1
        if (nextIdx < this._rows.length) {
          this._selectRow(nextIdx)
          this._rows[nextIdx].querySelector('.constants-row__name').focus()
        }
      } else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault(); e.stopPropagation()
        nameInput.focus()
      } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'ArrowDown') arrowNav(e, +1)
      else if (e.key === 'ArrowUp')   arrowNav(e, -1)
    })

    nameInput.addEventListener('focus', () => this._selectRow(index))
    valueInput.addEventListener('focus', () => this._selectRow(index))

    row.append(nameInput, valueInput)
    return row
  }

  _selectRow(index) {
    this._rows.forEach(r => r.classList.remove('selected'))
    if (this._rows[index]) {
      this._rows[index].classList.add('selected')
      this._selectedIndex = index
    }
  }

  _handleKey(event) {
    const focused   = document.activeElement
    const isInInput = focused?.classList.contains('constants-row__name') ||
                      focused?.classList.contains('constants-row__value')

    switch (event.key) {
      case 'Enter':
        if (event.metaKey) { event.preventDefault(); void this._close() }
        break
      case 'Escape':
        if (!isInInput) {
          event.preventDefault()
          void this._close()
        }
        break
      case 'ArrowDown':
        if (!isInInput) {
          event.preventDefault()
          this._selectRow(Math.min(this._selectedIndex + 1, this._rows.length - 1))
        }
        break
      case 'ArrowUp':
        if (!isInInput) {
          event.preventDefault()
          this._selectRow(Math.max(this._selectedIndex - 1, 0))
        }
        break
      case 'Tab':
        if (!isInInput) {
          event.preventDefault()
          event.stopPropagation()
          this._rows[this._selectedIndex]?.querySelector('.constants-row__name')?.focus()
        }
        break
    }
  }

  async _close() {
    await this._saveConstants()
    const el = document.getElementById('constants-panel')
    el.classList.add('hidden')
    el.innerHTML = ''
    this._keyboardController.popMode()
  }

  async _saveConstants() {
    const constants = []
    this._rows.forEach((row, i) => {
      const name  = row.querySelector('.constants-row__name').value.trim()
      const value = row.querySelector('.constants-row__value').value.trim()
      if (name && value) constants.push({ position: i, name, value })
    })
    await fetch(`/api/constants?project_id=${this._projectId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(constants),
    })
  }

}
