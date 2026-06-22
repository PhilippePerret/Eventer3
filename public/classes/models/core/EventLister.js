import Lister from '../abstract/Lister.js'
import Event from './Event.js'

export default class EventLister extends Lister {
  static ITEM_CLASS  = Event
  static CHILD_CLASS = EventLister
  static TYPE        = 'events'
}
