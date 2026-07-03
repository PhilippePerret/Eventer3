import KeyboardablePanel from './KeyboardablePanel.js'

export default class LinkOpenPopup extends KeyboardablePanel {

  static open({ targetId, targetTitle, item }) {
    const popup = new LinkOpenPopup({ targetId, targetTitle, item })
    popup.open()
    return popup
  }

  constructor({ targetId, targetTitle, item }) {
    super({ title: targetTitle, panelClass: 'link-open-popup' })
    this._targetId = targetId
    this._item     = item
    this._options  = [
      { key: 'g', label: "Dans son évènemencier", action: () => { this._doClose(); this._item.goLink()    } },
      { key: 'c', label: 'Afficher sa carte',      action: () => { this._doClose()                         } },
      { key: 'a', label: "Dans une autre fenêtre", action: () => { this._doClose(); this._item.splitLink() } },
    ]
    this._footerKeyMap = {
      g: () => { this._doClose(); this._item.goLink()    },
      c: () =>   this._doClose(),
      a: () => { this._doClose(); this._item.splitLink() },
    }
  }

  _doClose() {
    this.close()
    this._item.el?.focus()
  }

  _getItemCount() { return this._options.length }

  _renderContent(zone) {
    this._options.forEach(({ key, label }, i) => {
      const row = document.createElement('div')
      row.className = 'ftpanel__item'
      if (i === 0) row.classList.add('selected')

      const keyBadge = document.createElement('span')
      keyBadge.className = 'link-open-popup__key'
      keyBadge.textContent = key

      const labelSpan = document.createElement('span')
      labelSpan.textContent = label

      row.appendChild(keyBadge)
      row.appendChild(labelSpan)
      zone.appendChild(row)
    })
  }

  _onEnterItem(index) {
    this._options[index]?.action()
  }

  _getFooterButtons() {
    return [{ label: 'Fermer', type: 'cancel', action: () => this._doClose() }]
  }

}
