import KeyboardablePanel from './KeyboardablePanel.js'
import PopupSelect from './PopupSelect.js'
import ConfirmDialog from './ConfirmDialog.js'
import { PROJECT_TYPES } from '../models/constants/Project.js'

const PROJECT_NATURE_OPTIONS = [...PROJECT_TYPES, { value: null, label: '—' }]

export default class NaturePanel extends KeyboardablePanel {

  constructor({ target }) {
    const raw   = target.parentItem?.title ?? 'l\'évènemencier'
    const label = raw.length > 24 ? raw.slice(0, 24) + '…' : raw
    super({ title: `Type de « ${label} » (niv. ${target.depth})`, panelClass: 'nature-panel' })
    this._lister        = target
    this._projectNature = target.project_nature ?? null
    const n             = target.nature
    this._listerNature  = (n == null || n === 'none') ? null : (n === 'no-man' ? 'eventer' : n)
    this._rows          = []
  }

  // ── open ──────────────────────────────────────────────────────────────────────

  open() {
    super.open()
  }

  // ── KeyboardablePanel overrides ───────────────────────────────────────────────

  _getItemCount() { return 2 }

  _renderContent(body) {
    this._rows = [
      this._createRow('Nature projet',       this._projectNatureLabel()),
      this._createRow('Nature évènemencier', this._listerNatureLabel()),
    ]
    this._rows.forEach(row => body.appendChild(row))
  }

  _getFooterButtons() {
    return [
      { label: 'Annuler',   type: 'cancel',  action: () => this.close()       },
      { label: 'Appliquer', type: 'primary',  action: () => void this._apply() },
    ]
  }

  _onEnterItem(index) {
    if (index === 0) this._openProjectNaturePopup(this._rows[0])
    else             this._openListerNaturePopup()
  }

  // ── Rows ──────────────────────────────────────────────────────────────────────

  _createRow(label, value) {
    const row     = document.createElement('div')
    row.className = 'ftpanel__item nature-panel__row'
    const labelEl = document.createElement('span')
    labelEl.className   = 'nature-panel__label'
    labelEl.textContent = label
    const valueEl = document.createElement('span')
    valueEl.className   = 'nature-panel__value'
    valueEl.textContent = value
    row.appendChild(labelEl)
    row.appendChild(valueEl)
    return row
  }

  _updateValueDisplay() {
    if (this._rows[0]) this._rows[0].querySelector('.nature-panel__value').textContent = this._projectNatureLabel()
    if (this._rows[1]) this._rows[1].querySelector('.nature-panel__value').textContent = this._listerNatureLabel()
  }

  // ── Labels ────────────────────────────────────────────────────────────────────

  _projectNatureLabel() {
    return PROJECT_NATURE_OPTIONS.find(o => o.value === this._projectNature)?.label ?? '—'
  }

  _listerNatureLabel() {
    if (this._listerNature === 'eventer') return 'évènemencier'
    const isAtManDepth   = this._lister?.man_depth != null && this._lister.depth === this._lister.man_depth
    const effectivelyMan = this._listerNature === 'man' || (this._listerNature == null && isAtManDepth)
    if (effectivelyMan) {
      const entry = PROJECT_TYPES.find(t => t.value === this._projectNature)
      return entry?.man ?? 'manuscrit'
    }
    return 'évènemencier'
  }

  // ── Popups ────────────────────────────────────────────────────────────────────

  _openProjectNaturePopup(anchor) {
    new PopupSelect({
      options:      PROJECT_NATURE_OPTIONS,
      currentValue: this._projectNature,
      showSearch:   false,
      onSelect: (value) => {
        this._projectNature = value
        if (!this._isProject) this._updateValueDisplay()
      },
      onCancel: () => {},
    }).open(anchor)
  }

  _openListerNaturePopup() {
    const isAtManDepth = this._lister?.man_depth != null && this._lister.depth === this._lister.man_depth
    const entry        = PROJECT_TYPES.find(t => t.value === this._projectNature)
    const options      = []
    if (entry?.man)                      options.push({ value: 'man',     label: entry.man        })
    if (isAtManDepth && this._projectNature) options.push({ value: 'eventer', label: 'évènemencier' })
    options.push({ value: null, label: 'défaut' })

    new PopupSelect({
      options,
      currentValue: this._listerNature,
      showSearch:   false,
      onSelect: (value) => { this._listerNature = value; this._updateValueDisplay() },
      onCancel: () => {},
    }).open(this._rows[1])
  }

  // ── Apply ─────────────────────────────────────────────────────────────────────

  _apply() {
    const lister = this._lister
    lister.nature         = this._listerNature
    lister.project_nature = this._projectNature
    lister.project.nature = this._projectNature

    const alreadyDefault = lister.man_depth != null && lister.depth === lister.man_depth
    const needsConfirm   = this._listerNature === 'man' && !alreadyDefault

    lister._updateMainPanelClass?.()
    lister._propagateProjectMetaToAncestors?.()
    this.close()
    lister.activate()

    void Promise.all([lister.save(), lister.saveNature(), lister.saveProjectMeta({ nature: this._projectNature }), lister.project.save()])

    if (needsConfirm) {
      const man = PROJECT_TYPES.find(t => t.value === this._projectNature)?.man ?? 'manuscrit'
      new ConfirmDialog({
        message: `Est-ce le niveau par défaut des évènemenciers ${man}s ?`,
        buttons: [
          { label: 'Oui', type: 'primary', action: () => {
            lister.man_depth         = lister.depth
            lister.project.man_depth = lister.man_depth
            void Promise.all([lister.save(), lister.saveProjectMeta({ man_depth: lister.man_depth })])
            lister._propagateProjectMetaToAncestors?.()
            lister.focusSelected()
          }},
          { label: 'Non', type: 'cancel', action: () => { lister.focusSelected() } },
        ],
      }).open()
    } else {
      lister.focusSelected()
    }
  }

}
