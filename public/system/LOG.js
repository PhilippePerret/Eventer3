export default class LOG {

  static level = 0

  static on(level = 1) {
    this.level = level
  }

  static off() {
    this.level = 0
  }

  static m(...args) {

    if (this.level === 0) return

    let messageLevel   = 1
    let message        = null
    let messagePayload = []

    if (typeof args[0] === 'number') {
      messageLevel = args[0]
      message = args[1]
      messagePayload = args.slice(2)
    } else {
      message = args[0]
      messagePayload = args.slice(1)
    }

    if (messageLevel > this.level) return

    console.log(`[LOG ${messageLevel}]`, message, ...messagePayload)

  }

static warn(...args) {
    console.warn(
      '%c[WARN]',
      'color:red;font-weight:bold;',
      ...args
    )
  }

  static w(...args) {
    this.warn(...args)
  }
}