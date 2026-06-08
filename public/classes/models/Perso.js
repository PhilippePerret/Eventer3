import Item from './Item.js'
import { PERSO_FONCTIONS, PERSO_AVATARS } from '../../constants.js'

export default class Perso extends Item {

  static get thingName() {
    return { thing: 'personnage', THING: 'PERSONNAGE', Thing: 'Personnage', things: 'personnages', THINGS: 'PERSONNAGES', Things: 'Personnages', the: 'le', THE: 'LE', The: 'Le', of: 'du ' }
  }

  static get idPrefix() { return 'c' }

  static get itemClasses() { return ['item', 'panel-row', 'perso-row'] }

  // ── Badge ────────────────────────────────────────────────────────

  static generateBadge(title) {
    const flat = (title ?? '').replace(/\s+/g, '').toUpperCase()
    if (!flat) return '--'
    return flat.substring(0, 2).padEnd(2, '-')
  }

  static generateUniqueBadge(title, existingBadges) {
    const base = Perso.generateBadge(title)
    if (!existingBadges.includes(base)) return base
    const flat = (title ?? '').replace(/\s+/g, '').toUpperCase()
    for (let i = 0; i < flat.length - 1; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        const v = flat[i] + flat[j]
        if (!existingBadges.includes(v)) return v
      }
    }
    let n = 1
    while (existingBadges.includes(`C${n}`)) n++
    return `C${n}`
  }

  // ── Display ──────────────────────────────────────────────────────

  get displayMark() {
    return this.avatar ?? this.badge ?? '--'
  }

  // ── Badge auto-calc ──────────────────────────────────────────────

  static badgeSource(title, patronyme) {
    return (patronyme ?? '').trim() || (title ?? '').trim()
  }

  commitEdition(itemElement, fields, inputs) {
    const badgeIdx  = fields.findIndex(f => f.property === 'badge')
    const titleIdx  = fields.findIndex(f => f.property === 'title')
    const patroIdx  = fields.findIndex(f => f.property === 'patronyme')
    if (badgeIdx >= 0 && !inputs[badgeIdx].value.trim()) {
      const source = Perso.badgeSource(
        inputs[titleIdx]?.value ?? '',
        patroIdx >= 0 ? (inputs[patroIdx]?.value ?? '') : ''
      )
      if (source) {
        const existingBadges = (this.parentLister?.items ?? [])
          .filter(p => p.id !== this.id)
          .map(p => p.badge)
          .filter(Boolean)
        inputs[badgeIdx].value = Perso.generateUniqueBadge(source, existingBadges)
      }
    }
    super.commitEdition(itemElement, fields, inputs)
  }

  // ── Editor ──────────────────────────────────────────────────────

  getEditorFields(type, itemElement) {
    const usedAvatars = this._usedAvatars ?? []
    const avatarOptions = [
      { value: null, label: '—' },
      ...PERSO_AVATARS.filter(a => !usedAvatars.includes(a)).map(a => ({ value: a, label: a })),
      ...(this.avatar && usedAvatars.includes(this.avatar) ? [{ value: this.avatar, label: this.avatar }] : [])
    ]
    const fonctionOptions = [
      { value: null, label: '—' },
      ...PERSO_FONCTIONS.map(v => ({ value: v, label: v }))
    ]
    return [
      { name: 'title',     property: 'title',    selector: '[data-property="title"]',    placeholder: Perso.newItemPlaceholder },
      { name: 'patronyme', property: 'patronyme', selector: '[data-property="patronyme"]', placeholder: 'Patronyme' },
      { name: 'badge',     property: 'badge',     selector: '[data-property="badge"]',    placeholder: '--' },
      { name: 'avatar',    property: 'avatar',    selector: '[data-property="avatar"]',   type: 'popup-select', options: avatarOptions, allowCustom: true },
      { name: 'fonction',  property: 'fonction',  selector: '[data-property="fonction"]', type: 'popup-select', options: fonctionOptions, allowCustom: true },
    ]
  }

  // ── DOM ──────────────────────────────────────────────────────────

  render(div) {
    div.innerHTML = ''

    const check = document.createElement('div')
    check.className = 'panel-check'
    check.textContent = '✓'

    const mark = document.createElement('div')
    mark.className = 'panel-badge perso-item__badge'
    mark.dataset.property = 'badge'
    mark.textContent = this.displayMark

    const title = document.createElement('div')
    title.className = 'perso-item__title'
    title.dataset.property = 'title'
    title.textContent = this.title

    const patronyme = document.createElement('div')
    patronyme.className = 'perso-item__patronyme'
    patronyme.dataset.property = 'patronyme'
    patronyme.textContent = this.patronyme ?? ''

    const avatar = document.createElement('div')
    avatar.className = 'perso-item__avatar'
    avatar.dataset.property = 'avatar'
    avatar.textContent = this.avatar ?? '—'

    const fonction = document.createElement('div')
    fonction.className = 'perso-item__fonction'
    fonction.dataset.property = 'fonction'
    fonction.textContent = this.fonction ?? '—'

    div.append(check, mark, title, patronyme, avatar, fonction)
  }

}