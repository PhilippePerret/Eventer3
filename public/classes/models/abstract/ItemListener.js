import BaseListener from './BaseListener.js'
import { stopEvent } from '../../utils/events.js'

export default class ItemListener extends BaseListener {

  constructor(item) { super(); this.item = item }

  get target() { return this.item }

  onkeydown(ev) {
    if (this.item.editing && !this.constructor.LISTENERS[ev.key]) return stopEvent(ev)
    super.onkeydown(ev)
  }

  static LISTENERS = {
    Enter:      { nokey: 'onEnter'       },
    Escape:     { nokey: 'onEscape'      },
    Tab:        { nokey: 'onTab'         },
    ArrowRight: { nokey: 'enterChildren' },
  }

}
