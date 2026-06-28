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
}
