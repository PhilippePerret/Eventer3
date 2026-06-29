import Lister from '../abstract/Lister.js'
import Event from './Event.js'

export default class ListerEvent extends Lister {
  static ITEM_CLASS  = Event
  static CHILD_CLASS = ListerEvent
  static TYPE        = 'events'
  static PANEL_ID    = 'events-panel'

  constructor(data = {}) {
    super(data)
    this.project = data.project ?? null
  }

  refreshEventMarks(modifiedBrins) {
    this.items.forEach(ev => {
      (ev.brin_ids ?? []).forEach(bid => {
        const mb = modifiedBrins[bid]
        if (!mb) return
        if (mb.hasChanged.color)  ev.refreshColor?.()
        if (mb.hasChanged.persos) ev.refreshPersosMarks()
      })
    })
  }
}
