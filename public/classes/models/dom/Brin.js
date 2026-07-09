import Brin from '../core/Brin.js'

export default {
  _afterStartEditing() { this.parentLister.markForCheck(this) },

  _afterBuild() {
    const badgeEl = this.el?.querySelector('.brin-badge')
    if (badgeEl) Brin.applyBadgeColor(badgeEl, this.color)
  },
}
