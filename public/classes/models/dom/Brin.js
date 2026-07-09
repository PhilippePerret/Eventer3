import Brin from '../core/Brin.js'

export default {
  _afterStartEditing() { this.parentLister.markForCheck(this) },

  _afterBuild() {
    const badgeEl = this.el?.querySelector('.brin-badge')
    if (badgeEl) Brin.applyBadgeColor(badgeEl, this.color)
  },

  // PROPS Brin : color, badge, title, type — title est le 3e champ éditable (index 2)
  focusTitleField() {
    this._editingFieldIdx = 2
    this._editingFields[2]?.focus()
  },
}
