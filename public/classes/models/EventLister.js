import Lister from './Lister.js'
import Event from './Event.js'

export default class EventLister extends Lister {

  constructor(data = {}) {
    super(data)
    this.itemClass = Event
  }

  get childListerClass() {
    return EventLister
  }

}
