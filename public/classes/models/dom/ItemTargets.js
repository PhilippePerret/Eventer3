import Notification from '../../ui/Notification.js'
import { getErr } from '../../../system/Error.js'
import LinkOpenPopup from '../../ui/LinkOpenPopup.js'
import Windows from '../../ui/Windows.js'

export default {

  _getLinkEls() {
    if (!this.el) return []
    return [...this.el.querySelectorAll('.item-link')]
  },

  clearActiveLink() {
    this.el?.querySelectorAll('.item-link--active').forEach(el => el.classList.remove('item-link--active'))
    this._activeLinkIdx = -1
  },

  cycleLink() {
    const links = this._getLinkEls()
    if (!links.length) { Notification.show(getErr(5210)); return }
    const current = this._activeLinkIdx ?? -1
    const idx = current < 0 ? 0 : (current + 1) % links.length
    links.forEach(el => el.classList.remove('item-link--active'))
    links[idx].classList.add('item-link--active')
    this._activeLinkIdx = idx
  },

  cycleLinkBack() {
    const links = this._getLinkEls()
    if (!links.length) { Notification.show(getErr(5210)); return }
    const current = this._activeLinkIdx ?? -1
    const idx = current < 0 ? links.length - 1 : (current - 1 + links.length) % links.length
    links.forEach(el => el.classList.remove('item-link--active'))
    links[idx].classList.add('item-link--active')
    this._activeLinkIdx = idx
  },

  getActiveLinkId() {
    const links = this._getLinkEls()
    const idx = this._activeLinkIdx ?? -1
    if (idx < 0 || idx >= links.length) return null
    return links[idx]?.dataset.id ?? null
  },

  async _targetExists(targetId) {
    const resp = await fetch(`/api/items/${targetId}/ancestors?project_id=${this.project.id}`, { cache: 'no-store' })
    return resp.ok
  },

  async openActiveLink() {
    const linkId = this.getActiveLinkId()
    if (linkId == null) { Notification.show(getErr(5210)); return }
    if (!await this._targetExists(linkId)) { Notification.show(getErr(5220)); return }
    const links = this._getLinkEls()
    const targetTitle = links[this._activeLinkIdx]?.textContent ?? ''
    const hasSplit = Windows.isSplitActive()
    LinkOpenPopup.open({ targetId: linkId, targetTitle, item: this, hasSplit })
  },

  async goLink() {
    const targetId = this.getActiveLinkId()
    if (targetId == null) { Notification.show(getErr(5200)); return }
    const ok = await this.parentLister.navigateToItem(targetId)
    if (ok === false) Notification.show(getErr(5220))
  },

  async splitLink() {
    const targetId = this.getActiveLinkId()
    if (targetId == null) { Notification.show(getErr(5200)); return }
    if (!await this._targetExists(targetId)) { Notification.show(getErr(5220)); return }
    Windows.openInOtherPane(targetId, this.project.id)
  },

}
