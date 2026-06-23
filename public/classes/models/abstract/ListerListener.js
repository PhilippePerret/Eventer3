import BaseListener from './BaseListener.js'

export default class ListerListener extends BaseListener {

  constructor(lister) { super(); this.lister = lister }

  get target() { return this.lister }

  static LISTENERS = {
    ArrowUp:    { nokey: 'selectPrev'     },
    ArrowDown:  { nokey: 'selectNext'     },
    ArrowLeft:  { nokey: 'leaveToParent'  },
    n:          { nokey: 'createNew', alt: 'createNewBefore' },
    '˜':        { nokey: 'createNewBefore'                  },
    Delete:     { nokey: 'deleteSelected' },
  }

}
