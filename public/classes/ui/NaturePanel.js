import PopupSelect from './PopupSelect.js'
import ConfirmDialog from './ConfirmDialog.js'
import ListerRepository from '../repositories/ListerRepository.js'

export default class NaturePanel {

  constructor({ lister, keyboardController }) {
    this._lister        = lister
    this._kc            = keyboardController
    this._projectNature = lister.project_nature
    const n = lister.nature
    this._listerNature  = (n == null || n === 'none') ? null : (n === 'no-man' ? 'eventer' : n)
    this._selectedRow   = 0
    this._el            = null
    this._rows          = []
  }

  open() {
    this._render()
    this._kc.pushMode({
      type: 'nature-panel',
      onKeyDown: (event) => this._handleKey(event),
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  _render() {
    const el = document.createElement('div')
    el.className = 'nature-panel floating-panel'

    this._renderHeader(el)
    this._renderFields(el)
    this._renderFooter(el)

    this._el = el
    document.body.appendChild(el)
    this._updateSelection()
  }

  _renderHeader(el) {
    const title = document.createElement('div')
    title.className = 'floating-panel__title'
    title.textContent = `Type de l'évènemencier de niveau ${this._lister.depth}`
    el.appendChild(title)
  }

  _renderFields(el) {
    const fields = document.createElement('div')
    fields.className = 'nature-panel__fields'
    this._rows = [
      this._createRow('Nature projet',       this._projectNatureLabel()),
      this._createRow('Nature évènemencier', this._listerNatureLabel()),
    ]
    this._rows.forEach(row => fields.appendChild(row))
    el.appendChild(fields)
  }

  _renderFooter(el) {
    const footer = document.createElement('div')
    footer.className = 'floating-panel__footer'

    const cancelBtn = document.createElement('span')
    cancelBtn.className = 'panel-footer-key'
    cancelBtn.textContent = '␛ Annuler'

    const applyBtn = document.createElement('span')
    applyBtn.className = 'panel-footer-key'
    applyBtn.textContent = '⌘ ↩︎ Appliquer'

    footer.appendChild(cancelBtn)
    footer.appendChild(applyBtn)
    el.appendChild(footer)
  }

  _createRow(label, value) {
    const row = document.createElement('div')
    row.className = 'nature-panel__row'

    const labelEl = document.createElement('span')
    labelEl.className = 'nature-panel__label'
    labelEl.textContent = label

    const valueEl = document.createElement('span')
    valueEl.className = 'nature-panel__value'
    valueEl.textContent = value

    row.appendChild(labelEl)
    row.appendChild(valueEl)
    return row
  }

  // ── Labels ─────────────────────────────────────────────────────────────────

  _projectNatureLabel() {
    if (this._projectNature === 'roman') return 'roman'
    if (this._projectNature === 'film')  return 'film/BD'
    return '—'
  }

  _listerNatureLabel() {
    if (this._listerNature === 'eventer') return 'évènemencier'
    const isAtManDepth = this._lister.man_depth != null && this._lister.depth === this._lister.man_depth
    const effectivelyMan = this._listerNature === 'man' || (this._listerNature == null && isAtManDepth)
    if (effectivelyMan) return this._projectNature === 'film' ? 'scénario' : 'manuscrit'
    return 'évènemencier'
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  _updateSelection() {
    this._rows.forEach((row, i) => row.classList.toggle('selected', i === this._selectedRow))
  }

  _updateValueDisplay() {
    this._rows[0].querySelector('.nature-panel__value').textContent = this._projectNatureLabel()
    this._rows[1].querySelector('.nature-panel__value').textContent = this._listerNatureLabel()
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────

  _handleKey(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this._selectedRow = Math.min(1, this._selectedRow + 1)
        this._updateSelection()
        break
      case 'ArrowUp':
        event.preventDefault()
        this._selectedRow = Math.max(0, this._selectedRow - 1)
        this._updateSelection()
        break
      case 'Enter':
        event.preventDefault()
        if (event.metaKey) void this._apply()
        else this._openPopupForRow(this._selectedRow)
        break
      case 'Escape':
        event.preventDefault()
        this._close()
        break
    }
  }

  // ── Popups ─────────────────────────────────────────────────────────────────

  _openPopupForRow(rowIndex) {
    rowIndex === 0 ? this._openProjectNaturePopup() : this._openListerNaturePopup()
  }

  _openProjectNaturePopup() {
    new PopupSelect({
      options: [
        { value: 'roman', label: 'roman' },
        { value: 'film',  label: 'film/BD' },
        { value: null,    label: '— (aucun)' },
      ],
      currentValue: this._projectNature,
      showSearch: false,
      keyboardController: this._kc,
      onSelect: (value) => {
        this._projectNature = value
        if (this._listerNature === 'man' && !value) this._listerNature = null
        this._updateValueDisplay()
      },
      onCancel: () => {}
    }).open(this._rows[0])
  }

  _openListerNaturePopup() {
    const isAtManDepth = this._lister.man_depth != null && this._lister.depth === this._lister.man_depth
    const options = []
    if (this._projectNature === 'roman')     options.push({ value: 'man',     label: 'manuscrit' })
    else if (this._projectNature === 'film') options.push({ value: 'man',     label: 'scénario' })
    if (isAtManDepth && this._projectNature) options.push({ value: 'eventer', label: 'évènemencier' })
    options.push({ value: null, label: 'défaut' })

    new PopupSelect({
      options,
      currentValue: this._listerNature,
      showSearch: false,
      keyboardController: this._kc,
      onSelect: (value) => { this._listerNature = value; this._updateValueDisplay() },
      onCancel: () => {}
    }).open(this._rows[1])
  }

  // ── Apply ──────────────────────────────────────────────────────────────────

  async _apply() {
    const projectId = this._lister.project_id ?? this._lister.project_item_id
    this._lister.project_nature = this._projectNature
    this._lister.nature         = this._listerNature
    void ListerRepository.saveProjectMeta(projectId, { nature: this._projectNature })
    void ListerRepository.saveListerNature(this._lister, this._listerNature)
    this._lister._updateMainPanelClass()
    this._lister._propagateProjectMetaToAncestors()

    const alreadyDefault = this._lister.man_depth != null && this._lister.depth === this._lister.man_depth
    const needsConfirm   = this._listerNature === 'man' && !alreadyDefault

    this._close()

    if (needsConfirm) {
      const label = this._projectNature === 'film' ? 'scénarios' : 'manuscrits'
      const confirmed = await ConfirmDialog.open({
        message: `Est-ce le niveau par défaut des évènemenciers ${label} ?`,
        keyboardController: this._kc,
        buttons: [
          { label: 'Non', key: 'Escape', value: false },
          { label: 'Oui', key: 'Enter',  value: true  },
        ],
      })
      if (confirmed) {
        this._lister.man_depth = this._lister.depth
        void ListerRepository.saveProjectMeta(projectId, { man_depth: this._lister.depth })
        this._lister._propagateProjectMetaToAncestors()
      }
    }
  }

  // ── Close ──────────────────────────────────────────────────────────────────

  _close() {
    this._kc.popMode()
    this._el?.remove()
    this._el = null
  }

}
