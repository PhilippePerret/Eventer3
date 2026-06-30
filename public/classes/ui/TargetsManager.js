import Notification from './Notification.js'
import TargetsPanel from './TargetsPanel.js'

export default class TargetsManager {
  static MAX_TARGETS = 30

  constructor(project) {
    this._project = project
    this._targets = []
  }

  get targets()     { return this._targets }
  get pinnedCount() { return this._targets.filter(t => t.pinned).length }

  async load() {
    const lid = this._project.lister_id
    const pid = this._project.id
    if (!lid) return
    const res = await fetch(`/api/listers/${lid}?project_id=${pid}`, { cache: 'no-store' })
    const def = res.ok ? await res.json() : {}
    this._targets = (def.link_targets ?? []).map(t => ({ ...t, pinned: !!t.pinned }))
  }

  add(item) {
    if (this._targets.some(t => t.id === item.id)) {
      Notification.show(`Déjà dans les cibles : ${item.title}`)
      return
    }
    this._targets.push({ id: item.id, title: item.title, pinned: false })
    this._trimOverflow()
    Notification.show(`Cible mémorisée : ${item.title}`)
    this._save()
  }

  openPanel(field) {
    TargetsPanel.open(this, field)
  }

  moveUp(index) {
    const item = this._targets[index]
    if (!item) return false
    const pc = this.pinnedCount
    if (!item.pinned && index === pc) {
      item.pinned = true
      this._save()
      return 'pinned'
    }
    if (index > 0) {
      ;[this._targets[index - 1], this._targets[index]] = [this._targets[index], this._targets[index - 1]]
      this._save()
      return true
    }
    return false
  }

  moveDown(index) {
    const item = this._targets[index]
    if (!item) return false
    const pc = this.pinnedCount
    if (item.pinned && index === pc - 1) {
      item.pinned = false
      this._save()
      return 'unpinned'
    }
    if (index < this._targets.length - 1) {
      ;[this._targets[index], this._targets[index + 1]] = [this._targets[index + 1], this._targets[index]]
      this._save()
      return true
    }
    return false
  }

  _trimOverflow() {
    while (this._targets.length > TargetsManager.MAX_TARGETS) {
      for (let i = this._targets.length - 1; i >= 0; i--) {
        if (!this._targets[i].pinned) { this._targets.splice(i, 1); break }
      }
    }
  }

  _save() {
    fetch(`/api/items/${this._project.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ link_targets: this._targets }),
    }).catch(console.error)
  }
}
