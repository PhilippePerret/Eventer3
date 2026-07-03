import Notification from '../../ui/Notification.js'
import { getErr } from '../../../system/Error.js'

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

  openActiveLink() {
    if (this.getActiveLinkId() == null) { Notification.show(getErr(5210)); return }

    const popup = document.createElement('div')
    popup.className = 'link-open-popup floating-panel'

    const options = [
      { key: 'g', label: "Dans l'évènemencier"  },
      { key: 'c', label: 'Afficher sa carte'      },
      { key: 'a', label: 'Dans une autre fenêtre' },
    ]

    options.forEach(({ key, label }) => {
      const item = document.createElement('div')
      item.className = 'floating-panel__item'
      const keyEl = document.createElement('span')
      keyEl.className = 'link-open-popup__key'
      keyEl.textContent = key
      item.appendChild(keyEl)
      item.appendChild(document.createTextNode(' ' + label))
      popup.appendChild(item)
    })

    document.body.appendChild(popup)

    const close = () => {
      popup.remove()
      document.removeEventListener('keydown', onKey, true)
      this.el?.focus()
    }

    const onKey = (ev) => {
      if (!['g', 'c', 'a', 'Escape'].includes(ev.key)) return
      ev.preventDefault()
      ev.stopPropagation()
      const key = ev.key
      close()
      if (key === 'g') this.goLink()
      else if (key === 'a') this.splitLink()
    }

    document.addEventListener('keydown', onKey, true)
  },

  goLink() {
    if (this.getActiveLinkId() == null) { Notification.show(getErr(5200)); return }
  },

  splitLink() {
    if (this.getActiveLinkId() == null) { Notification.show(getErr(5200)); return }
  },

}
