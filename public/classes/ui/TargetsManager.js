import ListerRepository from '../repositories/ListerRepository.js'
import Notification from './Notification.js'

export default class TargetsManager {
  static MAX_TARGETS = 30

  constructor() {
    this._targets   = []
    this._projectId = null
  }

  get targets()     { return this._targets }
  get pinnedCount() { return this._targets.filter(t => t.pinned).length }

  load(targets, projectId) {
    this._targets   = targets ? targets.map(t => ({ ...t, pinned: !!t.pinned })) : []
    this._projectId = projectId
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

  // Returns 'pinned' | true | false
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

  // Returns 'unpinned' | true | false
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
      let removed = false
      for (let i = this._targets.length - 1; i >= 0; i--) {
        if (!this._targets[i].pinned) {
          this._targets.splice(i, 1)
          removed = true
          break
        }
      }
      if (!removed) break
    }
  }

  _save() {
    if (!this._projectId) return
    ListerRepository.saveItem({ id: this._projectId }, { link_targets: this._targets }).catch(console.error)
  }
}
