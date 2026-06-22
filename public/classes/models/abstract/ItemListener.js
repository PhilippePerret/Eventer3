import BaseListener from './BaseListener.js'

export default class ItemListener extends BaseListener {

  constructor(item) { super(); this.item = item }

  get target() { return this.item }

  static LISTENERS = {
    Enter:      { nokey: 'onEnter'       },
    Escape:     { nokey: 'onEscape'      },
    Tab:        { nokey: 'onTab'         },
    ArrowRight: { nokey: 'enterChildren' },
  }

}
