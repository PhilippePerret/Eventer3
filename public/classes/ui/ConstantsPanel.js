import Texte from '../../system/Texte.js'

const ROWS_PER_COLUMN = 10

export default class ConstantsPanel {

  static async open(project, focusedItem) {
    const panel = new ConstantsPanel(project, focusedItem)
    await panel._init()
  }

  constructor(project, focusedItem) {
    this._project       = project
    this._focusedItem   = focusedItem ?? null
    this._selectedIndex = 0
    this._rows          = []
  }

  async _init() {
    const constants = await this._fetchConstants()
    this._render(constants)
  }

  async _fetchConstants() {
    const resp = await fetch(`/api/constants?project_id=${this._project.id}`, { cache: 'no-store' })
    return resp.ok ? resp.json() : []
  }

  _render(constants) {
    const el = document.getElementById('constants-panel')
    el.innerHTML = ''
    el.classList.remove('hidden')
    el.setAttribute('tabindex', '0')

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

    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'
    footer.innerHTML = '<span class="floating-panel__footer-action"><kbd>⇥</kbd> Éditer</span><span class="floating-panel__footer-action"><kbd>⌘↩</kbd> Fermer</span>'
    el.appendChild(footer)

    el.addEventListener('keydown', e => this._handleKey(e))
    el.focus()
    this._selectRow(0)
  }

  _buildRow(index, name, value) {
    const row = document.createElement('div')
    row.className     = 'constants-row'
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
      e.preventDefault(); e.stopPropagation()
      e.target.blur()
      const next = Math.max(0, Math.min(this._rows.length - 1, index + delta))
      this._selectRow(next)
      document.getElementById('constants-panel').focus()
    }

    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.metaKey)     { e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); valueInput.focus() }
      else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault(); e.stopPropagation()
        const prev = index - 1
        if (prev >= 0) { this._selectRow(prev); this._rows[prev].querySelector('.constants-row__value').focus() }
      }
      else if (e.key === 'Escape')     { e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'ArrowDown')  arrowNav(e, +1)
      else if (e.key === 'ArrowUp')    arrowNav(e, -1)
      else e.stopPropagation()
    })

    valueInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.metaKey) { e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault(); e.stopPropagation()
        const next = index + 1
        if (next < this._rows.length) { this._selectRow(next); this._rows[next].querySelector('.constants-row__name').focus() }
      }
      else if (e.key === 'Tab' && e.shiftKey) { e.preventDefault(); e.stopPropagation(); nameInput.focus() }
      else if (e.key === 'Escape')            { e.preventDefault(); e.stopPropagation(); void this._close() }
      else if (e.key === 'ArrowDown')         arrowNav(e, +1)
      else if (e.key === 'ArrowUp')           arrowNav(e, -1)
      else e.stopPropagation()
    })

    nameInput.addEventListener('focus',  () => this._selectRow(index))
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

  _handleKey(e) {
    const focused   = document.activeElement
    const isInInput = focused?.classList.contains('constants-row__name') ||
                      focused?.classList.contains('constants-row__value')
    if (isInInput) return

    switch (e.key) {
      case 'Enter':
        if (e.metaKey) { e.preventDefault(); e.stopPropagation(); void this._close() }
        break
      case 'Escape':
        e.preventDefault(); e.stopPropagation(); void this._close()
        break
      case 'ArrowDown':
        e.preventDefault(); e.stopPropagation()
        this._selectRow(Math.min(this._selectedIndex + 1, this._rows.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault(); e.stopPropagation()
        this._selectRow(Math.max(this._selectedIndex - 1, 0))
        break
      case 'Tab':
        e.preventDefault(); e.stopPropagation()
        this._rows[this._selectedIndex]?.querySelector('.constants-row__name')?.focus()
        break
      default:
        e.stopPropagation()
    }
  }

  async _close() {
    await this._saveConstants()
    await this._project._loadConstants()
    const el = document.getElementById('constants-panel')
    el.classList.add('hidden')
    el.innerHTML = ''
    this._focusedItem?.focus()
  }

  async _saveConstants() {
    const constants = []
    this._rows.forEach((row, i) => {
      const name  = row.querySelector('.constants-row__name').value.trim()
      const value = row.querySelector('.constants-row__value').value.trim()
      if (name && value) constants.push({ position: i, name, value })
    })
    await fetch(`/api/constants?project_id=${this._project.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(constants),
    })
  }

}
