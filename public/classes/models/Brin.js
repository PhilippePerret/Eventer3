import Item from './Item.js'
import { WORD_FORMS } from '../../constants.js'

export default class Brin extends Item {

  static get thingName() {
    return WORD_FORMS.Brin
  }

  static get idPrefix() {
    return 'b'
  }

  static get itemClasses() {
    return ['item', 'panel-row', 'brin-row']
  }

  // ── Couleurs ────────────────────────────────────────────────────

  static colorFor(index) {
    const colors = window.APP_CONFIG?.brinColors ?? [
      '#d9c8a9', '#c8d9a9', '#a9d9c8', '#a9c8d9',
      '#c8a9d9', '#d9a9c8', '#d9b0a9', '#d9d1a9'
    ]
    return colors[(index - 1) % colors.length]
  }

  static normalizeColor(hex) {
    if (!hex) return ''
    const v = String(hex).trim()
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase()
    if (/^#[0-9a-f]{3}$/i.test(v)) return '#' + v.slice(1).split('').map(c => c + c).join('').toLowerCase()
    return ''
  }

  static textColorFor(hex) {
    const color = Brin.normalizeColor(hex)
    if (!color) return ''
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.57 ? '#2f2d29' : '#fffaf3'
  }

  static applyBadgeColor(el, color) {
    const c = Brin.normalizeColor(color)
    if (!el || !c) return
    el.style.backgroundColor = c
    el.style.color = Brin.textColorFor(c)
  }

  // ── Badge ────────────────────────────────────────────────────────

  static generateBadge(title) {
    const flat = (title ?? '').replace(/\s+/g, '')
    if (!flat) return '---'
    return flat.substring(0, 3).toUpperCase().padEnd(3, '-')
  }

  // ── Constructor ──────────────────────────────────────────────────

  constructor(data = {}) {
    super(data)
    if (Array.isArray(this.type)) this.type = ''
    this.file = data.fi ?? data.file ?? ''
    this.perso_ids = data.brin_perso_ids ?? data.perso_ids ?? []
  }

  // ── DOM ──────────────────────────────────────────────────────────

  editableProperties() {
    return ['title', 'badge', 'type', 'color']
  }

  getEditorFields(type, itemElement) {
    return [
      { name: 'title',  property: 'title',  selector: '[data-property="title"]',              placeholder: Brin.newItemPlaceholder },
      { name: 'badge',  property: 'badge',  selector: '[data-property="badge"]',              placeholder: '---' },
      { name: 'type',   property: 'type',   selector: 'select[data-property="type"]',         type: 'native' },
      { name: 'color',  property: 'color',  selector: 'input[type="color"][data-property="color"]', type: 'native' },
    ]
  }

  render(div) {
    div.innerHTML = ''

    const check = document.createElement('div')
    check.className = 'panel-check'
    check.textContent = '✓'

    const colorInput = document.createElement('input')
    colorInput.type = 'color'
    colorInput.className = 'panel-color'
    colorInput.dataset.property = 'color'
    colorInput.value = Brin.normalizeColor(this.color) || '#d9c8a9'
    colorInput.title = 'Couleur du brin'
    colorInput.addEventListener('click', e => e.stopPropagation())

    const badge = document.createElement('div')
    badge.className = 'panel-badge brin-item__badge'
    badge.dataset.property = 'badge'
    badge.textContent = this.badge ?? ''
    Brin.applyBadgeColor(badge, this.color)

    const title = document.createElement('div')
    title.className = 'brin-item__title'
    title.dataset.property = 'title'
    title.textContent = this.title

    const typeSelect = document.createElement('select')
    typeSelect.className = 'panel-type field-select'
    typeSelect.dataset.property = 'type'
    const types = window.APP_CONFIG?.brinTypes ?? ['intrigue', 'personnage', 'autre']
    const emptyOpt = document.createElement('option')
    emptyOpt.value = ''
    emptyOpt.textContent = '—'
    typeSelect.appendChild(emptyOpt)
    types.forEach(v => {
      const opt = document.createElement('option')
      opt.value = v
      opt.textContent = v
      typeSelect.appendChild(opt)
    })
    typeSelect.value = this.type || ''
    typeSelect.addEventListener('click', e => e.stopPropagation())

    const persos = document.createElement('div')
    persos.className = 'panel-persos brin-persos-marks'

    const file = document.createElement('div')
    file.className = 'panel-file brin-item__file'
    file.dataset.property = 'file'
    file.textContent = this.file ?? ''

    div.append(check, colorInput, badge, title, typeSelect, persos, file)
  }

}
